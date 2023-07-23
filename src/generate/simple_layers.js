const Polycube = require('../Polycube');
const utils = require('../utils');
const { ORIENTATION } = require('../constants');
const { DEDUP_ADDITIONS, USE_ACTUAL_ROTATIONS, NORMALIZE_ROTATIONS, GROUP_BY_SIZE } = require('../options');

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
function generateNext(polycubes, { verbose } = {}) {
	if (GROUP_BY_SIZE) {
		if (NORMALIZE_ROTATIONS && DEDUP_ADDITIONS) {
			return generateNextGroupBySize(polycubes, { verbose });
		}
		console.warn('WARNING: GROUP_BY_SIZE cannot be used without both NORMALIZE_ROTATIONS and DEDUP_ADDITIONS');
	}

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
				const alreadyExists = nexts.some((next) => (
					n.equals(next)
				));
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
	const nextsRotated = USE_ACTUAL_ROTATIONS
		? nexts.map((next) => rotate(next))
		: nexts.map((next) => next.rotations());
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
	not sure if this is grounds for creating a new file?

	@param {Polycube[]} polycubes all polycubes of size=n
	@returns {Polycube[]} all polycubes of size=(n+1)
*/
function generateNextGroupBySize(polycubes, { verbose } = {}) {
	if (verbose) console.time(' … additions');
	if (verbose > 1) console.info();
	const sizeGroups = {};
	function getSizeGroup(polycube) {
		const [xLength, yLength, zLength] = utils.shape.size(polycube.shape);
		if (!sizeGroups[xLength]) sizeGroups[xLength] = {};
		if (!sizeGroups[xLength][yLength]) sizeGroups[xLength][yLength] = {};
		if (!sizeGroups[xLength][yLength][zLength]) sizeGroups[xLength][yLength][zLength] = [];
		return sizeGroups[xLength][yLength][zLength];
	}

	polycubes.forEach((polycube, idx) => {
		const locations = listLocationsToGrow(polycube);
		const nexts = locations
			.map((location) => grow(polycube, location))
			.map((next) => normalizeOrientation(next));

		nexts.forEach((next) => {
			const sizeGroup = getSizeGroup(next);
			const alreadyExists = sizeGroup.some((p) => next.equals(p));
			if (!alreadyExists) {
				sizeGroup.push(next);
			}
		});
		if (verbose > 1) {
			const nestsCount = Object.values(sizeGroups).reduce((sx, ys) => (
				sx + Object.values(ys).reduce((sy, zs) => (
					sy + Object.values(zs).reduce((sz, list) => (
						sz + list.length
					), 0)
				), 0)
			), 0);
			console.info(`   ${idx + 1} of ${polycubes.length}: found ${nestsCount} options`);
		}
	});
	if (verbose) console.timeEnd(' … additions');

	if (verbose) console.time(' … rotate');
	if (verbose > 1) console.info();
	Object.entries(sizeGroups).forEach(([xLength, ys]) => {
		Object.entries(ys).forEach(([yLength, zs]) => {
			Object.entries(zs).forEach(([zLength, list]) => {
				const nextsRotated = USE_ACTUAL_ROTATIONS
					? list.map((next) => rotate(next))
					: list.map((next) => next.rotations());
				sizeGroups[xLength][yLength][zLength] = nextsRotated;
			}, 0);
		}, 0);
	}, 0);

	let maxRotatedPadding = 2;
	let maxRotatedSumPadding = 2;
	if (verbose > 1) {
		let nextsRotatedCount = 0;
		Object.values(sizeGroups).forEach((ys) => {
			Object.values(ys).forEach((zs) => {
				Object.values(zs).forEach((nextsRotated) => {
					const maxRotatedSum = nextsRotated.reduce((s, rotations) => s + rotations.length, 0);
					nextsRotatedCount += maxRotatedSum;
					maxRotatedPadding = Math.max(maxRotatedPadding, nextsRotated.length.toString().length);
					maxRotatedSumPadding = Math.max(maxRotatedSumPadding, maxRotatedSum.toString().length);
				}, 0);
			}, 0);
		}, 0);
		console.info(`   rotations ${nextsRotatedCount}`);
	}
	if (verbose) console.timeEnd(' … rotate');

	if (verbose) console.time(' … unique');
	if (verbose > 1) console.info();
	const found = [];
	Object.values(sizeGroups).forEach((ys) => {
		Object.values(ys).forEach((zs) => {
			Object.values(zs).forEach((nextsRotated) => {
				const foundHere = [];
				aggregate(foundHere, nextsRotated);
				Array.prototype.push.apply(found, foundHere);
				if (verbose > 1) {
					console.info(`   ${JSON.stringify(utils.shape.size(foundHere[0].shape))}`
						+ ` found ${foundHere.length.toString().padStart(maxRotatedPadding)}`
						+ ` from ${nextsRotated.reduce((s, rotations) => s + rotations.length, 0).toString().padStart(maxRotatedSumPadding)}`);
				}
			}, 0);
		}, 0);
	}, 0);
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

	if (polycube.orientation === ORIENTATION.SM_MD_LG || polycube.orientation === ORIENTATION.SM_SM_MD) {
		const rotations = [];
		// seed it
		let { shape } = polycube;
		rotations.push(shape);
		// spin it x3
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		// flip it
		shape = utils.shape.rotate.y(shape);
		shape = utils.shape.rotate.y(shape);
		// spin it x3
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.z(shape);
		rotations.push(shape);
		// finish it
		return rotations;
	}
	if (polycube.orientation === ORIENTATION.SM_MD_MD) {
		const rotations = [];
		// seed it
		let { shape } = polycube;
		rotations.push(shape);
		// spin it x3
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		// flip it
		shape = utils.shape.rotate.y(shape);
		shape = utils.shape.rotate.y(shape);
		// spin it x3
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		shape = utils.shape.rotate.x(shape);
		rotations.push(shape);
		// finish it
		return rotations;
	}

	// ORIENTATION.SM_SM_SM - does not have a unique axis

	// reuse intermediate rotations (x, y, z, nX, xx, xy, xz)
	const rotatedX = utils.shape.rotate.x(polycube.shape);
	const rotatedY = utils.shape.rotate.y(polycube.shape);
	const rotatedZ = utils.shape.rotate.z(polycube.shape);
	const rotatedNX = utils.shape.rotate.nX(polycube.shape);
	const rotatedXX = utils.shape.rotate.x(rotatedX);
	const rotatedXY = utils.shape.rotate.y(rotatedX);
	const rotatedXZ = utils.shape.rotate.z(rotatedX);

	const rotations = [
		// zero
		polycube.shape,

		// once
		rotatedX,
		rotatedY,
		rotatedZ,
		rotatedNX,
		utils.shape.rotate.nY(polycube.shape),
		utils.shape.rotate.nZ(polycube.shape),

		// twice
		rotatedXX,
		rotatedXY,
		rotatedXZ,
		utils.shape.rotate.nY(rotatedX),
		utils.shape.rotate.nZ(rotatedX),
		utils.shape.rotate.y(rotatedY),
		utils.shape.rotate.z(rotatedY),
		utils.shape.rotate.nX(rotatedY),
		utils.shape.rotate.z(rotatedZ),
		utils.shape.rotate.nY(rotatedZ),
		utils.shape.rotate.nY(rotatedNX),

		// thrice
		utils.shape.rotate.y(rotatedXX),
		utils.shape.rotate.z(rotatedXX),
		utils.shape.rotate.nY(rotatedXX),
		utils.shape.rotate.nZ(rotatedXX),
		utils.shape.rotate.y(rotatedXY),
		utils.shape.rotate.z(rotatedXZ),
	];

	// rotate should have a length of 24
	return rotations.map((shape) => new Polycube({ shape }));
}

function aggregate(found, nextsRotated) {
	nextsRotated.forEach(() => {
		if (found.length === 0) {
			found.push(nextsRotated[0][0]);
		}
		else {
			// each nexts is an option
			nextsRotated.forEach((rotations) => {
				// the first of the rotations is our vanguard, the one we want to add
				// all the rest are other rotations, basically duplicates
				// if any of the rotations are a match, then we don't add our vanguard
				const alreadyExists = rotations.some((polycube) => (
					found.some((f) => (
						f.equals(polycube)
					))
				));
				if (!alreadyExists) {
					found.push(rotations[0]);
				}
			});
		}
	});
}

exports.generateNext = generateNext;
exports.listLocationsToGrow = listLocationsToGrow;
exports.rotate = rotate;
