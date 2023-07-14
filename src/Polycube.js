class Polycube {
	/**
		@param {number[][][]} shape - square matrix; 0s are empty, 1s are full
	*/
	constructor({ shape }) {
		this.shape = shape;
	}

	/**
		returns the dimensions of the polycube

		@usage `const [xLength, yLength, zLength] = polycube.size();`
		@return {number[]}
	*/
	size() {
		return [this.shape.length, this.shape[0].length, this.shape[0][0].length];
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
}

module.exports = Polycube;
