const Polycube = require('./Polycube');
const utils = require('./utils');

describe('Polycube', () => {
	test('prototype', () => {
		const polycube = new Polycube({});
		expect(Object.getOwnPropertyNames(Object.getPrototypeOf(polycube)).sort()).toEqual([
			'constructor',
			'equals',
			'n',
			'rotations',
			'serialized',
			'size',
		]);
	});

	test('serialized', () => {
		const polycube = new Polycube({ shape: [[[1]]] });
		expect(polycube).not.toHaveProperty('$serialized');
		expect(polycube.serialized).toBe('1');
		expect(polycube.$serialized).toBe('1');
		expect(new Polycube({ shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]] }).serialized)
			.toEqual('1_1 1_0/1_0 1_1/1_0 0_0');
		expect(new Polycube({ shape: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [[13, 14, 15, 16], [17, 18, 19, 20], [21, 22, 23, 24]]] }).serialized)
			.toEqual('1_2_3_4 5_6_7_8 9_10_11_12/13_14_15_16 17_18_19_20 21_22_23_24');

		expect(new Polycube({ shape: [[[1, 2, 3], [6, 5, 4]]] }).serialized)
			.toEqual('1_2_3 6_5_4');
		expect(new Polycube({ shape: utils.shape.rotate.x([[[1, 2, 3], [6, 5, 4]]]) }).serialized)
			.toEqual('6_1 5_2 4_3');
		expect(new Polycube({ shape: utils.shape.rotate.y([[[1, 2, 3], [6, 5, 4]]]) }).serialized)
			.toEqual('1 6/2 5/3 4');
		expect(new Polycube({ shape: utils.shape.rotate.z([[[1, 2, 3], [6, 5, 4]]]) }).serialized)
			.toEqual('1_2_3/6_5_4');
	});

	test('size', () => {
		expect(new Polycube({ shape: [[[1]]] }).size()).toEqual([1, 1, 1]);
		expect(new Polycube({ shape: [[[1]], [[1]]] }).size()).toEqual([2, 1, 1]);
		expect(new Polycube({ shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]] }).size()).toEqual([3, 2, 2]);
	});

	test('n', () => {
		expect(new Polycube({ shape: [[[1]]] }).n()).toEqual(1);
		expect(new Polycube({ shape: [[[1, 1]]] }).n()).toEqual(2);
		expect(new Polycube({ shape: [[[1], [1]]] }).n()).toEqual(2);
		expect(new Polycube({ shape: [[[1]], [[1]]] }).n()).toEqual(2);
		expect(new Polycube({ shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]] }).n()).toEqual(7);
	});

	describe('equals', () => {
		test('no rotation', () => {
			const polycube = new Polycube({ shape: [[[1]]] });

			expect(polycube.equals(polycube)).toBeTruthy();
			expect(polycube.equals(new Polycube({ shape: [[[1]]] }))).toBeTruthy();
			expect(polycube.equals(new Polycube({ shape: [[[0]]] }))).toBeFalsy();
			expect(new Polycube({ shape: [[[1, 0]]] }).equals(new Polycube({ shape: [[[1, 0]]] }))).toBeTruthy();
			expect(new Polycube({ shape: [[[1, 0]]] }).equals(new Polycube({ shape: [[[1, 1]]] }))).toBeFalsy();
			expect(new Polycube({ shape: [[[1, 0]]] }).equals(new Polycube({ shape: [[[0, 1]]] }))).toBeFalsy();

			expect(new Polycube({ shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]] })
				.equals(new Polycube({ shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]] }))).toBeTruthy();

			// just in case
			expect(() => polycube.equals([[[1]]])).toThrow();
			expect(() => polycube.equals(null)).toThrow();
			expect(() => polycube.equals(undefined)).toThrow();
		});

		test('rotation: x', () => {
			const originalShape = [[[1, 2], [4, 3]]];
			const xShape = [[[4, 1], [3, 2]]];
			const nXShape = [[[2, 3], [1, 4]]];
			// 1 2       4 1
			// 4 3  -->  3 2
			expect(utils.shape.rotate.x(originalShape)).toEqual(xShape);
			// 1 2       2 3
			// 4 3  -->  1 4
			expect(utils.shape.rotate.nX(originalShape)).toEqual(nXShape);

			// if we check first shape is our base; second needs to be rotated in X and checked against first
			// nX --x-> original
			// original --x-> x
			expect(new Polycube({ shape: originalShape }).equals(new Polycube({ shape: nXShape, rotation: 'x' }))).toBeTruthy();
			expect(new Polycube({ shape: xShape }).equals(new Polycube({ shape: originalShape, rotation: 'x' }))).toBeTruthy();

			// these are going in the wrong direction
			// if we rotate the x shape in x again, it is not the original
			expect(new Polycube({ shape: originalShape }).equals(new Polycube({ shape: xShape, rotation: 'x' }))).toBeFalsy();
			expect(new Polycube({ shape: nXShape }).equals(new Polycube({ shape: originalShape, rotation: 'x' }))).toBeFalsy();
		});
	});

	describe('rotations', () => {
		test('no rotation', () => {
			const polycube = new Polycube({ shape: [[[1]]] });
			const rotations = polycube.rotations();
			expect(rotations.length).toBe(24);
			expect(rotations[0]).toBe(polycube);
			expect(rotations[0].rotation).toBe(undefined);
			rotations.forEach((rotation) => {
				expect(rotation.shape).toBe(polycube.shape);
			});
		});

		test('starting rotation', () => {
			const polycube = new Polycube({ shape: [[[1]]], rotation: 'x' });
			const rotations = polycube.rotations();
			expect(rotations.length).toBe(24);
			expect(rotations[0]).not.toBe(polycube); // this time it isn't the first one
			expect(rotations[0].rotation).toBe(undefined); // the first one is still the unrotated version
			// XXX index 1 isn't special, it's just the first rotation in `utils.rotation.allNames`
			expect(rotations[1]).toBe(polycube); // it is in the list tho
			rotations.forEach((rotation) => {
				expect(rotation.shape).toBe(polycube.shape);
			});
		});
	});
});