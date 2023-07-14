const { generateNext } = require('./simple');
const Polycube = require('../Polycube');

describe('generate simple', () => {
	test.skip('generateNext n=2', () => {
		const n1 = new Polycube({ shape: [[[1]]] });
		const n2 = new Polycube({ shape: [[[1, 1]]] });

		const gs = generateNext([n1]);
		expect(gs.length).toBe(1); // TODO currently producing 3 versions (one across each dimension)
		expect(gs[0]).toEqual(n2); // TODO need to compare against a rotation, any of the three are valid
	});
});