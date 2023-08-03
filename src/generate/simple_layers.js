const { DEDUP_ADDITIONS, NORMALIZE_ROTATIONS } = require('../options');
const Polycube = require('../Polycube');
const utils = require('../utils');

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
	const nexts = (DEDUP_ADDITIONS ? new Map() : []);
	polycubes.forEach((polycube, idx) => {
		const locations = listLocationsToGrow(polycube);
		const ns = locations
			.map((location) => grow(polycube, location))
			.map((p) => (NORMALIZE_ROTATIONS ? normalizeOrientation(p) : p));

		if (DEDUP_ADDITIONS) {
			ns.forEach((n) => {
				nexts.set(n.serialized, n);
			});
		}
		else {
			Array.prototype.push.apply(nexts, ns);
		}
		if (verbose > 1) console.info(`   ${idx + 1} of ${polycubes.length}: found ${(DEDUP_ADDITIONS ? nexts.size : nexts.length)} options`);
	});
	if (verbose) console.timeEnd(' … additions');

	if (verbose) console.time(' … rotate');
	if (verbose > 1) console.info();
	const nextsRotated = (DEDUP_ADDITIONS ? Array.from(nexts.values()) : nexts).map((next) => next.rotations());
	if (verbose > 1) {
		console.info(`   ${(DEDUP_ADDITIONS ? nexts.size : nexts.length)}`
			+ ` into total rotations ${nextsRotated.reduce((ret, r) => ret + r.length, 0)}`);
	}
	if (verbose) console.timeEnd(' … rotate');

	if (verbose) console.time(' … unique');
	if (verbose > 1) console.info();
	const found = aggregate(nextsRotated);
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

	@param {Polycube[]} polycubes all polycubes of size=n
	@returns {Polycube[]} all polycubes of size=(n+1)
*/
function generateNextGroupBySize(polycubes, { verbose } = {}) {
	if (verbose && !NORMALIZE_ROTATIONS) console.warn('generateNextGroupBySize must normalize rotations; NORMALIZE_ROTATIONS=false will be ignored');

	if (verbose) console.time(' … additions');
	if (verbose > 1) console.info();
	const sizeGroups = new Map();
	function getSizeGroup(polycube) {
		const size = polycube.sizeGroup();
		if (!sizeGroups.has(size)) {
			sizeGroups.set(size, (DEDUP_ADDITIONS ? new Map() : []));
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
				sizeGroup.set(next.serialized, next);
			}
			else {
				sizeGroup.push(next);
			}
		});
		if (verbose > 1) {
			let nestsCount = 0;
			sizeGroups.forEach((list) => { nestsCount += (DEDUP_ADDITIONS ? list.size : list.length); });
			console.info(`   ${idx + 1} of ${polycubes.length}: found ${nestsCount} options`);
		}
	});
	if (verbose) console.timeEnd(' … additions');

	if (verbose) console.time(' … rotate');
	if (verbose > 1) console.info();
	sizeGroups.forEach((v, size) => {
		if (DEDUP_ADDITIONS) {
			sizeGroups.set(size, Array.from(v.values()).map((next) => next.rotations()));
		}
		else {
			sizeGroups.set(size, v.map((next) => next.rotations()));
		}
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
		const foundHere = aggregate(nextsRotated);
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

function aggregate(nextsRotated) {
	const foundMap = new Map();
	nextsRotated.forEach((rotations) => {
		if (foundMap.size === 0) {
			foundMap.set(rotations[0].serialized, rotations[0]);
		}
		else {
			// the first of the rotations is our vanguard, the one we want to add
			// all the rest are other rotations, basically duplicates
			// if any of the rotations are a match, then we don't add our vanguard
			const alreadyExists = rotations.some((polycube) => (
				foundMap.has(polycube.serialized)
			));
			if (!alreadyExists) {
				foundMap.set(rotations[0].serialized, rotations[0]);
			}
		}
	});
	return Array.from(foundMap.values());
}

exports.generateNextSimple = generateNextSimple;
exports.generateNextGroupBySize = generateNextGroupBySize;
exports.listLocationsToGrow = listLocationsToGrow;
exports.grow = grow;
