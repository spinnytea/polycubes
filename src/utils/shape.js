const utilsShape = {

	clone: (shape) => (
		shape.map((ys) => ys.map((zs) => zs.map((v) => v)))
	),

	size: (shape) => (
		[shape.length, shape[0].length, shape[0][0].length]
	),

	equals: (a, b) => (
		a.every((ys, x) => ys.every((zs, y) => zs.every((v, z) => v === b[x]?.[y]?.[z])))
	),

	expandX: (shape, xLength, yLength, zLength) => {
		const zs = [];
		while (zs.length < zLength) zs.push(0);
		const ys = [];
		while (ys.length < yLength) ys.push([...zs]);
		shape.push(ys);
	},

	expandNegX: (shape, xLength, yLength, zLength) => {
		const zs = [];
		while (zs.length < zLength) zs.push(0);
		const ys = [];
		while (ys.length < yLength) ys.push([...zs]);
		shape.unshift(ys);
	},

};

module.exports = utilsShape;
