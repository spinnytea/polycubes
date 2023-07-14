const utilsShape = {

	clone: (shape) => (
		shape.map((ys) => ys.map((zs) => zs.map((v) => v)))
	),

	equals: (a, b) => (
		a.length === b.length && a.every((ys, x) => (
			ys.length === b[x].length && ys.every((zs, y) => (
				zs.length === b[x][y].length && zs.every((v, z) => (
					v === b[x][y][z]
				))
			))
		))
	),

	size: (shape) => (
		[shape.length, shape[0].length, shape[0][0].length]
	),

	expand: {
		/**
			@sideeffects
			@param {number[][][]} shape - is mutated
		*/
		x: (shape, xLength, yLength, zLength) => {
			const zs = [];
			while (zs.length < zLength) zs.push(0);
			const ys = [];
			while (ys.length < yLength) ys.push([...zs]);
			shape.push(ys);
		},

		/**
			@sideeffects
			@param {number[][][]} shape - is mutated
		*/
		negX: (shape, xLength, yLength, zLength) => {
			const zs = [];
			while (zs.length < zLength) zs.push(0);
			const ys = [];
			while (ys.length < yLength) ys.push([...zs]);
			shape.unshift(ys);
		},
	},

};

module.exports = utilsShape;
