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
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rxl && oyl === rzl && ozl === ryl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[x][z][ryl - y - 1]
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
		nX: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rxl && oyl === rzl && ozl === ryl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[x][rzl - z - 1][y]
				));
		},

		/**
			check that rotated --y-> original

			@see utils.shape.rotate.y
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		y: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rzl && oyl === ryl && ozl === rxl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[z][y][rxl - x - 1]
				));
		},

		/**
			check that rotated --nY-> original

			@see utils.shape.rotate.nY
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		nY: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rzl && oyl === ryl && ozl === rxl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[rzl - z - 1][y][x]
				));
		},

		/**
			check that rotated --z-> original

			@see utils.shape.rotate.z
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		z: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === ryl && oyl === rxl && ozl === rzl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[y][rxl - x - 1][z]
				));
		},

		/**
			check that rotated --nZ-> original

			@see utils.shape.rotate.nZ
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		nZ: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === ryl && oyl === rxl && ozl === rzl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[ryl - y - 1][x][z]
				));
		},

		/**
			check that rotated --xx-> original

			x: [x][z][ryl - y - 1] \
			x: [x][z][ryl - y - 1]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xx: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rxl && oyl === ryl && ozl === rzl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[x][ryl - y - 1][rzl - z - 1]
				));
		},

		/**
			check that rotated --xy-> original

			x: [x][z][ryl - y - 1] \
			y: [z][y][rxl - x - 1]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xy: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === ryl && oyl === rzl && ozl === rxl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[ryl - y - 1][z][rxl - x - 1]
				));
		},

		/**
			check that rotated --xz-> original

			x: [x][z][ryl - y - 1] \
			z: [y][rxl - x - 1][z]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xz: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rzl && oyl === rxl && ozl === ryl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[z][rxl - x - 1][ryl - y - 1]
				));
		},

		/**
			check that rotated --xnY-> original

			x: [x][z][ryl - y - 1] \
			nY: [rzl - z - 1][y][x]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xnY: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === ryl && oyl === rzl && ozl === rxl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[y][z][x]
				));
		},

		/**
			check that rotated --xnZ-> original

			x: [x][z][ryl - y - 1] \
			nZ: [ryl - y - 1][x][z]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xnZ: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rzl && oyl === rxl && ozl === ryl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[rzl - z - 1][x][ryl - y - 1]
				));
		},

		/**
			check that rotated --yy-> original

			y: [z][y][rxl - x - 1] \
			y: [z][y][rxl - x - 1]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		yy: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rxl && oyl === ryl && ozl === rzl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[rxl - x - 1][y][rzl - z - 1]
				));
		},

		/**
			check that rotated --ynX-> original

			y: [z][y][rxl - x - 1] \
			nX: [x][rzl - z - 1][y]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		ynX: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rzl && oyl === rxl && ozl === ryl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[z][x][y]
				));
		},

		/**
			check that rotated --ynZ-> original

			y: [z][y][rxl - x - 1] \
			nZ: [ryl - y - 1][x][z]

			@see utils.shape.rotate.y
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		ynZ: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === ryl && oyl === rzl && ozl === rxl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[ryl - y - 1][z][rxl - x - 1]
				));
		},

		/**
			check that rotated --zz-> original

			z: [y][rxl - x - 1][z] \
			z: [y][rxl - x - 1][z]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		zz: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rxl && oyl === ryl && ozl === rzl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[rxl - x - 1][ryl - y - 1][z]
				));
		},

		/**
			check that rotated --znX-> original

			z: [y][rxl - x - 1][z] \
			nX: [x][rzl - z - 1][y]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		znX: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === ryl && oyl === rzl && ozl === rxl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[y][rzl - z - 1][rxl - x - 1]
				));
		},

		/**
			check that rotated --nXnZ-> original

			nX: [x][rzl - z - 1][y] \
			nZ: [ryl - y - 1][x][z]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		nXnZ: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rzl && oyl === rxl && ozl === ryl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[z][x][y]
				));
		},

		/**
			check that rotated --xxy-> original

			x: [x][z][ryl - y - 1] \
			x: [x][z][ryl - y - 1] \
			y: [z][y][rxl - x - 1]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xxy: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rzl && oyl === ryl && ozl === rxl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[rzl - z - 1][ryl - y - 1][rxl - x - 1]
				));
		},

		/**
			check that rotated --xxz-> original

			x: [x][z][ryl - y - 1] \
			x: [x][z][ryl - y - 1] \
			z: [y][rxl - x - 1][z]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xxz: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === ryl && oyl === rxl && ozl === rzl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[ryl - y - 1][rxl - x - 1][rzl - z - 1]
				));
		},

		/**
			check that rotated --xxnY-> original

			x: [x][z][ryl - y - 1] \
			x: [x][z][ryl - y - 1] \
			nY: [rzl - z - 1][y][x]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xxnY: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rzl && oyl === ryl && ozl === rxl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[z][ryl - y - 1][x]
				));
		},

		/**
			check that rotated --xxnZ-> original

			x: [x][z][ryl - y - 1] \
			x: [x][z][ryl - y - 1] \
			nZ: [ryl - y - 1][x][z]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xxnZ: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === ryl && oyl === rxl && ozl === rzl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[y][x][rzl - z - 1]
				));
		},

		/**
			check that rotated --xyy-> original

			x: [x][z][ryl - y - 1] \
			y: [z][y][rxl - x - 1] \
			y: [z][y][rxl - x - 1]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xyy: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rxl && oyl === rzl && ozl === ryl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[rxl - x - 1][z][y]
				));
		},

		/**
			check that rotated --xzz-> original

			x: [x][z][ryl - y - 1] \
			z: [y][rxl - x - 1][z] \
			z: [y][rxl - x - 1][z]

			@param {number[][][]} original
			@param {number[][][]} rotated
			@returns {boolean}
		*/
		xzz: (original, rotated) => {
			const [oxl, oyl, ozl] = utilsShape.size(original);
			const [rxl, ryl, rzl] = utilsShape.size(rotated);
			return oxl === rxl && oyl === rzl && ozl === ryl
				&& utilsShape.every(rotated, (x, y, z, v) => (
					v === original[rxl - x - 1][rzl - z - 1][ryl - y - 1]
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
		xx: Object.freeze(['nX', 'nX']),
		xy: Object.freeze(['nY', 'nX']),
		xz: Object.freeze(['nZ', 'nX']),
		xnY: Object.freeze(['y', 'nX']),
		xnZ: Object.freeze(['z', 'nX']),
		yy: Object.freeze(['nY', 'nY']),
		ynX: Object.freeze(['x', 'nY']),
		ynZ: Object.freeze(['z', 'nY']),
		zz: Object.freeze(['nZ', 'nZ']),
		znX: Object.freeze(['x', 'nZ']),
		nXnZ: Object.freeze(['z', 'x']),

		// thrice
		xxy: Object.freeze(['nY', 'nX', 'nX']),
		xxz: Object.freeze(['nZ', 'nX', 'nX']),
		xxnY: Object.freeze(['y', 'nX', 'nX']),
		xxnZ: Object.freeze(['z', 'nX', 'nX']),
		xyy: Object.freeze(['nY', 'nY', 'nX']),
		xzz: Object.freeze(['nZ', 'nZ', 'nX']),
	}),

	forwardRotations: Object.freeze({
		// same (none)
		undefined: Object.freeze([]),

		// once
		x: Object.freeze(['x']),
		y: Object.freeze(['y']),
		z: Object.freeze(['z']),
		nX: Object.freeze(['nX']),
		nY: Object.freeze(['nY']),
		nZ: Object.freeze(['nZ']),

		// twice
		xx: Object.freeze(['x', 'x']),
		xy: Object.freeze(['x', 'y']),
		xz: Object.freeze(['x', 'z']),
		xnY: Object.freeze(['x', 'nY']),
		xnZ: Object.freeze(['x', 'nZ']),
		yy: Object.freeze(['y', 'y']),
		ynX: Object.freeze(['y', 'nX']),
		ynZ: Object.freeze(['y', 'nZ']),
		zz: Object.freeze(['z', 'z']),
		znX: Object.freeze(['z', 'nX']),
		nXnZ: Object.freeze(['nX', 'nZ']),

		// thrice
		xxy: Object.freeze(['x', 'x', 'y']),
		xxz: Object.freeze(['x', 'x', 'z']),
		xxnY: Object.freeze(['x', 'x', 'nY']),
		xxnZ: Object.freeze(['x', 'x', 'nZ']),
		xyy: Object.freeze(['x', 'y', 'y']),
		xzz: Object.freeze(['x', 'z', 'z']),
	}),
};

module.exports = utilsRotation;
