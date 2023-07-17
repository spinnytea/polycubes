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
			const newShape1 = utils.shape.rotate[dir1](shape);
			const alreadyExists = rotatedShapes.some((s) => utils.shape.equals(s, newShape1));
			if (!alreadyExists) {
				rotatedShapes.push(newShape1);
				rotatedDirs.push([dir1]);
			}
		});
		dirs.forEach((dir1) => {
			const newShape1 = utils.shape.rotate[dir1](shape);
			dirs.forEach((dir2) => {
				const newShape2 = utils.shape.rotate[dir2](newShape1);
				const alreadyExists = rotatedShapes.some((s) => utils.shape.equals(s, newShape2));
				if (!alreadyExists) {
					rotatedShapes.push(newShape2);
					rotatedDirs.push([dir1, dir2]);
				}
			});
		});
		dirs.forEach((dir1) => {
			const newShape1 = utils.shape.rotate[dir1](shape);
			dirs.forEach((dir2) => {
				const newShape2 = utils.shape.rotate[dir2](newShape1);
				dirs.forEach((dir3) => {
					const newShape3 = utils.shape.rotate[dir3](newShape2);
					const alreadyExists = rotatedShapes.some((s) => utils.shape.equals(s, newShape3));
					if (!alreadyExists) {
						rotatedShapes.push(newShape3);
						rotatedDirs.push([dir1, dir2, dir3]);
					}
				});
			});
		});
		dirs.forEach((dir1) => {
			const newShape1 = utils.shape.rotate[dir1](shape);
			dirs.forEach((dir2) => {
				const newShape2 = utils.shape.rotate[dir2](newShape1);
				dirs.forEach((dir3) => {
					const newShape3 = utils.shape.rotate[dir3](newShape2);
					dirs.forEach((dir4) => {
						const newShape4 = utils.shape.rotate[dir4](newShape3);
						const alreadyExists = rotatedShapes.some((s) => utils.shape.equals(s, newShape4));
						if (!alreadyExists) {
							rotatedShapes.push(newShape4);
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
			['y', 'z'],
			['y', 'nX'],
			['z', 'z'],
			['z', 'nY'],
			['nX', 'nY'],

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

	/**
		I did all this by hand
		but it's a lot of bean counting
		maybe i made mistakes
	*/
	describe('compound dirs', () => {
		/** neg (inverseSingle) */
		function neg(d) {
			switch (d) {
				case 'x': return 'nX';
				case 'y': return 'nY';
				case 'z': return 'nZ';
				case 'nX': return 'x';
				case 'nY': return 'y';
				case 'nZ': return 'z';
				default: throw new Error(`whoops: ${d}`);
			}
		}

		function rotateCoord([x, y, z], d) {
			switch (d) {
				case 'x': return [x, z, neg(y)];
				case 'nX': return [x, neg(z), y];
				case 'y': return [z, y, neg(x)];
				case 'nY': return [neg(z), y, x];
				case 'z': return [y, neg(x), z];
				case 'nZ': return [neg(y), x, z];
				default: throw new Error(`whoops: ${d}`);
			}
		}

		function splitStrToRotations(d) {
			const rotations = [];
			if (d === undefined || d === 'undefined') {
				return rotations;
			}

			const ds = d.split('');
			for (let i = 0; i < ds.length; i += 1) {
				if (ds[i] === 'n') {
					// combine 'n', 'X' into 'nX'
					rotations.push(ds[i] + ds[i + 1]);
					i += 1;
				}
				else {
					rotations.push(ds[i]);
				}
			}

			return rotations;
		}

		test('neg (inverseSingle)', () => {
			expect(neg('x')).toBe('nX');
			expect(neg('y')).toBe('nY');
			expect(neg('z')).toBe('nZ');
			expect(neg('nX')).toBe('x');
			expect(neg('nY')).toBe('y');
			expect(neg('nZ')).toBe('z');
		});

		test('splitStrToRotations', () => {
			expect(splitStrToRotations('x')).toEqual(['x']);
			expect(splitStrToRotations('nX')).toEqual(['nX']);
			expect(splitStrToRotations('xy')).toEqual(['x', 'y']);
			expect(splitStrToRotations('xxnZ')).toEqual(['x', 'x', 'nZ']);
		});

		test('forwardRotations', () => {
			Object.entries(utils.rotation.forwardRotations).forEach(([k, v]) => {
				expect(splitStrToRotations(k)).toEqual(v);
			});
		});

		test('inverseRotations', () => {
			Object.entries(utils.rotation.inverseRotations).forEach(([k, v]) => {
				expect(splitStrToRotations(k).map((d) => neg(d)).reverse()).toEqual(v);
			});
		});

		test('rotateCoord', () => {
			expect(rotateCoord(['x', 'y', 'z'], 'x')).toEqual(['x', 'z', 'nY']);
			expect(rotateCoord(['x', 'y', 'z'], 'nX')).toEqual(['x', 'nZ', 'y']);
			expect(rotateCoord(['x', 'y', 'z'], 'y')).toEqual(['z', 'y', 'nX']);
			expect(rotateCoord(['x', 'y', 'z'], 'nY')).toEqual(['nZ', 'y', 'x']);
			expect(rotateCoord(['x', 'y', 'z'], 'z')).toEqual(['y', 'nX', 'z']);
			expect(rotateCoord(['x', 'y', 'z'], 'nZ')).toEqual(['nY', 'x', 'z']);
		});

		describe('utils.rotation.equals', () => {
			const expected = {
				// same (none)
				undefined: Object.freeze([]),

				// once
				x: ['x', 'z', 'nY'],
				y: ['z', 'y', 'nX'],
				z: ['y', 'nX', 'z'],
				nX: ['x', 'nZ', 'y'],
				nY: ['nZ', 'y', 'x'],
				nZ: ['nY', 'x', 'z'],

				// twice
				xx: ['x', 'nY', 'nZ'],
				xy: ['nY', 'z', 'nX'],
				xz: ['z', 'nX', 'nY'],
				xnY: ['y', 'z', 'x'],
				xnZ: ['nZ', 'x', 'nY'],
				yy: ['nX', 'y', 'nZ'],
				yz: ['y', 'nZ', 'nX'],
				ynX: ['z', 'x', 'y'],
				zz: ['nX', 'nY', 'z'],
				znY: ['nZ', 'nX', 'y'],
				nXnY: ['nY', 'nZ', 'x'],

				// thrice
				xxy: ['nZ', 'nY', 'nX'],
				xxz: ['nY', 'nX', 'nZ'],
				xxnY: ['z', 'nY', 'x'],
				xxnZ: ['y', 'x', 'nZ'],
				xyy: ['nX', 'z', 'y'],
				xzz: ['nX', 'nZ', 'nY'],
			};

			Object.keys(utils.rotation.equals).forEach((k) => {
				test(k, () => {
					expect(splitStrToRotations(k).reduce((coords, d) => rotateCoord(coords, d), ['x', 'y', 'z']))
						.toEqual(expected[k]);
				});
			});

			describe('duplicates', () => {
				Object.entries(expected).forEach(([k, v]) => {
					test(k, () => {
						const found = Object.entries(expected).find(([k2, v2]) => k2 !== k && v2.join('') === v.join(''));
						expect(found).toBe(undefined);
					});
				});
			});

			/**
				it's not going to be _all possible_ orientations, some will need the rectangle matrix to be inverted
				so simple iteration of all possible lists (one of [x, nX], each of [x, y, z], all orders) will have 2x as many
				looks like i need the brute force thing again, but with rotateCoord instead of utils.shape.rotate
			 */
			test.todo('list all rotations');

			describe('check a few redundant alternatives', () => {
				test('xy', () => {
					const invalid = JSON.parse('[[[0,1],[1,1]],[[1,1],[0,0]]]');
					const actual = JSON.parse('[[[1,0],[1,1]],[[1,0],[0,1]]]');

					expect(utils.shape.findRotation(actual, invalid)).toEqual(['x', 'y']);
					const skipXY = [
						['x', 'y'],
						['y', 'nZ'],
						['nZ', 'x'],
						['x', 'x', 'nX', 'y'],
						['x', 'x', 'y', 'z'],
						['x', 'x', 'z', 'nX'],
						['x', 'nX', 'x', 'y'],
					];
					expect(utils.shape.findRotation(actual, invalid, skipXY)).toEqual(['x', 'nX', 'y', 'nZ']);
					skipXY.forEach((skip) => {
						expect(skip.reduce((coords, d) => rotateCoord(coords, d), ['x', 'y', 'z'])).toEqual(['nY', 'z', 'nX']);
					});
				});
			});
		});
	});
});