const utilsRotation = {
	equals: {
		/**
			check that rotated --x-> original

			@see utils.shape.rotate.x
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		x: (original, rotated) => (
			rotated.length === original.length && rotated.every((ys, x) => (
				ys.length === original[0][0].length && ys.every((zs, y) => (
					zs.length === original[0].length && zs.every((v, z) => (
						v === original[x][z][ys.length - y - 1]
					))
				))
			))
		),

		/**
			check that rotated --nX-> original

			@see utils.shape.rotate.nX
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		nX: (original, rotated) => (
			rotated.length === original.length && rotated.every((ys, x) => (
				ys.length === original[0][0].length && ys.every((zs, y) => (
					zs.length === original[0].length && zs.every((v, z) => (
						v === original[x][zs.length - z - 1][y]
					))
				))
			))
		),

		/**
			check that rotated --y-> original

			@see utils.shape.rotate.y
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		y: (original, rotated) => (
			rotated.length === original[0][0].length && rotated.every((ys, x) => (
				ys.length === original[0].length && ys.every((zs, y) => (
					zs.length === original.length && zs.every((v, z) => (
						v === original[z][y][rotated.length - x - 1]
					))
				))
			))
		),

		/**
			check that rotated --nY-> original

			@see utils.shape.rotate.nY
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		nY: (original, rotated) => (
			rotated.length === original[0][0].length && rotated.every((ys, x) => (
				ys.length === original[0].length && ys.every((zs, y) => (
					zs.length === original.length && zs.every((v, z) => (
						v === original[zs.length - z - 1][y][x]
					))
				))
			))
		),

		/**
			check that rotated --z-> original

			@see utils.shape.rotate.z
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		z: (original, rotated) => (
			rotated.length === original[0].length && rotated.every((ys, x) => (
				ys.length === original.length && ys.every((zs, y) => (
					zs.length === original[0][0].length && zs.every((v, z) => (
						v === original[y][rotated.length - x - 1][z]
					))
				))
			))
		),

		/**
			check that rotated --nZ-> original

			@see utils.shape.rotate.nZ
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		nZ: (original, rotated) => (
			rotated.length === original[0].length && rotated.every((ys, x) => (
				ys.length === original.length && ys.every((zs, y) => (
					zs.length === original[0][0].length && zs.every((v, z) => (
						v === original[ys.length - y - 1][x][z]
					))
				))
			))
		),
	},

	allNames: Object.freeze([
		// same (none)
		undefined,

		// once
		'x',
		'y',
		'z',
		'nX',
		'nY',
		'nZ',

		// twice
		'xx',
		'xy',
		'xz',
		'xnY',
		'xnZ',
		'yy',
		'ynX',
		'ynZ',
		'zz',
		'znX',
		'nXnZ',

		// thrice
		'xxy',
		'xxz',
		'xxnY',
		'xxnZ',
		'xyy',
		'xzz',
	]),

	inverseRotations: Object.freeze({
		// same (none)
		undefined: Object.freeze([]),

		// once
		x: Object.freeze(['nX']),
		y: Object.freeze(['nY']),
		z: Object.freeze(['nZ']),
		nX: Object.freeze(['x']),
		nY: Object.freeze(['y']),
		nZ: Object.freeze(['z']),

		// twice
		xx: undefined,
		xy: undefined,
		xz: undefined,
		xnY: undefined,
		xnZ: undefined,
		yy: undefined,
		ynX: undefined,
		ynZ: undefined,
		zz: undefined,
		znX: undefined,
		nXnZ: undefined,

		// thrice
		xxy: undefined,
		xxz: undefined,
		xxnY: undefined,
		xxnZ: undefined,
		xyy: undefined,
		xzz: undefined,
	}),
};

module.exports = utilsRotation;
