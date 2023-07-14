const utils = require('.');

describe('utils.shape', () => {
	test('clone', async () => {
		expect(utils.shape.clone([[[1]]])).toEqual([[[1]]]);
		expect(utils.shape.clone([[[1, 1], [1, 0]], [[1, 0], [1, 1]]])).toEqual([[[1, 1], [1, 0]], [[1, 0], [1, 1]]]);
	});

	test('size', () => {
		expect(utils.shape.size([[[1]]])).toEqual([1, 1, 1]);
		expect(utils.shape.size([[[1, 1]]])).toEqual([1, 1, 2]);
		expect(utils.shape.size([[[1], [1]]])).toEqual([1, 2, 1]);
		expect(utils.shape.size([[[1]], [[1]]])).toEqual([2, 1, 1]);
		expect(utils.shape.size([[[1, 1], [1, 0]], [[1, 0], [1, 1]]])).toEqual([2, 2, 2]);
		expect(utils.shape.size([[[1, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 1]]])).toEqual([2, 2, 3]);
		expect(utils.shape.size([[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]])).toEqual([3, 2, 2]);
	});

	describe('equals', () => {
		test('true', () => {
			expect(utils.shape.equals([[[1]]], [[[1]]])).toBe(true);
			expect(utils.shape.equals([[[1, 1], [1, 1]], [[1, 1], [1, 1]]], [[[1, 1], [1, 1]], [[1, 1], [1, 1]]])).toBe(true);
			expect(utils.shape.equals([[[1, 1], [0, 0]], [[1, 1], [1, 1]]], [[[1, 1], [0, 0]], [[1, 1], [1, 1]]])).toBe(true);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1]], [[1]], [[1]]])).toBe(true);
		});

		test('false', () => {
			expect(utils.shape.equals([[[1]]], [[[0]]])).toBe(false);
			expect(utils.shape.equals([[[1, 1], [1, 1]], [[1, 1], [1, 1]]], [[[1, 0], [1, 1]], [[1, 1], [1, 1]]])).toBe(false);

			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1], [1]], [[1], [0]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1], [1]], [[0], [1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1, 1]], [[1, 0]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1, 1]], [[0, 1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1], [0]], [[1], [1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[0], [1]], [[1], [1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1, 0]], [[1, 1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[0, 1]], [[1, 1]]])).toBe(false);
		});

		test('mismatched length', () => {
			expect(utils.shape.equals([[[1]]], [[[1, 1]]])).toBe(false);
			expect(utils.shape.equals([[[1, 1]]], [[[1]]])).toBe(false);
			expect(utils.shape.equals([[[1]]], [[[1], [1]]])).toBe(false);
			expect(utils.shape.equals([[[1], [1]]], [[[1]]])).toBe(false);
			expect(utils.shape.equals([[[1]]], [[[1]], [[1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]]], [[[1]]])).toBe(false);
		});
	});

	describe('expand', () => {
		test('x', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[2]?.[0][0]).toBe(undefined);
			expect(shape[2]?.[0][0]).toBe(undefined);

			utils.shape.expand.x(shape);

			expect(utils.shape.size(shape)).toEqual([3, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[2][0][0]).toBe(0);
			expect(shape[2][0][0]).toBe(0);
		});

		test('negX', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[2]?.[0][0]).toBe(undefined);
			expect(shape[2]?.[0][0]).toBe(undefined);

			utils.shape.expand.negX(shape);

			expect(utils.shape.size(shape)).toEqual([3, 2, 2]);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[2][0][0]).toBe(1);
			expect(shape[2][0][0]).toBe(1);
		});

		test('y', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][2]?.[0]).toBe(undefined);
			expect(shape[0][2]?.[0]).toBe(undefined);

			utils.shape.expand.y(shape);

			expect(utils.shape.size(shape)).toEqual([2, 3, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][2][0]).toBe(0);
			expect(shape[0][2][0]).toBe(0);
		});

		test('negY', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][2]?.[0]).toBe(undefined);
			expect(shape[0][2]?.[0]).toBe(undefined);

			utils.shape.expand.negY(shape);

			expect(utils.shape.size(shape)).toEqual([2, 3, 2]);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][2][0]).toBe(1);
			expect(shape[0][2][0]).toBe(1);
		});

		test('z', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][2]).toBe(undefined);
			expect(shape[0][0][2]).toBe(undefined);

			utils.shape.expand.z(shape);

			expect(utils.shape.size(shape)).toEqual([2, 2, 3]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][2]).toBe(0);
			expect(shape[0][0][2]).toBe(0);
		});

		test('negZ', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][2]).toBe(undefined);
			expect(shape[0][0][2]).toBe(undefined);

			utils.shape.expand.negZ(shape);

			expect(utils.shape.size(shape)).toEqual([2, 2, 3]);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][2]).toBe(1);
			expect(shape[0][0][2]).toBe(1);
		});
	});

	describe('rotate', () => {
		test('x', () => {
			// 1 2       4 1
			// 4 3  -->  3 2
			expect(utils.shape.rotate.x([[[1, 2], [4, 3]]]))
				.toEqual([[[4, 1], [3, 2]]]);

			// 1 2 3       6 1
			// 6 5 4  -->  5 2
			//             4 3
			expect(utils.shape.rotate.x([[[1, 2, 3], [6, 5, 4]]]))
				.toEqual([[[6, 1], [5, 2], [4, 3]]]);
		});

		test('negX', () => {
			// 1 2       2 3
			// 4 3  -->  1 4
			expect(utils.shape.rotate.negX([[[1, 2], [4, 3]]]))
				.toEqual([[[2, 3], [1, 4]]]);

			// 1 2 3       3 4
			// 6 5 4  -->  2 5
			//             1 6
			expect(utils.shape.rotate.negX([[[1, 2, 3], [6, 5, 4]]]))
				.toEqual([[[3, 4], [2, 5], [1, 6]]]);
		});

		test.todo('y'); // FIXME test.todo

		test.todo('negY'); // FIXME test.todo

		test.todo('z'); // FIXME test.todo

		test.todo('negZ'); // FIXME test.todo
	});
});