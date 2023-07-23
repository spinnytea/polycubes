const utils = require('./utils');

class Polycube {
	/**
		@param {number[][][]} shape - rectangular matrix; 0s are empty, 1s are full
		@param {number} orientation - how is this shape physically oriented; how do x,y,z lengths relate to each other
		@param {string} rotation - which logical rotation order to use when comparing

		@see `constants.ORIENTATION` for more detail on `orientation`
		@see `options.USE_ACTUAL_ROTATIONS` for for detail on `rotation`
	*/
	constructor({ shape, orientation = undefined, rotation = undefined }) {
		this.shape = shape;
		if (orientation) this.orientation = orientation;
		if (rotation) this.rotation = rotation;
	}

	get serialized() {
		if (!this.$serialized) {
			this.$serialized = this.shape.map((ys) => (
				ys.map((zs) => (
					zs.join('_') // these provide visual clarity, could use 'z' for technical clarity
				)).join(' ') // these provide visual clarity, could use 'y' for technical clarity
			)).join('/'); // these provide visual clarity, could use 'x' for technical clarity

			if (this.rotation) {
				this.$serialized += `but ${this.rotation}`;
			}
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
		if (this.rotation) console.warn('this polycube probably should not have a rotation when checking equality');
		if (polycube.rotation) {
			return utils.rotation.equals[polycube.rotation](this.shape, polycube.shape);
		}
		return utils.shape.equals(this.shape, polycube.shape);
	}

	/**
		get all the rotations for this shape

		FIXME it's weird that `utils.rotation` is in Polycube, but `utils.shape` is in simple_layers
		 - I think I was banking on this being definitively better

		@returns {Polycube[]} rotations
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
