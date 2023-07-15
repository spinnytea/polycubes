const utilsShape = require('./shape');

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
		x: (original, rotated) => {
			const xs = rotated;
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rxl && xs.every((ys, x) => (
				oyl === rzl && ys.every((zs, y) => (
					ozl === ryl && zs.every((v, z) => (
						v === original[x][z][ys.length - y - 1]
					))
				))
			));
		},

		/**
			check that rotated --nX-> original

			@see utils.shape.rotate.nX
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		nX: (original, rotated) => (
			original.length === rotated.length && rotated.every((ys, x) => (
				original[0].length === rotated[0][0].length && ys.every((zs, y) => (
					original[0][0].length === rotated[0].length && zs.every((v, z) => (
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
			original.length === rotated[0][0].length && rotated.every((ys, x) => (
				original[0].length === rotated[0].length && ys.every((zs, y) => (
					original[0][0].length === rotated.length && zs.every((v, z) => (
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
			original.length === rotated[0][0].length && rotated.every((ys, x) => (
				original[0].length === rotated[0].length && ys.every((zs, y) => (
					original[0][0].length === rotated.length && zs.every((v, z) => (
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
			original.length === rotated[0].length && rotated.every((ys, x) => (
				original[0].length === rotated.length && ys.every((zs, y) => (
					original[0][0].length === rotated[0][0].length && zs.every((v, z) => (
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
			original.length === rotated[0].length && rotated.every((ys, x) => (
				original[0].length === rotated.length && ys.every((zs, y) => (
					original[0][0].length === rotated[0][0].length && zs.every((v, z) => (
						v === original[ys.length - y - 1][x][z]
					))
				))
			))
		),

		/**
			check that rotated --xy-> original

			x: [x][z][yLength - y - 1] \
			y: [z][y][xLength - x - 1]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xy: (original, rotated) => {
			const xs = rotated;
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === ryl && xs.every((ys, x) => (
				oyl === rzl && ys.every((zs, y) => (
					ozl === rxl && zs.every((v, z) => (
						v === original[ys.length - y - 1][z][xs.length - x - 1]
					))
				))
			));
		},
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
		xy: Object.freeze(['nY', 'nX']),
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
