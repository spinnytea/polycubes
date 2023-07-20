const Polycube = require('../Polycube');
const utils = require('../utils');

const {
	generateNext,
	listLocationsToGrow,
	rotate,
} = require('./simple_layers');

describe('generate simple', () => {
	const n1 = new Polycube({ shape: [[[1]]] });
	const n2 = new Polycube({ shape: [[[1, 1]]] });
	const n3a = new Polycube({ shape: [[[1, 1, 1]]] });
	const n3b = new Polycube({ shape: [[[1, 1], [1, 0]]] });

	describe('generateNext', () => {
		test('n=2 => 1', () => {
			const gs = generateNext([n1]);
			expect(gs.length).toBe(1);
		});

		test('n=3 => 2', () => {
			const gs = generateNext([n2]);
			expect(gs.length).toBe(2);
		});

		test('n=4 => 8', () => {
			const gs = generateNext([n3a, n3b]);
			expect(gs.length).toBe(8);
		});

		test('n=5 => 29', () => {
			const gs = generateNext(generateNext([n3a, n3b]));
			expect(gs.length).toBe(29);
		});

		test.todo('n=6 => 166');

		test.todo('n=7 => 1023');

		test.todo('n=8 => 6922');
	});

	describe('listLocationsToGrow', () => {
		test('n1', () => {
			// 1
			// [0,0,0]
			expect(listLocationsToGrow(n1)).toEqual([
				[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], // from [0, 0, 0]
			]);
		});

		test('n2', () => {
			// 1 1
			// [0,0,0], [0,0,1]
			expect(listLocationsToGrow(n2)).toEqual([
				[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], /* [0, 0, 1], */ [0, 0, -1], // from [0, 0, 0]
				[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [0, 0, 2], /* [0, 0, 0], */ // from [0, 0, 1]
			]);
		});

		test('n3a', () => {
			// 1 1 1
			// [0,0,0], [0,0,1], [0,0,2]
			expect(listLocationsToGrow(n3a)).toEqual([
				[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], /* [0, 0, 1], */ [0, 0, -1], // from [0, 0, 0]
				[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], /* [0, 0, 2], [0, 0, 0], */ // from [0, 0, 1]
				[1, 0, 2], [-1, 0, 2], [0, 1, 2], [0, -1, 2], [0, 0, 3], /* [0, 0, 1], */ // from [0, 0, 2]
			]);
		});

		test('n3b', () => {
			// 1 1
			// 1 0
			// [0,0,0], [0,0,1]
			// [0,1,0]
			expect(listLocationsToGrow(n3b)).toEqual([
				[1, 0, 0], [-1, 0, 0], /* [0, 1, 0], */ [0, -1, 0], /* [0, 0, 1], */ [0, 0, -1], // from [0, 0, 0]
				[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [0, 0, 2], /* [0, 0, 0], */ // from [0, 0, 1]
				[1, 1, 0], [-1, 1, 0], [0, 2, 0], /* [0, 0, 0], */ [0, 1, 1], [0, 1, -1], // from [0, 1, 0]
			]);
		});
	});

	describe('normalizeOrientation', () => {
		test.todo('[sm, md, lg]');

		test.todo('[sm, lg, md]');

		test.todo('[md, sm, lg]');

		test.todo('[md, lg, sm]');

		test.todo('[lg, sm, md]');

		test.todo('[lg, md, sm]');

		// doing them all is rather redundant
		// e.g. 2,3,3 and 3,4,4 are the same
		// but this ensure we don't miss any
		test.skip.each`
			x    | y    | z    | expected
			${2} | ${2} | ${2} | ${null}
			${2} | ${2} | ${3} | ${null}
			${2} | ${2} | ${4} | ${null}
			${2} | ${3} | ${2} | ${null}
			${2} | ${3} | ${3} | ${null}
			${2} | ${3} | ${4} | ${null}
			${2} | ${4} | ${2} | ${null}
			${2} | ${4} | ${3} | ${null}
			${2} | ${4} | ${4} | ${null}

			${3} | ${2} | ${2} | ${null}
			${3} | ${2} | ${3} | ${null}
			${3} | ${2} | ${4} | ${null}
			${3} | ${3} | ${2} | ${null}
			${3} | ${3} | ${3} | ${null}
			${3} | ${3} | ${4} | ${null}
			${3} | ${4} | ${2} | ${null}
			${3} | ${4} | ${3} | ${null}
			${3} | ${4} | ${4} | ${null}

			${4} | ${2} | ${2} | ${null}
			${4} | ${2} | ${3} | ${null}
			${4} | ${2} | ${4} | ${null}
			${4} | ${3} | ${2} | ${null}
			${4} | ${3} | ${3} | ${null}
			${4} | ${3} | ${4} | ${null}
			${4} | ${4} | ${2} | ${null}
			${4} | ${4} | ${3} | ${null}
			${4} | ${4} | ${4} | ${null}
		`('normalize orientation of [$x, $y, $z]', ({ x, y, z, expected }) => {
			expect(expected).toBe(null);
		});
	});

	describe('rotate', () => {
		test('identity', () => {
			const identityShape = utils.shape.create(2, 3, 4);
			identityShape[0][0][0] = 1;
			identityShape[1][0][0] = 1;
			identityShape[0][1][0] = 1;
			identityShape[0][2][0] = 1;
			identityShape[0][0][1] = 1;
			identityShape[0][0][2] = 1;
			identityShape[0][0][3] = 1;
			expect(identityShape).toEqual([[[1, 1, 1, 1], [1, 0, 0, 0], [1, 0, 0, 0]], [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]]);

			const rotations = rotate(new Polycube({ shape: identityShape }));

			// the first one is the one we passed in
			expect(rotations[0].shape).toBe(identityShape);

			// they are all unique
			rotations.forEach((r1, idx1) => {
				rotations.forEach((r2, idx2) => {
					if (idx1 !== idx2) {
						expect(utils.shape.equals(r1.shape, r2.shape)).toBe(false);
					}
				});
			});

			// there are 24 unique rotations for a 3d cube
			expect(rotations.length).toBe(24);
		});
	});
});