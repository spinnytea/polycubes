import { describe, test, expect } from 'vitest';
const Polycube = require('../Polycube');
const { generateNextPGA } = require('./parallel_grow_agg');

describe('generate flat', () => {
	const n1 = new Polycube({ shape: [[[1]]] });
	const n2 = new Polycube({ shape: [[[1, 1]]] });
	const n3a = new Polycube({ shape: [[[1, 1, 1]]] });
	// prettier-ignore
	const n3b = new Polycube({ shape: [[[1, 1], [1, 0]]] });

	test('serialized', () => {
		expect(n1.serialized).toBe('1');
		expect(n2.serialized).toBe('1_1');
		expect(n3a.serialized).toBe('3x1');
		expect(n3b.serialized).toBe('1_1 1_0');
	});

	describe('generateNextPGA', () => {
		test('n=2 => 1', () => {
			const gs = generateNextPGA([n1]);
			expect(gs.length).toBe(1);
			expect(gs[0].serialized).toBe(n2.serialized);
		});

		test('n=3 => 2', () => {
			const gs = generateNextPGA([n2]);
			expect(gs.length).toBe(2);
			const serialized = gs.map((g) => g.serialized).sort();
			expect(serialized).toEqual([n3a.serialized, n3b.serialized].sort());
		});

		test('n=4 => 8', () => {
			const gs = generateNextPGA([n3a, n3b]);
			expect(gs.length).toBe(8);
		});

		test('n=5 => 29', () => {
			const gs = generateNextPGA(generateNextPGA([n3a, n3b]));
			expect(gs.length).toBe(29);
		});

		test('n=6 => 166', () => {
			const gs = generateNextPGA(generateNextPGA(generateNextPGA([n3a, n3b])));
			expect(gs.length).toBe(166);
		});

		test('n=7 => 1023', () => {
			const gs = generateNextPGA(generateNextPGA(generateNextPGA(generateNextPGA([n3a, n3b]))));
			expect(gs.length).toBe(1023);
		});

		test('n=8 => 6922', () => {
			const gs = generateNextPGA(generateNextPGA(generateNextPGA(generateNextPGA(generateNextPGA([n3a, n3b])))));
			expect(gs.length).toBe(6922);
		});

		test.todo('n=9 => 48311');

		test.todo('n=10 => 346543');

		test.todo('n=11 => 2522522');

		test.todo('n=12 => 18598427');

		test.todo('n=13 => 138462649');

		test.todo('n=14 => 1039496297');

		test.todo('n=15 => 7859514470');

		test.todo('n=16 => 59795121480');
	});
});
