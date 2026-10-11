const workerpool = require('workerpool');
const { threadId } = require('node:worker_threads');
const Polycube = require('../Polycube');
const utils = require('../utils');
const { listLocationsToGrow, grow } = require('./simple_layers'); // FIXME remove dependency

/*
	NOTE about threading and workers
	 - only use console.time / timeEnd on (verbose)
	 - only put console.info on (verbose > 1) or (verbose > 2)
	 - always prefix logs with `[n=${n}] [worker ${threadId}]`
*/

const TMP_DIR = './precomputed/tmp';

workerpool.worker({ checkPreviousRun, growAndGroup });

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

// FIXME review this impl, right now we are just YOLO to get it running
async function growAndGroup({ n, verbose }) {
	if (verbose) console.time(` … [n=${n}] [worker ${threadId}] extending / grouping`);

	const filepath = `./precomputed/${n - 1}.json`;
	const polycubes = (await utils.file.loadJson(filepath)).map((shape) => new Polycube({ shape }));

	const sizeGroups = new Map();
	function getSizeGroup(polycube) {
		const size = polycube.sizeGroup();
		let sizeGroup = sizeGroups.get(size);
		if (!sizeGroup) {
			sizeGroup = new Map();
			sizeGroups.set(size, sizeGroup);
		}
		return sizeGroup;
	}

	polycubes.forEach((polycube, idx) => {
		const locations = listLocationsToGrow(polycube);
		const nexts = locations
			.map((location) => grow(polycube, location))
			.map((next) => new Polycube(utils.shape.normalizeOrientation(next.shape)));

		nexts.forEach((next) => {
			const sizeGroup = getSizeGroup(next);
			sizeGroup.set(next.serialized, next);
		});
		if (verbose > 2) {
			let nextsCount = 0;
			sizeGroups.forEach((list) => {
				nextsCount += list.size;
			});
			console.info(
				`   [n=${n}] [worker ${threadId}] ${idx + 1} of ${polycubes.length}: found ${nextsCount} total options`
			);
		}
	});

	const promises = [];
	for (const [size, list] of sizeGroups) {
		const sizeGroupFilepath = `${TMP_DIR}/${size}.json`;
		const shapes = [];
		for (const polycube of list.values()) shapes.push(polycube.shape);
		promises.push(utils.file.saveJson(sizeGroupFilepath, shapes));
		if (verbose > 2) {
			console.info(`   [n=${n}] [worker ${threadId}] saving group ${size} with ${shapes.length} candidate shapes`);
		}
	}
	await Promise.all(promises);
	if (verbose > 1) console.info(`   [n=${n}] [worker ${threadId}] saved ${promises.length} groups`);

	if (verbose) console.timeEnd(` … [n=${n}] [worker ${threadId}] extending / grouping`);

	return Array.from(sizeGroups.keys());
}
