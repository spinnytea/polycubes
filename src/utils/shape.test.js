const { ORIENTATION } = require('../constants');
const utils = require('.');

describe('utils.shape', () => {
	test('clone', async () => {
		expect(utils.shape.clone([[[1]]])).toEqual([[[1]]]);
		expect(utils.shape.clone([[[1, 1], [1, 0]], [[1, 0], [1, 1]]])).toEqual([[[1, 1], [1, 0]], [[1, 0], [1, 1]]]);
	});

	test('size', () => {
		expect(utils.shape.size([[[1]]])).toEqual([1, 1, 1]);
		expect(utils.shape.size([[[1, 1]]])).toEqual([1, 1, 2]);
		expect(utils.shape.size([[[1], [1]]])).toEqual([1, 2, 1]);
		expect(utils.shape.size([[[1]], [[1]]])).toEqual([2, 1, 1]);
		expect(utils.shape.size([[[1, 1], [1, 0]], [[1, 0], [1, 1]]])).toEqual([2, 2, 2]);
		expect(utils.shape.size([[[1, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 1]]])).toEqual([2, 2, 3]);
		expect(utils.shape.size([[[1, 1], [1, 0]], [[1, 0], [1, 1]], [[1, 0], [0, 0]]])).toEqual([3, 2, 2]);
	});

	describe('equals', () => {
		test('true', () => {
			expect(utils.shape.equals([[[1]]], [[[1]]])).toBe(true);
			expect(utils.shape.equals([[[1, 1], [1, 1]], [[1, 1], [1, 1]]], [[[1, 1], [1, 1]], [[1, 1], [1, 1]]])).toBe(true);
			expect(utils.shape.equals([[[1, 1], [0, 0]], [[1, 1], [1, 1]]], [[[1, 1], [0, 0]], [[1, 1], [1, 1]]])).toBe(true);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1]], [[1]], [[1]]])).toBe(true);
		});

		test('false', () => {
			expect(utils.shape.equals([[[1]]], [[[0]]])).toBe(false);
			expect(utils.shape.equals([[[1, 1], [1, 1]], [[1, 1], [1, 1]]], [[[1, 0], [1, 1]], [[1, 1], [1, 1]]])).toBe(false);

			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1], [1]], [[1], [0]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1], [1]], [[0], [1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1, 1]], [[1, 0]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1, 1]], [[0, 1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1], [0]], [[1], [1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[0], [1]], [[1], [1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[1, 0]], [[1, 1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]], [[1]]], [[[0, 1]], [[1, 1]]])).toBe(false);
		});

		test('mismatched length', () => {
			expect(utils.shape.equals([[[1]]], [[[1, 1]]])).toBe(false);
			expect(utils.shape.equals([[[1, 1]]], [[[1]]])).toBe(false);
			expect(utils.shape.equals([[[1]]], [[[1], [1]]])).toBe(false);
			expect(utils.shape.equals([[[1], [1]]], [[[1]]])).toBe(false);
			expect(utils.shape.equals([[[1]]], [[[1]], [[1]]])).toBe(false);
			expect(utils.shape.equals([[[1]], [[1]]], [[[1]]])).toBe(false);
		});
	});

	describe('expand', () => {
		test('x', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[2]?.[0][0]).toBe(undefined);
			expect(shape[2]?.[0][0]).toBe(undefined);

			utils.shape.expand.x(shape);

			expect(utils.shape.size(shape)).toEqual([3, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[2][0][0]).toBe(0);
			expect(shape[2][0][0]).toBe(0);
		});

		test('nX', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[2]?.[0][0]).toBe(undefined);
			expect(shape[2]?.[0][0]).toBe(undefined);

			utils.shape.expand.nX(shape);

			expect(utils.shape.size(shape)).toEqual([3, 2, 2]);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[1][0][0]).toBe(1);
			expect(shape[2][0][0]).toBe(1);
			expect(shape[2][0][0]).toBe(1);
		});

		test('y', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][2]?.[0]).toBe(undefined);
			expect(shape[0][2]?.[0]).toBe(undefined);

			utils.shape.expand.y(shape);

			expect(utils.shape.size(shape)).toEqual([2, 3, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][2][0]).toBe(0);
			expect(shape[0][2][0]).toBe(0);
		});

		test('nY', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][2]?.[0]).toBe(undefined);
			expect(shape[0][2]?.[0]).toBe(undefined);

			utils.shape.expand.nY(shape);

			expect(utils.shape.size(shape)).toEqual([2, 3, 2]);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][1][0]).toBe(1);
			expect(shape[0][2][0]).toBe(1);
			expect(shape[0][2][0]).toBe(1);
		});

		test('z', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][2]).toBe(undefined);
			expect(shape[0][0][2]).toBe(undefined);

			utils.shape.expand.z(shape);

			expect(utils.shape.size(shape)).toEqual([2, 2, 3]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][2]).toBe(0);
			expect(shape[0][0][2]).toBe(0);
		});

		test('nZ', () => {
			const shape = [[[1, 1], [1, 0]], [[1, 0], [1, 1]]];
			expect(utils.shape.size(shape)).toEqual([2, 2, 2]);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][0]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][2]).toBe(undefined);
			expect(shape[0][0][2]).toBe(undefined);

			utils.shape.expand.nZ(shape);

			expect(utils.shape.size(shape)).toEqual([2, 2, 3]);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][0][0]).toBe(0);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][1]).toBe(1);
			expect(shape[0][0][2]).toBe(1);
			expect(shape[0][0][2]).toBe(1);
		});
	});

	describe('rotate', () => {
		test('x', () => {
			// 1 2       4 1
			// 4 3  -->  3 2
			expect(utils.shape.rotate.x([[[1, 2], [4, 3]]]))
				.toEqual([[[4, 1], [3, 2]]]);

			// 1 2 3       6 1
			// 6 5 4  -->  5 2
			//             4 3
			expect(utils.shape.rotate.x([[[1, 2, 3], [6, 5, 4]]]))
				.toEqual([[[6, 1], [5, 2], [4, 3]]]);
		});

		test('nX', () => {
			// 1 2       2 3
			// 4 3  -->  1 4
			expect(utils.shape.rotate.nX([[[1, 2], [4, 3]]]))
				.toEqual([[[2, 3], [1, 4]]]);

			// 1 2 3       3 4
			// 6 5 4  -->  2 5
			//             1 6
			expect(utils.shape.rotate.nX([[[1, 2, 3], [6, 5, 4]]]))
				.toEqual([[[3, 4], [2, 5], [1, 6]]]);
		});

		test('y', () => {
			// 1 2       4 1
			// 4 3  -->  3 2
			expect(utils.shape.rotate.y([[[1, 2]], [[4, 3]]]))
				.toEqual([[[4, 1]], [[3, 2]]]);

			// 1 2 3       6 1
			// 6 5 4  -->  5 2
			//             4 3
			expect(utils.shape.rotate.y([[[1, 2, 3]], [[6, 5, 4]]]))
				.toEqual([[[6, 1]], [[5, 2]], [[4, 3]]]);
		});

		test('nY', () => {
			// 1 2       2 3
			// 4 3  -->  1 4
			expect(utils.shape.rotate.nY([[[1, 2]], [[4, 3]]]))
				.toEqual([[[2, 3]], [[1, 4]]]);

			// 1 2 3       3 4
			// 6 5 4  -->  2 5
			//             1 6
			expect(utils.shape.rotate.nY([[[1, 2, 3]], [[6, 5, 4]]]))
				.toEqual([[[3, 4]], [[2, 5]], [[1, 6]]]);
		});

		test('z', () => {
			// 1 2       4 1
			// 4 3  -->  3 2
			expect(utils.shape.rotate.z([[[1], [2]], [[4], [3]]]))
				.toEqual([[[4], [1]], [[3], [2]]]);

			// 1 2 3       6 1
			// 6 5 4  -->  5 2
			//             4 3
			expect(utils.shape.rotate.z([[[1], [2], [3]], [[6], [5], [4]]]))
				.toEqual([[[6], [1]], [[5], [2]], [[4], [3]]]);
		});

		test('nZ', () => {
			// 1 2       2 3
			// 4 3  -->  1 4
			expect(utils.shape.rotate.nZ([[[1], [2]], [[4], [3]]]))
				.toEqual([[[2], [3]], [[1], [4]]]);

			// 1 2 3       3 4
			// 6 5 4  -->  2 5
			//             1 6
			expect(utils.shape.rotate.nZ([[[1], [2], [3]], [[6], [5], [4]]]))
				.toEqual([[[3], [4]], [[2], [5]], [[1], [6]]]);
		});
	});

	describe('normalize', () => {
		function prettyPrintOrientation(o) {
			o = o.toString(2).padStart(9, '0');
			return prettyPrintSML(o.substring(6, 9)) + prettyPrintSML(o.substring(3, 6)) + prettyPrintSML(o.substring(0, 3));
		}
		function prettyPrintSML(n) {
			if (n === '001') return 's';
			if (n === '010') return 'm';
			if (n === '100') return 'l';
			return '';
		}

		test.each`
			x    | y    | z    | s            | o
			${2} | ${2} | ${2} | ${[2, 2, 2]} | ${ORIENTATION.SM_SM_SM}
			${2} | ${2} | ${3} | ${[2, 2, 3]} | ${ORIENTATION.SM_SM_MD}
			${2} | ${2} | ${4} | ${[2, 2, 4]} | ${ORIENTATION.SM_SM_MD}
			${2} | ${3} | ${2} | ${[2, 2, 3]} | ${ORIENTATION.SM_SM_MD}
			${2} | ${3} | ${3} | ${[2, 3, 3]} | ${ORIENTATION.SM_MD_MD}
			${2} | ${3} | ${4} | ${[2, 3, 4]} | ${ORIENTATION.SM_MD_LG}
			${2} | ${4} | ${2} | ${[2, 2, 4]} | ${ORIENTATION.SM_SM_MD}
			${2} | ${4} | ${3} | ${[2, 3, 4]} | ${ORIENTATION.SM_MD_LG}
			${2} | ${4} | ${4} | ${[2, 4, 4]} | ${ORIENTATION.SM_MD_MD}

			${3} | ${2} | ${2} | ${[2, 2, 3]} | ${ORIENTATION.SM_SM_MD}
			${3} | ${2} | ${3} | ${[2, 3, 3]} | ${ORIENTATION.SM_MD_MD}
			${3} | ${2} | ${4} | ${[2, 3, 4]} | ${ORIENTATION.SM_MD_LG}
			${3} | ${3} | ${2} | ${[2, 3, 3]} | ${ORIENTATION.SM_MD_MD}
			${3} | ${3} | ${3} | ${[3, 3, 3]} | ${ORIENTATION.SM_SM_SM}
			${3} | ${3} | ${4} | ${[3, 3, 4]} | ${ORIENTATION.SM_SM_MD}
			${3} | ${4} | ${2} | ${[2, 3, 4]} | ${ORIENTATION.SM_MD_LG}
			${3} | ${4} | ${3} | ${[3, 3, 4]} | ${ORIENTATION.SM_SM_MD}
			${3} | ${4} | ${4} | ${[3, 4, 4]} | ${ORIENTATION.SM_MD_MD}

			${4} | ${2} | ${2} | ${[2, 2, 4]} | ${ORIENTATION.SM_SM_MD}
			${4} | ${2} | ${3} | ${[2, 3, 4]} | ${ORIENTATION.SM_MD_LG}
			${4} | ${2} | ${4} | ${[2, 4, 4]} | ${ORIENTATION.SM_MD_MD}
			${4} | ${3} | ${2} | ${[2, 3, 4]} | ${ORIENTATION.SM_MD_LG}
			${4} | ${3} | ${3} | ${[3, 3, 4]} | ${ORIENTATION.SM_SM_MD}
			${4} | ${3} | ${4} | ${[3, 4, 4]} | ${ORIENTATION.SM_MD_MD}
			${4} | ${4} | ${2} | ${[2, 4, 4]} | ${ORIENTATION.SM_MD_MD}
			${4} | ${4} | ${3} | ${[3, 4, 4]} | ${ORIENTATION.SM_MD_MD}
			${4} | ${4} | ${4} | ${[4, 4, 4]} | ${ORIENTATION.SM_SM_SM}
		`('normalize orientation of [$x, $y, $z]', ({ x, y, z, s, o }) => {
			const before = utils.shape.create(x, y, z);
			for (let i = 0; i < x; i += 1) before[i][0][0] = 1;
			for (let i = 0; i < y; i += 1) before[0][i][0] = 1;
			for (let i = 0; i < z; i += 1) before[0][0][i] = 1;

			const { shape: after, orientation } = utils.shape.normalize(before);

			expect([
				orientation,
				prettyPrintOrientation(orientation),
				'original:',
				prettyPrintOrientation(utils.shape.orientation(x, y, z)),
			]).toEqual([
				o,
				prettyPrintOrientation(o),
				'original:',
				prettyPrintOrientation(utils.shape.orientation(x, y, z)),
			]);

			expect(utils.shape.size(after)).toEqual(s);
		});
	});
});