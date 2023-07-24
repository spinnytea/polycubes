const Polycube = require('../Polycube');
const utils = require('../utils');

const {
	generateNextSimple,
	listLocationsToGrow,
	rotate,
	generateNextGroupBySize,
} = require('./simple_layers');

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

		test.todo('n=7 => 1023');
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

		test('n=7 => 1023', () => {
			const gs = generateNextGroupBySize(generateNextGroupBySize(generateNextGroupBySize(generateNextGroupBySize([n3a, n3b]))));
			expect(gs.length).toBe(1023);
		});

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