const utils = require('./utils');

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
			this.$serialized = this.shape.map((ys) => (
				ys.map((zs) => (
					// IDEA collapse consecutive numbers
					//  - z is the largest dimension (e.g. sm_sm_md)
					//  - 3x0_1_2x0_2x1
					//  - 0_0_0_1_2_2_1_1
					//  - we only get a benefit if there are 3 or more in a row
					zs.join('_') // these provide visual clarity, could use 'z' for technical clarity
				)).join(' ') // these provide visual clarity, could use 'y' for technical clarity
			)).join('/'); // these provide visual clarity, could use 'x' for technical clarity
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
		shapes with different sizes will never be equal
		i.e. [1,2,3] will never equal [2,2,3]

		in which case, we can organize them into different lists
		then we will have smaller lists when we aggregate (dedupping is expensive)
		instead of every shape in one giant list, this lets us break the problem down

		counting corners can divide groups further into 9 groups
		we know that _every_ cube will have 8 corners, so we can count the number of 1s
		the same shape will have the same count regardles of rotation, and it's trivial to do

		+0, +1, +2, +3, +4, +5, +6, +7, +8

		@returns {string}
	*/
	sizeGroup() {
		const [xLength, yLength, zLength] = this.size();
		const xMax = xLength - 1;
		const yMax = yLength - 1;
		const zMax = zLength - 1;
		const corners = this.shape[0][0][0]
			+ this.shape[xMax][0][0]
			+ this.shape[0][yMax][0]
			+ this.shape[xMax][yMax][0]
			+ this.shape[0][0][zMax]
			+ this.shape[xMax][0][zMax]
			+ this.shape[0][yMax][zMax]
			+ this.shape[xMax][yMax][zMax];
		return `${xLength}/${yLength}/${zLength}+${corners}`;
	}

	/**
		returns the number of cubes in the polycube
		we shouldn't ever actually need this, it should just be implicit
		this is mostly just to start getting a handled on the data

		@returns {number}
	*/
	n() {
		return this.shape.reduce((rx, ys) => (rx + ys.reduce((ry, zs) => (ry + zs.reduce((rz, v) => (rz + (v === 1 ? 1 : 0)), 0)), 0)), 0);
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
}

module.exports = Polycube;
