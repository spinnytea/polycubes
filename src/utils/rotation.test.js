const utils = require('.');

describe('utils.rotation', () => {
	const shape = [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [[13, 14, 15, 16], [17, 18, 19, 20], [21, 22, 23, 24]]];

	describe('equals', () => {
		test('example: once', () => {
			const original = [[[1, 2, 3], [6, 5, 4]]];
			const rotated = utils.shape.rotate.nX(original); // reverse the rotation we want to test
			const unrotated = utils.shape.rotate.x(rotated); // rotate it back for posterity
			expect(utils.shape.equals(original, rotated)).toBeFalsy();
			expect(utils.shape.equals(original, unrotated)).toBeTruthy();

			// my original shape is what we want to test against
			// if I have nX, and I want to test "if I rotate this X, does it match original"
			expect(utils.rotation.equals.x(original, rotated)).toBeTruthy();
		});

		test('example: twice', () => {
			const original = [[[1, 2, 3], [6, 5, 4]]];
			const rotated = utils.shape.rotate.nX(utils.shape.rotate.nY(original)); // reverse the rotation we want to test
			const unrotated = utils.shape.rotate.y(utils.shape.rotate.x(rotated)); // rotate it back for posterity
			expect(utils.shape.equals(original, rotated)).toBeFalsy();
			expect(utils.shape.equals(original, unrotated)).toBeTruthy();

			// my original shape is what we want to test against
			// if I have nX, and I want to test "if I rotate this X, does it match original"
			expect(utils.rotation.equals.xy(original, rotated)).toBeTruthy();
		});

		// 'example: thrice' wasn't needed

		test('check that all are implemented', () => {
			expect([undefined].concat(Object.keys(utils.rotation.equals)).sort()).toEqual([...utils.rotation.allNames].sort());
		});

		utils.rotation.allNames.forEach((rotation) => {
			if (!rotation) return;
			if (!utils.rotation.equals[rotation]) {
				test.todo(rotation);
				return;
			}

			test(`${rotation} reverse`, () => {
				// actually do the inverse rotations
				let rotated = shape;
				utils.rotation.inverseRotations[rotation].forEach((dir) => {
					rotated = utils.shape.rotate[dir](rotated);
				});

				// … we chose a shape where this should be an unecessary check
				expect(utils.shape.equals(shape, rotated)).toBeFalsy();

				// check that rotated (shape) --rotation-> shape
				expect(utils.rotation.equals[rotation](shape, rotated)).toBeTruthy();
			});

			test(`${rotation} forward`, () => {
				// actually do the inverse rotations
				let rotated = shape;
				utils.rotation.forwardRotations[rotation].forEach((dir) => {
					rotated = utils.shape.rotate[dir](rotated);
				});

				// … we chose a shape where this should be an unecessary check
				expect(utils.shape.equals(shape, rotated)).toBeFalsy();

				// check that rotated (shape) --rotation-> shape
				expect(utils.rotation.equals[rotation](rotated, shape)).toBeTruthy();
			});
		});
	});
});