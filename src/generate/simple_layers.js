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
	@param {Polycube[]} polycubes
*/
function generateNext(polycubes, { verbose } = {}) {
	if (verbose) console.time(' … find');
	if (verbose > 1) console.info();
	const nexts = [];
	polycubes.forEach((polycube, idx) => {
		const locations = listLocationsToGrow(polycube);
		const ns = locations
			.map((location) => grow(polycube, location))
			.filter((p) => !!p); // filter out failed grow attempts
		Array.prototype.push.apply(nexts, ns);
		if (verbose > 1) console.info(`   ${idx + 1} of ${polycubes.length}: found ${nexts.length} options`);
	});
	// XXX dedup nexts
	if (verbose) console.timeEnd(' … find');

	if (verbose) console.time(' … rotate');
	if (verbose > 1) console.info();
	const nextsRotated = nexts.map((next) => rotate(next));
	// XXX dedup rotations of nexts
	// XXX dedup nexts using rotations
	if (verbose > 1) console.info(`   ${nexts.length} into total rotations ${nextsRotated.reduce((ret, r) => ret + r.length, 0)}`);
	if (verbose) console.timeEnd(' … rotate');

	if (verbose) console.time(' … check');
	if (verbose > 1) console.info();
	const found = [];
	aggregate(found, nextsRotated);
	if (verbose) console.timeEnd(' … check');

	return found;
}

/**
	list all the places we could place the next cube

	@param {Polycube} polycube
*/
function listLocationsToGrow(polycube) {
	const locations = [];

	polycube.shape.forEach((ys, x) => {
		ys.forEach((zs, y) => {
			zs.forEach((v, z) => {
				if (v === 1) {
					// x,y,z is filled in
					// we can do any of the adjacent squares
					// (we could filter these locations, but they will very quickly get removed later)
					locations.push([x + 1, y, z]);
					locations.push([x - 1, y, z]);
					locations.push([x, y + 1, z]);
					locations.push([x, y - 1, z]);
					locations.push([x, y, z + 1]);
					locations.push([x, y, z - 1]);
				}
			});
		});
	});

	return locations;
}

/**
	@param {Polycube} polycube
	@param {number[]} location
	@return {Polycube}
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
		return null;
	}

	shape[x][y][z] = 1;
	return new Polycube({ shape });
}

/**
	rotate the polycube across all dimensions

	TODO all of these rotations are just different ways of iterating over an array
	 - instead of actually _creating_ the arrays, just loop over them in a different order
	 - (same x,y,z, but differnt math for getting to the index)
	 - we can still dedup them, mark which ones are the same

	@param {Polycube} polycube
	@return {Polycube[]} array of rotated items, the first is the same as the input
*/
function rotate(polycube) {
	const rotations = [
		// zero
		polycube.shape,

		// once
		utils.shape.rotate.x(polycube.shape),
		utils.shape.rotate.y(polycube.shape),
		utils.shape.rotate.z(polycube.shape),
		utils.shape.rotate.nX(polycube.shape),
		utils.shape.rotate.nY(polycube.shape),
		utils.shape.rotate.nZ(polycube.shape),

		// twice
		utils.shape.rotate.x(utils.shape.rotate.x(polycube.shape)),
		utils.shape.rotate.x(utils.shape.rotate.y(polycube.shape)),
		utils.shape.rotate.x(utils.shape.rotate.z(polycube.shape)),
		utils.shape.rotate.x(utils.shape.rotate.nY(polycube.shape)),
		utils.shape.rotate.x(utils.shape.rotate.nZ(polycube.shape)),
		utils.shape.rotate.y(utils.shape.rotate.y(polycube.shape)),
		utils.shape.rotate.y(utils.shape.rotate.nX(polycube.shape)),
		utils.shape.rotate.y(utils.shape.rotate.nZ(polycube.shape)),
		utils.shape.rotate.z(utils.shape.rotate.z(polycube.shape)),
		utils.shape.rotate.z(utils.shape.rotate.nX(polycube.shape)),
		utils.shape.rotate.nX(utils.shape.rotate.nZ(polycube.shape)),

		// thrice
		utils.shape.rotate.x(utils.shape.rotate.x(utils.shape.rotate.y(polycube.shape))),
		utils.shape.rotate.x(utils.shape.rotate.x(utils.shape.rotate.z(polycube.shape))),
		utils.shape.rotate.x(utils.shape.rotate.x(utils.shape.rotate.nY(polycube.shape))),
		utils.shape.rotate.x(utils.shape.rotate.x(utils.shape.rotate.nZ(polycube.shape))),
		utils.shape.rotate.x(utils.shape.rotate.y(utils.shape.rotate.y(polycube.shape))),
		utils.shape.rotate.x(utils.shape.rotate.z(utils.shape.rotate.z(polycube.shape))),
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
