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
function generateNext(polycubes) {
	const nexts = [];
	polycubes.forEach((polycube) => {
		const locations = listLocationsToGrow(polycube);
		const ns = locations
			.map((location) => grow(polycube, location))
			.filter((p) => !!p); // filter out failed grow attempts
		Array.prototype.push.apply(nexts, ns);
	});
	// XXX dedup nexts

	const nextsRotated = nexts.map((next) => rotate(next));
	// XXX dedup rotations of nexts
	// XXX dedup nexts using rotations

	const found = [];
	aggregate(found, nextsRotated);

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
					locations.push([x + 1, y, z]);
					locations.push([x - 1, y, z]);
					// locations.push([x, y + 1, z]); // FIXME use when impl
					// locations.push([x, y - 1, z]); // FIXME use when impl
					// locations.push([x, y, z + 1]); // FIXME use when impl
					// locations.push([x, y, z - 1]); // FIXME use when impl
				}
			});
		});
	});

	return locations;
}

/**
	@param {Polycube} polycube
	@param {number[]} location
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
		utils.shape.expandNegX(shape, xLength, yLength, zLength);
		// we shifted the whole thing over to make room for this
		x = 0;
	}
	else if (x === xLength) {
		utils.shape.expandX(shape, xLength, yLength, zLength);
		// x is now valid
	}
	else if (y === -1) {
		throw new Error('impl expand neg y'); // FIXME expand neg y
	}
	else if (y === yLength) {
		throw new Error('impl expand y'); // FIXME expand y
	}
	else if (z === -1) {
		throw new Error('impl expand neg z'); // FIXME expand neg z
	}
	else if (z === zLength) {
		throw new Error('impl expand z'); // FIXME expand z
	}
	else if (shape[x][y][z] === 1) {
		return null;
	}

	shape[x][y][z] = 1;
	return new Polycube({ shape });
}

/**
	rotate the polycube across all dimensions
	FIXME finish

	@param {Polycube} polycube
	@return {Polycube[]} array of rotated items, the first is the same as the input
*/
function rotate(polycube) {
	return [polycube];
}

function aggregate(found, nextsRotated) {
	nextsRotated.forEach(() => {
		if (found.length === 0) {
			found.push(nextsRotated[0][0]);
		}
		else {
			// find match
			const alreadyExists = nextsRotated.some((rotations) => (
				rotations.some((polycube) => (
					found.some((p) => (
						utils.shape.equals(polycube.shape, p.shape)
					))
				))
			));
			if (!alreadyExists) {
				found.push(nextsRotated[0][0]);
			}
		}
	});
}

exports.generateNext = generateNext;
exports.listLocationsToGrow = listLocationsToGrow;
