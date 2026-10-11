import { describe, test, expect } from 'vitest';
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

	// FIXME consider how to interact with the unit tests
	describe('generateNextPGA', () => {
		test.todo('n=2 => 1');

		test.todo('n=3 => 2');

		test.todo('n=4 => 8');

		test.todo('n=5 => 29');

		test.todo('n=6 => 166');

		test.todo('n=7 => 1023');

		test.todo('n=8 => 6922');

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
