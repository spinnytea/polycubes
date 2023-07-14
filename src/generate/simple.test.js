const Polycube = require('../Polycube');
const utils = require('../utils');

const {
	generateNext,
	listLocationsToGrow,
	rotate,
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