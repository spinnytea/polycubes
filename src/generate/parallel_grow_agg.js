const workerpool = require('workerpool');
const Polycube = require('../Polycube');
const utils = require('../utils');

/**
	## Benchmarking
	- `n=2` -
	- `n=3` -
	- `n=4` 50 ms
	- `n=5` 61 ms
	- `n=6` 75 ms
	- `n=7` 120 ms
	- `n=8` 370 ms
	- `n=9` 1.5 s
	- `n=10` 12 s
*/
async function generateNextPGA(polycubes, { n, verbose, returnPolycubes } = {}) {
	if (polycubes) throw new Error('generateNextPGA does not require the list of polycubes');

	// worker implementation lives in another file
	const pool = workerpool.pool(__dirname + '/parallel_grow_agg_workers.js', { maxWorkers: 4 });

	// pool lifecycle
	const shapeCount = await pool
		.proxy()
		.then((workers) => workerFlow(workers, { n, verbose }))
		.catch((error) => {
			pool.terminate();
			// propogate error / let the wrapper handle it (let the program crash)
			throw error;
		});
	pool.terminate();

	if (verbose > 2) console.info(pool.stats());

	if (returnPolycubes) {
		return utils.file
			.loadNDJson(`./precomputed/${n}.ndjson`)
			.then((shapes) => shapes.map((shape) => new Polycube({ shape })));
	}

	return shapeCount;
}

/** signal to `dynamic` that it does not need to load or save files */
generateNextPGA.managesFiles = true;

exports.generateNextPGA = generateNextPGA;

// utilizes verbose 0-4; e.g. -vvvv
async function workerFlow(workers, { n, verbose }) {
	return Promise.resolve()
		.then(() => {
			if (verbose) console.time(` … [n=${n}] [main] checking previous run`);
			return workers.checkPreviousRun({ n, verbose });
		})
		.then(() => {
			if (verbose) console.timeEnd(` … [n=${n}] [main] checking previous run`);

			if (verbose) console.time(` … [n=${n}] [main] grow and group`);
			return workers.growAndGroup({ n, verbose });
		})
		.then((sizeGroupsKeys) => {
			if (verbose) console.timeEnd(` … [n=${n}] [main] grow and group`);

			if (verbose) console.time(` … [n=${n}] [main] rotate and unique size group`);
			return Promise.all(sizeGroupsKeys.map((size) => workers.rotateAndUniqueSizeGroup({ n, size, verbose })));
		})
		.then(() => {
			if (verbose) console.timeEnd(` … [n=${n}] [main] rotate and unique size group`);

			if (verbose) console.time(` … [n=${n}] [main] combine size group`);
			return workers.combineSizeGroups({ n, verbose });
		})
		.then((shapeCount) => {
			if (verbose) console.timeEnd(` … [n=${n}] [main] combine size group`);
			return shapeCount;
		});
}
