const Polycube = require('./Polycube');

describe('Polycube', () => {
	test('prototype', () => {
		const polycube = new Polycube({});
		expect(Object.getOwnPropertyNames(Object.getPrototypeOf(polycube)).sort()).toEqual([
			'constructor',
			'n',
			'size',
		]);
	});

	test('size', () => {
		expect((new Polycube({ shape: [[[1]]] })).size()).toEqual([1, 1, 1]);
		expect((new Polycube({ shape: [[[1, 1]]] })).size()).toEqual([1, 1, 2]);
		expect((new Polycube({ shape: [[[1], [1]]] })).size()).toEqual([1, 2, 1]);
		expect((new Polycube({ shape: [[[1]], [[1]]] })).size()).toEqual([2, 1, 1]);
		expect((new Polycube({ shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]]] })).size()).toEqual([2, 2, 2]);
	});

	test('n', () => {
		expect((new Polycube({ shape: [[[1]]] })).n()).toEqual(1);
		expect((new Polycube({ shape: [[[1, 1]]] })).n()).toEqual(2);
		expect((new Polycube({ shape: [[[1], [1]]] })).n()).toEqual(2);
		expect((new Polycube({ shape: [[[1]], [[1]]] })).n()).toEqual(2);
		expect((new Polycube({ shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]]] })).n()).toEqual(6);
	});
});