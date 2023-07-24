const Polycube = require('../Polycube');
const utils = require('../utils');
const { ORIENTATION } = require('../constants');
const { DEDUP_ADDITIONS, NORMALIZE_ROTATIONS, DEDUP_ROTATIONS, COUNT_CORNERS_TO_GROUP } = require('../options');

/*
	This whole file is super un-optimized.
	This just explains the approach in as simple a manner as possible.
	No frills, clear steps, you can inspect that it will generate correct answers.

	This will run very very slow and do the same things many times over.
	But we can use it to verify we are generating the correct answers for low `n`.
	We can use this as the baseline, and then start getting fancy.
*/

/**
	@param {Polycube[]} polycubes all polycubes of size=n
	@returns {Polycube[]} all polycubes of size=(n+1)
*/
function generateNextSimple(polycubes, { verbose } = {}) {
	if (verbose) console.time(' … additions');
	if (verbose > 1) console.info();
	const nexts = [];
	polycubes.forEach((polycube, idx) => {
		const locations = listLocationsToGrow(polycube);
		const ns = locations
			.map((location) => grow(polycube, location))
			.map((p) => (NORMALIZE_ROTATIONS ? normalizeOrientation(p) : p));

		if (DEDUP_ADDITIONS) {
			ns.forEach((n) => {
				const alreadyExists = nexts.some((next) => n.equals(next));
				if (!alreadyExists) {
					nexts.push(n);
				}
			});
		}
		else {
			Array.prototype.push.apply(nexts, ns);
		}
		if (verbose > 1) console.info(`   ${idx + 1} of ${polycubes.length}: found ${nexts.length} options`);
	});
	if (verbose) console.timeEnd(' … additions');

	if (verbose) console.time(' … rotate');
	if (verbose > 1) console.info();
	const nextsRotated = nexts.map((next) => rotate(next));
	if (verbose > 1) console.info(`   ${nexts.length} into total rotations ${nextsRotated.reduce((ret, r) => ret + r.length, 0)}`);
	if (verbose) console.timeEnd(' … rotate');

	if (verbose) console.time(' … unique');
	if (verbose > 1) console.info();
	const found = [];
	aggregate(found, nextsRotated);
	found.sort((a, b) => b.serialized.localeCompare(a.serialized));
	if (verbose) console.timeEnd(' … unique');

	return found;
}

/**
	shapes with different sizes will never be equal
	i.e. [1,2,3] will never equal [2,2,3]

	in which case, we can organize them into different lists
	then we will have smaller lists when we aggregate (dedupping is expensive)
	instead of every shape in one giant list, we'll have different lists for each size

	this requires NORMALIZE_ROTATIONS to work
	i mean, we _could_ do it without normalize, but it doesn't quite make sense to support that
	 - i guess a naive way would be to group by x+y+z lengths, and have too many things in the lists; it'd be _better_
	 - or we could, well, normalize the x,y,z without rotating them, and then generate all 24 rotations, but srsly, this is awful

	TODO stop using lists to hold intermediates
	 - i/o should be a list
	 - sizedGroups, nexts, anytime there's a dedup

	@param {Polycube[]} polycubes all polycubes of size=n
	@returns {Polycube[]} all polycubes of size=(n+1)
*/
function generateNextGroupBySize(polycubes, { verbose } = {}) {
	if (verbose && !NORMALIZE_ROTATIONS) console.warn('generateNextGroupBySize must normalize rotations; NORMALIZE_ROTATIONS=false will be ignored');

	if (verbose) console.time(' … additions');
	if (verbose > 1) console.info();
	const sizeGroups = new Map();
	function getSizeGroup(polycube) {
		const [xLength, yLength, zLength] = utils.shape.size(polycube.shape);
		let size = [xLength, yLength, zLength].join('/');
		if (COUNT_CORNERS_TO_GROUP) {
			const xMax = xLength - 1;
			const yMax = yLength - 1;
			const zMax = zLength - 1;
			const corners = polycube.shape[0][0][0]
				+ polycube.shape[xMax][0][0]
				+ polycube.shape[0][yMax][0]
				+ polycube.shape[xMax][yMax][0]
				+ polycube.shape[0][0][zMax]
				+ polycube.shape[xMax][0][zMax]
				+ polycube.shape[0][yMax][zMax]
				+ polycube.shape[xMax][yMax][zMax];
			size += `+${corners}`;
		}
		if (!sizeGroups.has(size)) {
			sizeGroups.set(size, []);
		}
		return sizeGroups.get(size);
	}

	polycubes.forEach((polycube, idx) => {
		const locations = listLocationsToGrow(polycube);
		const nexts = locations
			.map((location) => grow(polycube, location))
			.map((next) => normalizeOrientation(next));

		nexts.forEach((next) => {
			const sizeGroup = getSizeGroup(next);
			if (DEDUP_ADDITIONS) {
				const alreadyExists = sizeGroup.some((p) => next.equals(p));
				if (!alreadyExists) {
					sizeGroup.push(next);
				}
			}
			else {
				sizeGroup.push(next);
			}
		});
		if (verbose > 1) {
			let nestsCount = 0;
			sizeGroups.forEach((list) => { nestsCount += list.length; });
			console.info(`   ${idx + 1} of ${polycubes.length}: found ${nestsCount} options`);
		}
	});
	if (verbose) console.timeEnd(' … additions');

	if (verbose) console.time(' … rotate');
	if (verbose > 1) console.info();
	sizeGroups.forEach((list, size) => {
		const nextsRotated = list.map((next) => rotate(next));
		sizeGroups.set(size, nextsRotated);
	});

	let maxRotatedPadding = 2;
	let maxRotatedSumPadding = 2;
	if (verbose > 1) {
		let nextsRotatedCount = 0;
		sizeGroups.forEach((nextsRotated) => {
			const maxRotatedSum = nextsRotated.reduce((s, rotations) => s + rotations.length, 0);
			nextsRotatedCount += maxRotatedSum;
			maxRotatedPadding = Math.max(maxRotatedPadding, nextsRotated.length.toString().length);
			maxRotatedSumPadding = Math.max(maxRotatedSumPadding, maxRotatedSum.toString().length);
		});
		console.info(`   rotations ${nextsRotatedCount}`);
	}
	if (verbose) console.timeEnd(' … rotate');

	if (verbose) console.time(' … unique');
	if (verbose > 1) console.info();
	const found = [];
	let groupNum = 0;
	sizeGroups.forEach((nextsRotated, size) => {
		groupNum += 1;
		const foundHere = [];
		aggregate(foundHere, nextsRotated);
		Array.prototype.push.apply(found, foundHere);
		if (verbose > 1) {
			console.info(`   ${size} (${groupNum} of ${sizeGroups.size})`
				+ ` found ${foundHere.length.toString().padStart(maxRotatedPadding)}`
				+ ` from ${nextsRotated.length.toString().padStart(maxRotatedPadding)}`
				+ ` (↻ ${nextsRotated.reduce((s, rotations) => s + rotations.length, 0).toString().padStart(maxRotatedSumPadding)})`);
		}
	});
	found.sort((a, b) => b.serialized.localeCompare(a.serialized));
	if (verbose) console.timeEnd(' … unique');

	return found;
}

/**
	list all the places we could place the next cube

	@param {Polycube} polycube
*/
function listLocationsToGrow(polycube) {
	const locations = [];

	function checkNewLocation(x, y, z) {
		if (polycube.shape[x]?.[y]?.[z] !== 1) {
			locations.push([x, y, z]);
		}
	}

	polycube.shape.forEach((ys, x) => {
		ys.forEach((zs, y) => {
			zs.forEach((v, z) => {
				if (v === 1) {
					// x,y,z is filled in
					// we can do any of the adjacent squares
					// don't grow to a new location if it's already filled in
					checkNewLocation(x + 1, y, z);
					checkNewLocation(x - 1, y, z);
					checkNewLocation(x, y + 1, z);
					checkNewLocation(x, y - 1, z);
					checkNewLocation(x, y, z + 1);
					checkNewLocation(x, y, z - 1);
				}
			});
		});
	});

	return locations;
}

/**
	@param {Polycube} polycube
	@param {number[]} location
	@returns {Polycube}
*/
function grow(polycube, [x, y, z]) {
	const shape = utils.shape.clone(polycube.shape);
	const [xLength, yLength, zLength] = polycube.size();

	// if (x < -1) throw new Error('x is too small');
	// if (x > xLength) throw new Error('x is too large');
	// if (y < -1) throw new Error('y is too small');
	// if (y > yLength) throw new Error('y is too large');
	// if (z < -1) throw new Error('z is too small');
	// if (z > zLength) throw new Error('z is too large');

	if (x === -1) {
		utils.shape.expand.nX(shape);
		// we shifted the whole thing over to make room for this
		x = 0;
	}
	else if (x === xLength) {
		utils.shape.expand.x(shape);
		// x is now valid
	}
	else if (y === -1) {
		utils.shape.expand.nY(shape);
		// we shifted the whole thing over to make room for this
		y = 0;
	}
	else if (y === yLength) {
		utils.shape.expand.y(shape);
		// y is now valid
	}
	else if (z === -1) {
		utils.shape.expand.nZ(shape);
		// we shifted the whole thing over to make room for this
		z = 0;
	}
	else if (z === zLength) {
		utils.shape.expand.z(shape);
		// z is now valid
	}
	else if (shape[x][y][z] === 1) {
		// return null;
		throw new Error(`[${x},${y},${z}] is already filled in, this should be prevented sooner`);
	}

	shape[x][y][z] = 1;
	return new Polycube({ shape });
}

/**
	rotate the polycube across all dimensions

	@param {Polycube} polycube
	@returns {Polycube} same shape, but rotated so the size is [sm, md, lg]
*/
function normalizeOrientation(polycube) {
	return new Polycube(utils.shape.normalize(polycube.shape));
}

/**
	rotate the polycube across all dimensions

	@param {Polycube} polycube
	@returns {Polycube[]} array of rotated items, the first is the same as the input
*/
function rotate(polycube) {
	// TODO split this into a separate file
	const rotations = [];

	const { orientation } = polycube;

	if (orientation === ORIENTATION.SM_MD_LG || orientation === ORIENTATION.SM_SM_MD) {
		// seed it
		let { shape } = polycube;
		rotations.push(shape);
		// spin it 3 times
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		// flip it
		shape = utils.shape.rotate.y(shape);
		shape = utils.shape.rotate.y(shape);
		rotations.push(shape);
		// spin it 3 times
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
	}

	else if (orientation === ORIENTATION.SM_MD_MD) {
		// seed it
		let { shape } = polycube;
		rotations.push(shape);
		// spin it 3 times
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		// flip it
		shape = utils.shape.rotate.y(shape);
		shape = utils.shape.rotate.y(shape);
		rotations.push(shape);
		// spin it 3 times
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
	}

	else {
		// does not have a unique axis, so we need to check all 24
		// orientation === ORIENTATION.SM_SM_SM
		// orientation === undefined

		// reuse intermediate rotations (x, y, z, nX, xx, xy, xz)
		const rotatedX = utils.shape.rotate.x(polycube.shape);
		const rotatedY = utils.shape.rotate.y(polycube.shape);
		const rotatedZ = utils.shape.rotate.z(polycube.shape);
		const rotatedNX = utils.shape.rotate.nX(polycube.shape);
		const rotatedXX = utils.shape.rotate.x(rotatedX);
		const rotatedXY = utils.shape.rotate.y(rotatedX);
		const rotatedXZ = utils.shape.rotate.z(rotatedX);

		// zero
		rotations.push(polycube.shape);

		// once
		rotations.push(rotatedX);
		rotations.push(rotatedY);
		rotations.push(rotatedZ);
		rotations.push(rotatedNX);
		rotations.push(utils.shape.rotate.nY(polycube.shape));
		rotations.push(utils.shape.rotate.nZ(polycube.shape));

		// twice
		rotations.push(rotatedXX);
		rotations.push(rotatedXY);
		rotations.push(rotatedXZ);
		rotations.push(utils.shape.rotate.nY(rotatedX));
		rotations.push(utils.shape.rotate.nZ(rotatedX));
		rotations.push(utils.shape.rotate.y(rotatedY));
		rotations.push(utils.shape.rotate.z(rotatedY));
		rotations.push(utils.shape.rotate.nX(rotatedY));
		rotations.push(utils.shape.rotate.z(rotatedZ));
		rotations.push(utils.shape.rotate.nY(rotatedZ));
		rotations.push(utils.shape.rotate.nY(rotatedNX));

		// thrice
		rotations.push(utils.shape.rotate.y(rotatedXX));
		rotations.push(utils.shape.rotate.z(rotatedXX));
		rotations.push(utils.shape.rotate.nY(rotatedXX));
		rotations.push(utils.shape.rotate.nZ(rotatedXX));
		rotations.push(utils.shape.rotate.y(rotatedXY));
		rotations.push(utils.shape.rotate.z(rotatedXZ));
	}

	if (DEDUP_ROTATIONS) {
		const orig = rotations.splice(0);
		orig.forEach((o) => {
			const alreadyExists = rotations.some((r) => utils.shape.equals(o, r));
			if (!alreadyExists) {
				rotations.push(o);
			}
		});
	}

	// rotate should have a length of 24
	return rotations.map((shape) => new Polycube({ shape, orientation }));
}

function aggregate(found, nextsRotated) {
	const foundSerialized = new Set();
	nextsRotated.forEach((rotations) => {
		if (found.length === 0) {
			found.push(rotations[0]);
			foundSerialized.add(rotations[0].serialized);
		}
		else {
			// the first of the rotations is our vanguard, the one we want to add
			// all the rest are other rotations, basically duplicates
			// if any of the rotations are a match, then we don't add our vanguard
			const alreadyExists = rotations.some((polycube) => (
				foundSerialized.has(polycube.serialized)
			));
			if (!alreadyExists) {
				found.push(rotations[0]);
				foundSerialized.add(rotations[0].serialized);
			}
		}
	});
}

exports.generateNextSimple = generateNextSimple;
exports.generateNextGroupBySize = generateNextGroupBySize;
exports.listLocationsToGrow = listLocationsToGrow;
exports.rotate = rotate;
