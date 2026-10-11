const workerpool = require('workerpool');
const { threadId } = require('node:worker_threads');
const utils = require('../utils');

/*
	NOTE about threading and workers
	 - only use console.time / timeEnd on (verbose)
	 - only put console.info on (verbose > 1) or (verbose > 2)
	 - always prefix logs with `[n=${n}] [worker ${threadId}]`
*/

const TMP_DIR = './precomputed/tmp';

workerpool.worker({ checkPreviousRun });

async function checkPreviousRun({ n, verbose }) {
	if (verbose) console.time(` … [n=${n}] [worker ${threadId}] checking previous run`);

	const filepath = `./precomputed/${n - 1}.json`;
	if (!utils.file.existsSync(filepath)) {
		throw new Error(`previous run '${filepath}' does not exist`);
	}
	if (verbose > 2) console.info(`   [n=${n}] [worker ${threadId}] '${filepath}' exists`);

	if (utils.file.mkdirSync(TMP_DIR)) {
		if (verbose > 2) console.info(`   [n=${n}] [worker ${threadId}] '${TMP_DIR}' created`);
	} else {
		if (verbose > 2) console.info(`   [n=${n}] [worker ${threadId}] '${TMP_DIR}' already exists`);
	}

	const tmpFilepaths = await utils.file.listFiles(TMP_DIR);
	tmpFilepaths.forEach((tmpFilepath) => utils.file.unlinkSync(tmpFilepath));
	if (verbose > 2) console.info(`   [n=${n}] [worker ${threadId}] cleared ${tmpFilepaths.length} temporary files`);

	if (verbose) console.timeEnd(` … [n=${n}] [worker ${threadId}] checking previous run`);
}
