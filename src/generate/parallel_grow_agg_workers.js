const workerpool = require('workerpool');
const { threadId } = require('node:worker_threads');
const Polycube = require('../Polycube');
const utils = require('../utils');

/*
	NOTE about threading and workers
	 - only use console.time / timeEnd on (verbose)
	 - only put console.info on (verbose > 1) or (verbose > 2)
	 - always prefix logs with `[n=${n}] [worker ${threadId}]`
*/

const TMP_DIR = './precomputed/tmp';

workerpool.worker({ checkPreviousRun, growAndGroup, rotateAndUniqueSizeGroup, combineSizeGroups });

async function checkPreviousRun({ n, verbose }) {
	if (verbose > 1) console.time(` … [n=${n}] [worker ${threadId}] checking previous run`);

	const filepath = `./precomputed/${n - 1}.ndjson`;
	if (!utils.file.existsSync(filepath)) {
		throw new Error(`previous run '${filepath}' does not exist`);
	}
	if (verbose > 3) console.info(`   [n=${n}] [worker ${threadId}] '${filepath}' exists`);

	if (utils.file.mkdirSync(TMP_DIR)) {
		if (verbose > 3) console.info(`   [n=${n}] [worker ${threadId}] '${TMP_DIR}' created`);
	} else {
		if (verbose > 3) console.info(`   [n=${n}] [worker ${threadId}] '${TMP_DIR}' already exists`);
	}

	const tmpFilepaths = await utils.file.listFiles(TMP_DIR);
	tmpFilepaths.forEach((tmpFilepath) => utils.file.unlinkSync(tmpFilepath));
	if (verbose > 3) console.info(`   [n=${n}] [worker ${threadId}] cleared ${tmpFilepaths.length} temporary files`);

	if (verbose > 1) console.timeEnd(` … [n=${n}] [worker ${threadId}] checking previous run`);
}

// TODO (2-priority) (benchmark) this is blowing up memory
async function growAndGroup({ n, verbose }) {
	if (verbose > 1) console.time(` … [n=${n}] [worker ${threadId}] grow and group`);

	const filepath = `./precomputed/${n - 1}.ndjson`;
	const polycubes = (await utils.file.loadNDJson(filepath)).map((shape) => new Polycube({ shape }));
	if (verbose > 2) {
		console.info(`   [n=${n}] [worker ${threadId}] loaded ${polycubes.length} shapes from n-1=${n - 1}`);
	}

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
		const locations = utils.shape.grow.listLocationsToGrow(polycube.shape);
		const nexts = locations.map(
			(location) =>
				new Polycube(utils.shape.normalizeOrientation(utils.shape.grow.growAtLocation(polycube.shape, location)))
		);

		nexts.forEach((next) => {
			const sizeGroup = getSizeGroup(next);
			sizeGroup.set(next.serialized, next);
		});
		if (verbose > 3) {
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
		const sizeGroupCandidateFilepath = `${TMP_DIR}/${size} candidates.ndjson`;
		const shapes = [];
		for (const polycube of list.values()) shapes.push(polycube.shape);
		promises.push(utils.file.saveNDJson(sizeGroupCandidateFilepath, shapes));
		if (verbose > 3) {
			console.info(`   [n=${n}] [worker ${threadId}] saving group ${size} with ${shapes.length} candidate shapes`);
		}
	}
	await Promise.all(promises);
	if (verbose > 2) console.info(`   [n=${n}] [worker ${threadId}] saved ${promises.length} groups`);

	if (verbose > 1) console.timeEnd(` … [n=${n}] [worker ${threadId}] grow and group`);

	return Array.from(sizeGroups.keys());
}

async function rotateAndUniqueSizeGroup({ n, size, verbose }) {
	if (verbose > 1) console.time(` … [n=${n}] [worker ${threadId}] [${size}] rotate and unique size group`);

	const sizeGroupCandidateFilepath = `${TMP_DIR}/${size} candidates.ndjson`;
	const sizeGroupFoundFilepath = `${TMP_DIR}/${size} found.ndjson`;
	const polycubes = (await utils.file.loadNDJson(sizeGroupCandidateFilepath)).map((shape) => new Polycube({ shape }));
	if (verbose > 3) {
		console.info(`   [n=${n}] [worker ${threadId}] [${size}] loaded ${polycubes.length} candidate shapes`);
	}

	const foundMap = new Map();
	polycubes.forEach((polycube) => {
		const normalized = polycube.normalize();
		foundMap.set(normalized.serialized, normalized);
	});
	const found = Array.from(foundMap.values()).map((polycube) => polycube.shape);
	await utils.file.saveNDJson(sizeGroupFoundFilepath, found);
	if (verbose > 2) console.info(`   [n=${n}] [worker ${threadId}] [${size}] found/saved ${found.length} shapes`);

	if (verbose > 1) console.timeEnd(` … [n=${n}] [worker ${threadId}] [${size}] rotate and unique size group`);
}

async function combineSizeGroups({ n, verbose }) {
	if (verbose > 1) console.time(` … [n=${n}] [worker ${threadId}] combine size group`);

	const foundFilepaths = (await utils.file.listFiles(TMP_DIR)).filter((fp) => fp.endsWith('found.ndjson'));
	if (verbose > 3) console.info(`   [n=${n}] [worker ${threadId}] found ${foundFilepaths.length} size groups`);

	// "cat" files of the shape `ndjson`
	// stream the list of files into a single output file
	const nFilepath = `./precomputed/${n}.ndjson`;
	let shapeCount = 0;
	async function* streamShapes() {
		for (const fp of foundFilepaths) {
			for await (const line of utils.file.readlineStream(fp)) {
				const shape = line.trim();
				if (!shape) continue;
				yield `${shape}\n`;
				shapeCount++;
			}
		}
	}
	await utils.file.pipelineWriteStream(nFilepath, streamShapes);
	if (verbose > 2) console.info(`   [n=${n}] [worker ${threadId}] combined ${shapeCount} shapes`);

	if (verbose > 1) console.timeEnd(` … [n=${n}] [worker ${threadId}] combine size group`);

	return shapeCount;
}
