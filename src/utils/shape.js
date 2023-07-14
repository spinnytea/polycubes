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
		x: (shape) => {
			const zLength = shape[0][0].length;
			const zs = [];
			while (zs.length < zLength) zs.push(0);

			const yLength = shape[0].length;
			const ys = [];
			while (ys.length < yLength) ys.push([...zs]);

			shape.push(ys);
		},

		/**
			@sideeffects
			@param {number[][][]} shape - is mutated
		*/
		negX: (shape) => {
			const zLength = shape[0][0].length;
			const zs = [];
			while (zs.length < zLength) zs.push(0);

			const yLength = shape[0].length;
			const ys = [];
			while (ys.length < yLength) ys.push([...zs]);

			shape.unshift(ys);
		},

		/**
			@sideeffects
			@param {number[][][]} shape - is mutated
		*/
		y: (shape) => {
			const zLength = shape[0][0].length;
			const zs = [];
			while (zs.length < zLength) zs.push(0);

			shape.forEach((ys) => {
				ys.push([...zs]);
			});
		},

		/**
			@sideeffects
			@param {number[][][]} shape - is mutated
		*/
		negY: (shape) => {
			const zLength = shape[0][0].length;
			const zs = [];
			while (zs.length < zLength) zs.push(0);

			shape.forEach((ys) => {
				ys.unshift([...zs]);
			});
		},

		/**
			@sideeffects
			@param {number[][][]} shape - is mutated
		*/
		z: (shape) => {
			shape.forEach((ys) => {
				ys.forEach((zs) => {
					zs.push(0);
				});
			});
		},

		/**
			@sideeffects
			@param {number[][][]} shape - is mutated
		*/
		negZ: (shape) => {
			shape.forEach((ys) => {
				ys.forEach((zs) => {
					zs.unshift(0);
				});
			});
		},
	},

};

module.exports = utilsShape;
