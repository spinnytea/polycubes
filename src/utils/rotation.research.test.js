const utils = require('.');

describe('utils.rotation research', () => {
	const shape = [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [[13, 14, 15, 16], [17, 18, 19, 20], [21, 22, 23, 24]]];

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
		dirs.forEach((dir1) => {
			dirs.forEach((dir2) => {
				dirs.forEach((dir3) => {
					dirs.forEach((dir4) => {
						const newShape = utils.shape.rotate[dir1](utils.shape.rotate[dir2](utils.shape.rotate[dir3](utils.shape.rotate[dir4](shape))));
						const alreadyExists = rotatedShapes.some((s) => utils.shape.equals(s, newShape));
						if (!alreadyExists) {
							rotatedShapes.push(newShape);
							rotatedDirs.push([dir1, dir2, dir3, dir4]);
						}
					});
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