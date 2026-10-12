const { DEDUP_ROTATIONS } = require('./options');
const utils = require('./utils');

/**
	Encode runs of three or more z values as `{count}x{value}` to shorten Map keys.
	This does no provide a substantial runtime difference, but it does reduce the final serial (68→52).

	@example
		`1_1_1_1_0_0_0` → `4x1_3x0`
*/
function serializeZValues(values) {
	// return values.join('_');

	/*
	// first pass to check if there are any consecutive runs to collapse
	let index = 0;
	while (index + 2 < values.length
		&& !(values[index] === values[index + 1] && values[index] === values[index + 2])) {
		index += 1;
	}
	if (index + 2 >= values.length) return values.join('_');
	*/

	const serialized = [];
	for (let index = 0; index < values.length;) {
		let end = index + 1;
		while (end < values.length && values[end] === values[index]) {
			end += 1;
		}

		const count = end - index;
		if (count >= 3) {
			serialized.push(`${count}x${values[index]}`);
		} else {
			for (let i = 0; i < count; i += 1) {
				serialized.push(values[index]);
			}
		}
		index = end;
	}
	return serialized.join('_');
}

class Polycube {
	/**
		@param {number[][][]} shape - rectangular matrix; 0s are empty, 1s are full
		@param {number} orientation - how is this shape physically oriented; how do x,y,z lengths relate to each other

		@see `constants.ORIENTATION` for more detail on `orientation`
	*/
	constructor({ shape, orientation = undefined }) {
		this.shape = shape;
		if (orientation) this.orientation = orientation;
	}

	get serialized() {
		if (!this.$serialized) {
			// collapsing all consecutive z values is not worthwhile; e.g. n=7 has 0,0,0,0,0 at 47/1023 = 5%
			// running a convolution (or other hash) over the serial doesn't buy much; this is used as a key, not just equality
			// NOTE deduping is primarily done with a Map key, rather than Polycube.equals
			// prettier-ignore
			this.$serialized = this.shape.map((ys) => (
				ys.map((zs) => (
					serializeZValues(zs)
					// zs.join('_') // '_' provides visual clarity, could use 'z' for technical clarity
				)).join(' ') // ' ' provides visual clarity, could use 'y' for technical clarity
			)).join('/'); // '/' provides visual clarity, could use 'x' for technical clarity
		}
		return this.$serialized;
	}

	/**
		returns the dimensions of the polycube

		@usage `const [xLength, yLength, zLength] = polycube.size();`
		@returns {number[]}
	*/
	size() {
		return utils.shape.size(this.shape);
	}

	/**
		## size

		shapes with different sizes will never be equal
		i.e. [1,2,3] will never equal [2,2,3]

		in which case, we can organize them into different lists
		then we will have smaller lists when we aggregate (dedupping is expensive)
		instead of every shape in one giant list, this lets us break the problem down

		## corners

		counting corners can divide groups further into 9 groups
		we know that _every_ cube will have 8 corners, so we can count the number of 1s
		the same shape will have the same count regardles of rotation, and it's trivial to do

		+0, +1, +2, +3, +4, +5, +6, +7, +8

		@returns {string} "x/y/z+corners"
	*/
	sizeGroup() {
		const [xLength, yLength, zLength] = this.size();
		const xMax = xLength - 1;
		const yMax = yLength - 1;
		const zMax = zLength - 1;
		const corners =
			this.shape[0][0][0] +
			this.shape[xMax][0][0] +
			this.shape[0][yMax][0] +
			this.shape[xMax][yMax][0] +
			this.shape[0][0][zMax] +
			this.shape[xMax][0][zMax] +
			this.shape[0][yMax][zMax] +
			this.shape[xMax][yMax][zMax];
		return `${xLength}x${yLength}x${zLength}+${corners}`;
	}

	/**
		returns the number of cubes in the polycube
		we shouldn't ever actually need this, it should just be implicit
		this is mostly just to start getting a handled on the data

		@returns {number}
	*/
	n() {
		// prettier-ignore
		return this.shape.reduce((rx, ys) => (
			rx + ys.reduce((ry, zs) => (
				ry + zs.reduce((rz, v) => (
					rz + (v === 1 ? 1 : 0)
				), 0)
			), 0)
		), 0);
	}

	/**
		checks to see if this polycube is the same shape as another

		@param {Polycube} polycube
		@returns {boolean}
	*/
	equals(polycube) {
		if (!polycube?.shape) throw new Error('polycube.equals must compare against polycubes');
		return this.serialized === polycube.serialized;
		/*
		if (USE_POLYCUBE_SERIALIZE_FOR_EQUALS) {
			return this.serialized === polycube.serialized;
		}
		return utils.shape.equals(this.shape, polycube.shape);
		*/
	}

	/**
		create all the rotations for this polycube
		24 if there is no orientation (or if all the dimensions are the same)
		8 if there is a unique dimension

		@returns {Polycube[]} array of rotated items, the first is the same as the input
	*/
	rotations(dedupRotations = DEDUP_ROTATIONS) {
		const { shape, orientation } = this;
		return utils.shape
			.makeRotations(shape, orientation, dedupRotations)
			.map((s) => (s === shape ? this : new Polycube({ shape: s, orientation })));
	}

	/**
		compare all the rotations for this polycube (with it's fixed orientation)
		picks a representative rotation (e.g. sort by axes)

		@returns {Polycube} the shape in the same overall orientation, but normalized for comparison
	*/
	normalize() {
		const { shape, orientation } = this;
		return utils.shape
			.makeRotations(shape, orientation, false, true)
			.map((rotatedShape) => new Polycube({ shape: rotatedShape, orientation }))
			.reduce((best, candidate) => (candidate.serialized > best.serialized ? candidate : best));
	}
}

module.exports = Polycube;
