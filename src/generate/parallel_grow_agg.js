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
	return workers.checkPreviousExists({ n, verbose }).then(function () {
		// FIXME okay to proceed
		console.log('hello world');
	});
}
