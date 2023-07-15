const utils = require('.');

describe('utils.rotation', () => {
	// TODO 1, 2, 3 is enough to distinguish directions (pos or neg; `x` vs `xs.length - x - 1`)
	//  - but we need 2, 3, 4 to distinguish the patterns
	const shape = [[[1, 2, 3], [6, 5, 4]]];
	// const shape = [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [[13, 14, 15, 16], [17, 18, 19, 20], [21, 22, 23, 24]]];

	describe('equals', () => {
		test('example: once', () => {
			const original = shape;
			const rotated = utils.shape.rotate.nX(original); // reverse the rotation we want to test
			const unrotated = utils.shape.rotate.x(rotated); // rotate it back for posterity
			expect(utils.shape.equals(original, rotated)).toBeFalsy();
			expect(utils.shape.equals(original, unrotated)).toBeTruthy();

			// my original shape is what we want to test against
			// if I have nX, and I want to test "if I rotate this X, does it match original"
			expect(utils.rotation.equals.x(original, rotated)).toBeTruthy();
		});

		test.skip('example: twice', () => {
			const original = shape;
			const rotated = utils.shape.rotate.nX(utils.shape.rotate.nY(original)); // reverse the rotation we want to test
			const unrotated = utils.shape.rotate.y(utils.shape.rotate.x(rotated)); // rotate it back for posterity
			expect(utils.shape.equals(original, rotated)).toBeFalsy();
			expect(utils.shape.equals(original, unrotated)).toBeTruthy();

			// my original shape is what we want to test against
			// if I have nX, and I want to test "if I rotate this X, does it match original"
			expect(utils.rotation.equals.xy(original, rotated)).toBeTruthy();
		});

		test.todo('example: thrice');

		// TODO finish and unskip test
		test.skip('check that all are implemented', () => {
			expect([undefined].concat(Object.keys(utils.rotation.equals)).sort()).toEqual([...utils.rotation.allNames].sort());
		});

		utils.rotation.allNames.forEach((rotation) => {
			if (!rotation) return;
			if (!utils.rotation.equals[rotation]) {
				test.todo(rotation);
				return;
			}
			test(rotation, () => {
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
		});
	});

	/**
		rotate the polycube across all dimensions
		this was originally done directly in simple_layers.rotate
		(i mean, we listed the rotations, but used this to make that list)
		keeping here as a test as something to build on
	*/
	test('brute force enumeration', () => {
		const rotatedShapes = [shape];
		const rotatedDirs = [[]];

		// brute force
		const dirs = ['x', 'y', 'z', 'nX', 'nY', 'nZ'];
		dirs.forEach((dir1) => {
			const newShape = utils.shape.rotate[dir1](shape);
			const alreadyExists = rotatedShapes.some((s) => utils.shape.equals(s, newShape));
			if (!alreadyExists) {
				rotatedShapes.push(newShape);
				rotatedDirs.push([dir1]);
			}
		});
		dirs.forEach((dir1) => {
			dirs.forEach((dir2) => {
				const newShape = utils.shape.rotate[dir1](utils.shape.rotate[dir2](shape));
				const alreadyExists = rotatedShapes.some((s) => utils.shape.equals(s, newShape));
				if (!alreadyExists) {
					rotatedShapes.push(newShape);
					rotatedDirs.push([dir1, dir2]);
				}
			});
		});
		dirs.forEach((dir1) => {
			dirs.forEach((dir2) => {
				dirs.forEach((dir3) => {
					const newShape = utils.shape.rotate[dir1](utils.shape.rotate[dir2](utils.shape.rotate[dir3](shape)));
					const alreadyExists = rotatedShapes.some((s) => utils.shape.equals(s, newShape));
					if (!alreadyExists) {
						rotatedShapes.push(newShape);
						rotatedDirs.push([dir1, dir2, dir3]);
					}
				});
			});
		});

		// rotate should have a length of 24
		expect(rotatedShapes.length).toBe(24);
		expect(rotatedDirs.length).toBe(24);
		expect(rotatedDirs).toEqual([
			// same (none)
			[],

			// once
			['x'],
			['y'],
			['z'],
			['nX'],
			['nY'],
			['nZ'],

			// twice
			['x', 'x'],
			['x', 'y'],
			['x', 'z'],
			['x', 'nY'],
			['x', 'nZ'],
			['y', 'y'],
			['y', 'nX'],
			['y', 'nZ'],
			['z', 'z'],
			['z', 'nX'],
			['nX', 'nZ'],

			// thrice
			['x', 'x', 'y'],
			['x', 'x', 'z'],
			['x', 'x', 'nY'],
			['x', 'x', 'nZ'],
			['x', 'y', 'y'],
			['x', 'z', 'z'],
		]);

		const rotationNames = rotatedDirs
			.map((ds) => (ds.length ? ds.join('') : undefined));
		expect(rotationNames.length).toBe(24);
		expect(rotationNames).toEqual(utils.rotation.allNames);
	});
});