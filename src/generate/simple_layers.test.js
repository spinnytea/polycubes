import { describe, test, expect } from 'vitest';
const Polycube = require('../Polycube');
const { generateNextGroupBySize, generateNextSimple } = require('./simple_layers');

describe('generate simple', () => {
	const n1 = new Polycube({ shape: [[[1]]] });
	const n2 = new Polycube({ shape: [[[1, 1]]] });
	const n3a = new Polycube({ shape: [[[1, 1, 1]]] });
	const n3b = new Polycube({ shape: [[[1, 1], [1, 0]]] });

	describe('generateNextSimple', () => {
		test('n=2 => 1', () => {
			const gs = generateNextSimple([n1]);
			expect(gs.length).toBe(1);
		});

		test('n=3 => 2', () => {
			const gs = generateNextSimple([n2]);
			expect(gs.length).toBe(2);
		});

		test('n=4 => 8', () => {
			const gs = generateNextSimple([n3a, n3b]);
			expect(gs.length).toBe(8);
		});

		test('n=5 => 29', () => {
			const gs = generateNextSimple(generateNextSimple([n3a, n3b]));
			expect(gs.length).toBe(29);
		});

		test('n=6 => 166', () => {
			const gs = generateNextSimple(generateNextSimple(generateNextSimple([n3a, n3b])));
			expect(gs.length).toBe(166);
		});

		test.todo('n=7 => 1_023');
	});

	describe('generateNextGroupBySize', () => {
		test('n=2 => 1', () => {
			const gs = generateNextGroupBySize([n1]);
			expect(gs.length).toBe(1);
		});

		test('n=3 => 2', () => {
			const gs = generateNextGroupBySize([n2]);
			expect(gs.length).toBe(2);
		});

		test('n=4 => 8', () => {
			const gs = generateNextGroupBySize([n3a, n3b]);
			expect(gs.length).toBe(8);
		});

		test('n=5 => 29', () => {
			const gs = generateNextGroupBySize(generateNextGroupBySize([n3a, n3b]));
			expect(gs.length).toBe(29);
		});

		test('n=6 => 166', () => {
			const gs = generateNextGroupBySize(generateNextGroupBySize(generateNextGroupBySize([n3a, n3b])));
			expect(gs.length).toBe(166);
		});

		test('n=7 => 1_023', () => {
			const gs = generateNextGroupBySize(generateNextGroupBySize(generateNextGroupBySize(generateNextGroupBySize([n3a, n3b]))));
			expect(gs.length).toBe(1_023);
		});

		test.todo('n=8 => 6_922');
	});
});