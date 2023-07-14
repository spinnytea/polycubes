const Polycube = require('../Polycube');

const {
	generateNext,
	listLocationsToGrow,
} = require('./simple');

describe('generate simple', () => {
	const n1 = new Polycube({ shape: [[[1]]] });
	const n2 = new Polycube({ shape: [[[1, 1]]] });
	const n3a = new Polycube({ shape: [[[1, 1, 1]]] });
	const n3b = new Polycube({ shape: [[[1, 1], [1, 0]]] });

	test.skip('generateNext n=2', () => {
		const gs = generateNext([n1]);
		expect(gs.length).toBe(1); // TODO currently producing 3 versions (one across each dimension)
		expect(gs[0]).toEqual(n2); // TODO need to compare against a rotation, any of the three are valid
	});

	describe('listLocationsToGrow', () => {
		test('n1', () => {
			expect(listLocationsToGrow(n1)).toEqual([
				[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], // from [0, 0, 0]
			]);
		});

		test('n2', () => {
			expect(listLocationsToGrow(n2)).toEqual([
				[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], // from [0, 0, 0]
				[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [0, 0, 2], [0, 0, 0], // from [0, 0, 1]
			]);
		});

		test('n3a', () => {
			expect(listLocationsToGrow(n3a)).toEqual([
				[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], // from [0, 0, 0]
				[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [0, 0, 2], [0, 0, 0], // from [0, 0, 1]
				[1, 0, 2], [-1, 0, 2], [0, 1, 2], [0, -1, 2], [0, 0, 3], [0, 0, 1], // from [0, 0, 2]
			]);
		});

		test('n3b', () => {
			expect(listLocationsToGrow(n3b)).toEqual([
				[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], // from [0, 0, 0]
				[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [0, 0, 2], [0, 0, 0], // from [0, 0, 1]
				[1, 1, 0], [-1, 1, 0], [0, 2, 0], [0, 0, 0], [0, 1, 1], [0, 1, -1], // from [0, 1, 0]
			]);
		});
	});
});