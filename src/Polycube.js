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
		return utils.shape.equals(this.shape, polycube.shape);
	}
}

module.exports = Polycube;
