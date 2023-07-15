const utilsShape = {

	clone: (shape) => (
		shape.map((ys) => ys.map((zs) => zs.map((v) => v)))
	),

	create: (xLength, yLength, zLength) => {
		const shape = [];
		while (shape.length < xLength) {
			const ys = [];
			while (ys.length < yLength) {
				const zs = [];
				while (zs.length < zLength) {
					zs.push(0);
				}
				ys.push(zs);
			}
			shape.push(ys);
		}
		return shape;
	},

	equals: (a, b) => (
		a.length === b.length && a.every((ys, x) => (
			ys.length === b[x].length && ys.every((zs, y) => (
				zs.length === b[x][y].length && zs.every((v, z) => (
					v === b[x][y][z]
				))
			))
		))
	),

	/**
		returns the dimensions of the shape

		@usage `const [xLength, yLength, zLength] = utils.shape.size(shape);`
		@returns {number[]}
	*/
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
		nX: (shape) => {
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
		nY: (shape) => {
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
		nZ: (shape) => {
			shape.forEach((ys) => {
				ys.forEach((zs) => {
					zs.unshift(0);
				});
			});
		},
	},

	rotate: {
		/*
			rotate matrix clockwise
			 - x fixed
			 - y/z rotate

			@deprecated - use `utils.rotation` instead
		*/
		x: (shape) => {
			const [xLength, yLength, zLength] = utilsShape.size(shape);

			const newShape = utilsShape.create(xLength, zLength, yLength);

			shape.forEach((ys, x) => {
				ys.forEach((zs, y) => {
					zs.forEach((v, z) => {
						newShape[x][z][yLength - y - 1] = v;
					});
				});
			});

			return newShape;
		},

		/*
			rotate matrix counter-clockwise
			 - x fixed
			 - y/z rotate

			@deprecated - use `utils.rotation` instead
		*/
		nX: (shape) => {
			const [xLength, yLength, zLength] = utilsShape.size(shape);

			const newShape = utilsShape.create(xLength, zLength, yLength);

			shape.forEach((ys, x) => {
				ys.forEach((zs, y) => {
					zs.forEach((v, z) => {
						newShape[x][zLength - z - 1][y] = v;
					});
				});
			});

			return newShape;
		},

		/*
			rotate matrix clockwise
			 - y is fixed
			 - x/z rotate

			@deprecated - use `utils.rotation` instead
		*/
		y: (shape) => {
			const [xLength, yLength, zLength] = utilsShape.size(shape);

			const newShape = utilsShape.create(zLength, yLength, xLength);

			shape.forEach((ys, x) => {
				ys.forEach((zs, y) => {
					zs.forEach((v, z) => {
						newShape[z][y][xLength - x - 1] = v;
					});
				});
			});

			return newShape;
		},

		/*
			rotate matrix counter-clockwise
			 - y is fixed
			 - x/z rotate

			@deprecated - use `utils.rotation` instead
		*/
		nY: (shape) => {
			const [xLength, yLength, zLength] = utilsShape.size(shape);

			const newShape = utilsShape.create(zLength, yLength, xLength);

			shape.forEach((ys, x) => {
				ys.forEach((zs, y) => {
					zs.forEach((v, z) => {
						newShape[zLength - z - 1][y][x] = v;
					});
				});
			});

			return newShape;
		},

		/*
			rotate matrix clockwise
			 - z is fixed
			 - x/y rotate

			@deprecated - use `utils.rotation` instead
		*/
		z: (shape) => {
			const [xLength, yLength, zLength] = utilsShape.size(shape);

			const newShape = utilsShape.create(yLength, xLength, zLength);

			shape.forEach((ys, x) => {
				ys.forEach((zs, y) => {
					zs.forEach((v, z) => {
						newShape[y][xLength - x - 1][z] = v;
					});
				});
			});

			return newShape;
		},

		/*
			rotate matrix counter-clockwise
			 - z is fixed
			 - x/y rotate

			@deprecated - use `utils.rotation` instead
		*/
		nZ: (shape) => {
			const [xLength, yLength, zLength] = utilsShape.size(shape);

			const newShape = utilsShape.create(yLength, xLength, zLength);

			shape.forEach((ys, x) => {
				ys.forEach((zs, y) => {
					zs.forEach((v, z) => {
						newShape[yLength - y - 1][x][z] = v;
					});
				});
			});

			return newShape;
		},
	},

};

module.exports = utilsShape;
