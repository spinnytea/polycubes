const Polycube = require('./Polycube');

describe('Polycube', () => {
	test('prototype', () => {
		const polycube = new Polycube({});
		expect(Object.getOwnPropertyNames(Object.getPrototypeOf(polycube)).sort()).toEqual([
			'constructor',
			'equals',
			'n',
			'rotations',
			'size',
		]);
	});

	test('size', () => {
		expect((new Polycube({ shape: [[[1]]] })).size()).toEqual([1, 1, 1]);
		expect((new Polycube({ shape: [[[1]], [[1]]] })).size()).toEqual([2, 1, 1]);
		expect((new Polycube({ shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]] })).size()).toEqual([3, 2, 2]);
	});

	test('n', () => {
		expect((new Polycube({ shape: [[[1]]] })).n()).toEqual(1);
		expect((new Polycube({ shape: [[[1, 1]]] })).n()).toEqual(2);
		expect((new Polycube({ shape: [[[1], [1]]] })).n()).toEqual(2);
		expect((new Polycube({ shape: [[[1]], [[1]]] })).n()).toEqual(2);
		expect((new Polycube({ shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]] })).n()).toEqual(7);
	});

	describe('equals', () => {
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