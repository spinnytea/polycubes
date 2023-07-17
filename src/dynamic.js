const { MAX_N } = require('./options');
const Polycube = require('./Polycube');
const utils = require('./utils');

/**
	Dynamic, as in dynamic programming
	This name always gets me, but the concept is simple:
	> Use the output of a smaller sub-problem and then try to optimize a bigger sub-problem.

	So we have n=1 hard coded. `[[[1]]]`
	We can use that to generate n=2, save it.
	We can use that to generate n=3, save it.
	We can use that to generate n=4, save it.
	…

	This file isn't a solver, it's just the control flow for while `n` we are solving for.
*/
async function dynamic(generateNext, { n, verbose }) {
	if (n < 1) throw new Error('n cannot be lower than 1');
	if (n === 1) {
		return; // this one is checked in
	}
	if (n > MAX_N) throw new Error(`n is too high (for now, max of ${MAX_N})`);

	// check if we have generated the one below
	// if not, do so first
	if (!utils.file.existsSync(`./precomputed/${n - 1}.json`)) {
		if (verbose) console.info(`precomputing n=${n - 1}`);
		await dynamic(generateNext, { n: n - 1, verbose });
	}
	// compute the requested level even if it already exists (because testing, who wants to delete it to run it again)

	console.time(`time to generate polycubes for n=${n}`);
	if (verbose) console.info(`\ngenerating n=${n}…`);

	if (verbose) console.info(`loading polycubes for n=${n - 1}`);
	const shapes = await utils.file.loadJson(`./precomputed/${n - 1}.json`);
	const polycubes = shapes.map((shape) => new Polycube({ shape }));

	const foundPolycubes = generateNext(polycubes, { n, verbose });

	console.info(`saving ${foundPolycubes.length} shapes for n=${n}`);
	const foundShapes = foundPolycubes.map((polycube) => polycube.shape);
	await utils.file.saveArrayJson(`./precomputed/${n}.json`, foundShapes);

	console.timeEnd(`time to generate polycubes for n=${n}`);
}

module.exports = dynamic;
