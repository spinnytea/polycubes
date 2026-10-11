const workerpool = require('workerpool');

// FIXME review verbose levels 1,2,3
async function generateNextPGA(polycubes, { n, verbose } = {}) {
	if (polycubes) throw new Error('generateNextPGA does not require the list of polycubes');

	// worker implementation lives in another file
	const pool = workerpool.pool(__dirname + '/parallel_grow_agg_workers.js');

	// pool lifecycle
	await pool
		.proxy()
		.then((workers) => workerFlow(workers, { n, verbose }))
		.catch(function (error) {
			pool.terminate();
			// propogate error / let the wrapper handle it (let the program crash)
			throw error;
		})
		.then(function () {
			// terminate all workers when done
			pool.terminate();
		});

	if (verbose > 2) console.info(pool.stats());
}

/** signal to `dynamic` that it does not need to load or save files */
generateNextPGA.managesFiles = true;

exports.generateNextPGA = generateNextPGA;

// FIXME the workflow lives in this file
//  - extending / grouping
//  - rotating / uniqing
async function workerFlow(workers, { n, verbose }) {
	// not trying to over-do the benchmarks, that can be done via --cpu-prof or `npm run prof 7`
	// but for simple readout, we want to see "how long did each step take" and "how long did each worker take"
	//  - so each worker function has a start/end logging (other file)
	//  - each stage in the worker flow has a start/end logging (this file)
	// FIXME ^^ review notes when finished with impl
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
		.then(() => {
			if (verbose) console.timeEnd(` … [n=${n}] [main] combine size group`);
		});
}
