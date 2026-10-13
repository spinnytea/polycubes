import { describe, test, expect } from 'vitest';
import utils from '.';

describe('utils.serial.string', () => {
	// prettier-ignore
	const EXAMPLES = [
		{
			shape: [[[1]]],
			simple: '1',
			compact: '1x1x1+8 1',
			pretty: '1',
		},
		{
			shape: [[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]],
			simple: '1_1 1_0/1_0 1_1/1_0 0_0',
			compact: '3x2x2+4 111010111000',
			pretty: '1_1 1_0/1_0 1_1/1_0 0_0',
		},
		{
			shape: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [[13, 14, 15, 16], [17, 18, 19, 20], [21, 22, 23, 24]]],
			simple: '1_2_3_4 5_6_7_8 9_10_11_12/13_14_15_16 17_18_19_20 21_22_23_24',
			pretty: '1_2_3_4 5_6_7_8 9_10_11_12/13_14_15_16 17_18_19_20 21_22_23_24',
		},
		{
			shape: [[[0, 0, 0, 1, 1, 0, 0, 0, 0]]],
			simple: '0_0_0_1_1_0_0_0_0',
			compact: '1x1x9+0 000110000',
			pretty: '3x0_1_1_4x0',
		},
		{
			shape: [[[0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0]], [[1, 1, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 0, 0, 0]]],
			simple: '0_0_0_0_0_0_0_0_0 1_0_0_0_0_0_0_0_0/1_1_0_0_0_0_0_0_0 1_1_1_0_0_0_0_0_0',
			compact: '2x2x9+3 000000000100000000110000000111000000',
			pretty: '9x0 1_8x0/1_1_7x0 3x1_6x0',
		},
		{
			shape: [[[1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0, 1]], [[1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0, 1]]],
			simple: '1_0_1_0_1_0_1_0_1 1_0_1_0_1_0_1_0_1/1_0_1_0_1_0_1_0_1 1_0_1_0_1_0_1_0_1',
			compact: '2x2x9+8 101010101101010101101010101101010101',
			pretty: '1_0_1_0_1_0_1_0_1 1_0_1_0_1_0_1_0_1/1_0_1_0_1_0_1_0_1 1_0_1_0_1_0_1_0_1',
		},
		{
			shape: [[[1, 1, 0, 0]]],
			simple: '1_1_0_0',
			compact: '1x1x4+4 1100',
			pretty: '1_1_0_0',
		},
		{
			shape: [[[1, 2, 3], [6, 5, 4]]],
			simple: '1_2_3 6_5_4',
			pretty: '1_2_3 6_5_4',
		},
		{
			shape: utils.shape.rotate.x([[[1, 2, 3], [6, 5, 4]]]),
			simple: '6_1 5_2 4_3',
			pretty: '6_1 5_2 4_3',
		},
		{
			shape: utils.shape.rotate.y([[[1, 2, 3], [6, 5, 4]]]),
			simple: '1 6/2 5/3 4',
			pretty: '1 6/2 5/3 4',
		},
		{
			shape: utils.shape.rotate.z([[[1, 2, 3], [6, 5, 4]]]),
			simple: '1_2_3/6_5_4',
			pretty: '1_2_3/6_5_4',
		},
	];

	describe('shape x simple', () => {
		describe('shapeToSimple', () => {
			test.each(EXAMPLES)('$pretty', ({ shape, simple }) => {
				expect(utils.serial.string.shapeToSimple(shape)).toBe(simple);
			});
		});

		describe('simpleToShape', () => {
			test.each(EXAMPLES)('$pretty', ({ shape, simple }) => {
				expect(utils.serial.string.simpleToShape(simple)).toEqual(shape);
			});

			test.each(['', '1__0', '1 2/3', '1 nope', '1/'])('rejects invalid input: %s', (simple) => {
				expect(() => utils.serial.string.simpleToShape(simple)).toThrow();
			});
		});
	});

	describe('shape x compact', () => {
		const COMPACT_EXAMPLES = EXAMPLES.filter(({ compact }) => compact);
		const CANNOT_COMPACT_EXAMPLES = EXAMPLES.filter(({ compact }) => !compact);

		describe('shapeToCompact', () => {
			test.each(COMPACT_EXAMPLES)('$pretty', ({ shape, compact }) => {
				expect(utils.serial.string.shapeToCompact(shape)).toBe(compact);
			});

			test.each(CANNOT_COMPACT_EXAMPLES)('$pretty', ({ shape }) => {
				expect(() => utils.serial.string.shapeToCompact(shape)).toThrow();
			});
		});

		describe('compactToShape', () => {
			test.each(COMPACT_EXAMPLES)('$pretty', ({ shape, compact }) => {
				expect(utils.serial.string.compactToShape(compact)).toEqual(shape);
			});

			test.each(['', '1x1x1+8 10', '1x1x1+0 1', '1x1x1+8 2', '0x1x1+0 1', '9007199254740992x1x1+0 1'])('rejects invalid input: %s', (compact) => {
				expect(() => utils.serial.string.compactToShape(compact)).toThrow();
			});
		});
	});

	describe('shapeToPretty', () => {
		test.each(EXAMPLES)('$pretty', ({ shape, pretty }) => {
			expect(utils.serial.string.shapeToPretty(shape)).toBe(pretty);
		});
	});
});
