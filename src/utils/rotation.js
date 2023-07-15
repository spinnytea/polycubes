const utilsRotation = {
	equals: {
		/**
			check that rotated --rotation-> original

			@see utils.shape.rotate.x
			@see utils.shape.equals
			@param {number[][][]} original
			@param {number[][][]} rotated
		*/
		x: (original, rotated) => (
			original.length === rotated.length && rotated.every((ys, x) => (
				ys.length === original[x][0].length && ys.every((zs, y) => (
					zs.length === original[x].length && zs.every((v, z) => (
						v === original[x][z][ys.length - y - 1]
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
		// nothing

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
