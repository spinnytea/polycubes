const utilsSerialString = {
	// prettier-ignore
	shapeToSimple: (shape) =>
		shape.map((ys) => (
			ys.map((zs) => (
				zs.join('_')
			)).join(' ')
		)).join('/'),

	simpleToShape: (str) => {
		if (typeof str !== 'string' || str.length === 0) {
			throw new Error('simple serialization must be a non-empty string');
		}
		const shape = str.split('/').map((plane) =>
			plane.split(' ').map((row) =>
				row.split('_').map((value) => {
					if (value.length === 0 || !Number.isFinite(Number(value))) {
						throw new Error(`invalid value in simple serialization: ${value}`);
					}
					return Number(value);
				})
			)
		);
		const yLength = shape[0].length;
		const zLength = shape[0][0].length;
		if (shape.some((plane) => plane.length !== yLength || plane.some((row) => row.length !== zLength))) {
			throw new Error('simple serialization must describe a rectangular shape');
		}
		return shape;
	},

	// prettier-ignore
	shapeToPretty: (shape) =>
		shape.map((ys) => (
			ys.map((zs) => (
				serializeZValues(zs)
			)).join(' ')
		)).join('/'),

	calcSizeGroupFromShape: (shape) => {
		const [xLength, yLength, zLength] = [shape.length, shape[0].length, shape[0][0].length];
		const xMax = xLength - 1;
		const yMax = yLength - 1;
		const zMax = zLength - 1;
		const corners =
			shape[0][0][0] +
			shape[xMax][0][0] +
			shape[0][yMax][0] +
			shape[xMax][yMax][0] +
			shape[0][0][zMax] +
			shape[xMax][0][zMax] +
			shape[0][yMax][zMax] +
			shape[xMax][yMax][zMax];
		return `${xLength}x${yLength}x${zLength}+${corners}`;
	},

	shapeToCompact: (shape) => {
		if (!shape.every((ys) => ys.every((zs) => zs.every((value) => value === 0 || value === 1)))) {
			throw new Error('compact serialization only supports binary shapes');
		}
		return (
			utilsSerialString.calcSizeGroupFromShape(shape) +
			' ' +
			shape.map((ys) => ys.map((zs) => zs.join('')).join('')).join('')
		);
	},

	compactToShape: (str) => {
		const match = typeof str === 'string' && str.match(/^(\d+)x(\d+)x(\d+)\+([0-8]) ([01]+)$/);
		if (!match) throw new Error('invalid compact serialization');
		const [, xSize, ySize, zSize, cornerCount, values] = match;
		const [xLength, yLength, zLength] = [xSize, ySize, zSize].map(Number);
		const cellCount = xLength * yLength * zLength;
		if (
			![xLength, yLength, zLength, Number(cornerCount)].every(Number.isSafeInteger) ||
			xLength < 1 ||
			yLength < 1 ||
			zLength < 1 ||
			!Number.isSafeInteger(cellCount) ||
			cellCount !== values.length
		) {
			throw new Error('compact serialization has invalid dimensions or value count');
		}
		const shape = [];
		let index = 0;
		for (let x = 0; x < xLength; x += 1) {
			const plane = [];
			for (let y = 0; y < yLength; y += 1) {
				const row = [];
				for (let z = 0; z < zLength; z += 1) {
					row.push(Number(values[index]));
					index += 1;
				}
				plane.push(row);
			}
			shape.push(plane);
		}
		if (utilsSerialString.calcSizeGroupFromShape(shape) !== `${xLength}x${yLength}x${zLength}+${cornerCount}`) {
			throw new Error('compact serialization has an incorrect corner count');
		}
		return shape;
	},
};

/**
	Encode runs of three or more z values as `{count}x{value}` to shorten Map keys.
	This does no provide a substantial runtime difference, but it does reduce the final serial (68→52).

	@example
		`1_1_1_1_0_0_0` → `4x1_3x0`
*/
function serializeZValues(values) {
	// return values.join('_');

	/*
	// first pass to check if there are any consecutive runs to collapse
	let index = 0;
	while (index + 2 < values.length
		&& !(values[index] === values[index + 1] && values[index] === values[index + 2])) {
		index += 1;
	}
	if (index + 2 >= values.length) return values.join('_');
	*/

	const serialized = [];
	for (let index = 0; index < values.length;) {
		let end = index + 1;
		while (end < values.length && values[end] === values[index]) {
			end += 1;
		}

		const count = end - index;
		if (count >= 3) {
			serialized.push(`${count}x${values[index]}`);
		} else {
			for (let i = 0; i < count; i += 1) {
				serialized.push(values[index]);
			}
		}
		index = end;
	}
	return serialized.join('_');
}

module.exports = utilsSerialString;
