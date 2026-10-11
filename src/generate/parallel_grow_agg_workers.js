const workerpool = require('workerpool');
const utils = require('../utils');

workerpool.worker({ checkPreviousExists });

function checkPreviousExists({ n, verbose }) {
	const filepath = `./precomputed/${n - 1}.json`;
	if (verbose) console.time(` … checking for '${filepath}'`);

	if (!utils.file.existsSync(filepath)) {
		throw new Error(`'${filepath}' does not exist`);
	}

	if (verbose) console.timeEnd(` … checking for '${filepath}'`);
}
