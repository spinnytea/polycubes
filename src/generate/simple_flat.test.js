const Polycube = require('../Polycube');

const { generateNextFlat } = require('./simple_flat');

describe('generate flat', () => {
	const n1 = new Polycube({ shape: [[[1]]] });
	const n2 = new Polycube({ shape: [[[1, 1]]] });
	const n3a = new Polycube({ shape: [[[1, 1, 1]]] });
	const n3b = new Polycube({ shape: [[[1, 1], [1, 0]]] });

	describe('generateNextFlat', () => {
		test('n=2 => 1', () => {
			const gs = generateNextFlat([n1]);
			expect(gs.length).toBe(1);
		});

		test('n=3 => 2', () => {
			const gs = generateNextFlat([n2]);
			expect(gs.length).toBe(2);
		});

		test('n=4 => 8', () => {
			const gs = generateNextFlat([n3a, n3b]);
			expect(gs.length).toBe(8);
		});

		test('n=5 => 29', () => {
			const gs = generateNextFlat(generateNextFlat([n3a, n3b]));
			expect(gs.length).toBe(29);
		});

		test('n=6 => 166', () => {
			const gs = generateNextFlat(generateNextFlat(generateNextFlat([n3a, n3b])));
			expect(gs.length).toBe(166);
		});

		test('n=7 => 1023', () => {
			const gs = generateNextFlat(generateNextFlat(generateNextFlat(generateNextFlat([n3a, n3b]))));
			expect(gs.length).toBe(1023);
		});

		test('n=8 => 6922', () => {
			const gs = generateNextFlat(generateNextFlat(generateNextFlat(generateNextFlat(generateNextFlat([n3a, n3b])))));
			expect(gs.length).toBe(6922);
		});

		test.todo('n=9');

		test.todo('n=10');

		test.todo('n=11');

		test.todo('n=12');
	});
});