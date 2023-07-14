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
});