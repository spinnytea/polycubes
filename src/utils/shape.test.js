const utils = require('.');

describe('shape', () => {
	test('clone', async () => {
		expect(utils.shape.clone([[[1]]])).toEqual([[[1]]]);
		expect(utils.shape.clone([[[1, 1], [1, 0]], [[1, 0], [1, 1]]])).toEqual([[[1, 1], [1, 0]], [[1, 0], [1, 1]]]);
	});

	test('expandX', () => {
		const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
		expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
		expect(shape[0][0][0]).toBe(1);
		expect(shape[0][0][0]).toBe(1);
		expect(shape[1][0][0]).toBe(1);
		expect(shape[1][0][0]).toBe(1);
		expect(shape[2]?.[0][0]).toBe(undefined);
		expect(shape[2]?.[0][0]).toBe(undefined);

		utils.shape.expandX(shape, 2, 2, 2);

		expect(utils.shape.size(shape)).toEqual([3, 2, 2]);
		expect(shape[0][0][0]).toBe(1);
		expect(shape[0][0][0]).toBe(1);
		expect(shape[1][0][0]).toBe(1);
		expect(shape[1][0][0]).toBe(1);
		expect(shape[2]?.[0][0]).toBe(0);
		expect(shape[2]?.[0][0]).toBe(0);
	});

	test('expandNegX', () => {
		const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
		expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
		expect(shape[0][0][0]).toBe(1);
		expect(shape[0][0][0]).toBe(1);
		expect(shape[1][0][0]).toBe(1);
		expect(shape[1][0][0]).toBe(1);
		expect(shape[2]?.[0][0]).toBe(undefined);
		expect(shape[2]?.[0][0]).toBe(undefined);

		utils.shape.expandNegX(shape, 2, 2, 2);

		expect(utils.shape.size(shape)).toEqual([3, 2, 2]);
		expect(shape[0][0][0]).toBe(0);
		expect(shape[0][0][0]).toBe(0);
		expect(shape[1][0][0]).toBe(1);
		expect(shape[1][0][0]).toBe(1);
		expect(shape[2]?.[0][0]).toBe(1);
		expect(shape[2]?.[0][0]).toBe(1);
	});

	test.todo('expandY');

	test.todo('expandNegY');

	test.todo('expandZ');

	test.todo('expandNegZ');

	test('size', () => {
		expect(utils.shape.size([[[1]]])).toEqual([1, 1, 1]);
		expect(utils.shape.size([[[1, 1]]])).toEqual([1, 1, 2]);
		expect(utils.shape.size([[[1], [1]]])).toEqual([1, 2, 1]);
		expect(utils.shape.size([[[1]], [[1]]])).toEqual([2, 1, 1]);
		expect(utils.shape.size([[[1, 1], [1, 0]], [[1, 0], [1, 1]]])).toEqual([2, 2, 2]);
	});
});