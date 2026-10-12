import { describe, test, expect } from 'vitest';
import { generateNextPGA } from './parallel_grow_agg';
const Polycube = require('../Polycube');

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

	test('sizeGroup', () => {
		expect(n1.sizeGroup()).toBe('1x1x1+8');
		expect(n2.sizeGroup()).toBe('1x1x2+8');
		expect(n3a.sizeGroup()).toBe('1x1x3+8');
		expect(n3b.sizeGroup()).toBe('1x2x2+6');
	});

	// TODO each test should use a separate cache folder, and clean up afterwards
	describe('generateNextPGA', () => {
		test('n=2 => 1', async () => {
			const gs = await generateNextPGA(undefined, { n: 2, returnPolycubes: true });
			expect(gs.length).toBe(1);
			expect(gs[0].serialized).toBe(n2.serialized);
		});

		test('n=3 => 2', async () => {
			const gs = await generateNextPGA(undefined, { n: 3, returnPolycubes: true });
			expect(gs.length).toBe(2);
			const serialized = gs.map((g) => g.serialized).sort();
			expect(serialized).toEqual([n3a.serialized, n3b.serialized].sort());
		});

		test('n=4 => 8', async () => {
			const gs = await generateNextPGA(undefined, { n: 4 });
			expect(gs).toBe(8);
		});

		test('n=5 => 29', async () => {
			const gs = await generateNextPGA(undefined, { n: 5 });
			expect(gs).toBe(29);
		});

		test('n=6 => 166', async () => {
			const gs = await generateNextPGA(undefined, { n: 6 });
			expect(gs).toBe(166);
		});

		test('n=7 => 1_023', async () => {
			const gs = await generateNextPGA(undefined, { n: 7 });
			expect(gs).toBe(1_023);
		});

		test('n=8 => 6_922', async () => {
			const gs = await generateNextPGA(undefined, { n: 8 });
			expect(gs).toBe(6_922);
		});

		test.todo('n=9 => 48_311');

		test.todo('n=10 => 346_543');

		test.todo('n=11 => 2_522_522');

		test.todo('n=12 => 18_598_427');

		test.todo('n=13 => 138_462_649');

		test.todo('n=14 => 1_039_496_297');

		test.todo('n=15 => 7_859_514_470');

		test.todo('n=16 => 59_795_121_480');
	});
});
