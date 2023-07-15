const utils = require('./utils');

class Polycube {
	/**
		@param {number[][][]} shape - rectangular matrix; 0s are empty, 1s are full
		@param {string} rotation - which rotation order to use when comparing
	*/
	constructor({ shape, rotation = undefined }) {
		this.shape = shape;
		if (rotation) this.rotation = rotation;
	}

	/**
		returns the dimensions of the polycube

		@usage `const [xLength, yLength, zLength] = polycube.size();`
		@return {number[]}
	*/
	size() {
		return utils.shape.size(this.shape);
	}

	/**
		returns the number of cubes in the polycube
		we shouldn't ever actually need this, it should just be implicit
		this is mostly just to start getting a handled on the data

		@return {number}
	*/
	n() {
		return this.shape.reduce((rx, ys) => (rx + ys.reduce((ry, zs) => (ry + zs.reduce((rz, v) => (rz + (v === 1 ? 1 : 0)), 0)), 0)), 0);
	}

	/**
		checks to see if this polycube is the same shape as another

		@param {Polycube} polycube
		@return {boolean}
	*/
	equals(polycube) {
		if (!polycube?.shape) throw new Error('polycube.equals must compare against polycubes');
		return utils.shape.equals(this.shape, polycube.shape);
	}

	/**
		get all the rotations for this shape
		@return {Polycube[]} rotations
	*/
	rotations() {
		const { shape, rotation } = this;
		return utils.rotation.allNames.map((rn) => {
			if (rotation === rn) return this;
			return new Polycube({ shape, rotation: rn });
		});
	}
}

module.exports = Polycube;
