const workerpool = require('workerpool');
const fs = require('node:fs');
const readline = require('node:readline');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
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

workerpool.worker({ checkPreviousRun, growAndGroup, rotateAndUniqueSizeGroup, combineSizeGroups });

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
		const sizeGroupCandidateFilepath = `${TMP_DIR}/${size} candidates.json`;
		const shapes = [];
		for (const polycube of list.values()) shapes.push(polycube.shape);
		promises.push(utils.file.saveArrayJson(sizeGroupCandidateFilepath, shapes));
		if (verbose > 2) {
			console.info(`   [n=${n}] [worker ${threadId}] saving group ${size} with ${shapes.length} candidate shapes`);
		}
	}
	await Promise.all(promises);
	if (verbose > 1) console.info(`   [n=${n}] [worker ${threadId}] saved ${promises.length} groups`);

	if (verbose) console.timeEnd(` … [n=${n}] [worker ${threadId}] extending / grouping`);

	return Array.from(sizeGroups.keys());
}

async function rotateAndUniqueSizeGroup({ n, size, verbose }) {
	if (verbose) console.time(` … [n=${n}] [worker ${threadId}] [${size}] rotate and unique size group`);

	const sizeGroupCandidateFilepath = `${TMP_DIR}/${size} candidates.json`;
	const sizeGroupFoundFilepath = `${TMP_DIR}/${size} found.json`;
	const polycubes = (await utils.file.loadJson(sizeGroupCandidateFilepath)).map((shape) => new Polycube({ shape }));
	if (verbose > 2) {
		console.info(`   [n=${n}] [worker ${threadId}] [${size}] loaded ${polycubes.length} candidate shapes`);
	}

	const foundMap = new Map();
	polycubes.forEach((polycube) => {
		const normalized = polycube.normalize();
		foundMap.set(normalized.serialized, normalized);
	});
	const found = Array.from(foundMap.values()).map((polycube) => polycube.shape);
	await utils.file.saveArrayJson(sizeGroupFoundFilepath, found);
	if (verbose > 1) console.info(`   [n=${n}] [worker ${threadId}] [${size}] found/saved ${found.length} shapes`);

	if (verbose) console.timeEnd(` … [n=${n}] [worker ${threadId}] [${size}] rotate and unique size group`);
}

async function combineSizeGroups({ n, verbose }) {
	if (verbose) console.time(` … [n=${n}] [worker ${threadId}] combine size group`);

	const foundFilepaths = (await utils.file.listFiles(TMP_DIR)).filter((fp) => fp.endsWith('found.json'));
	if (verbose > 2) console.info(`   [n=${n}] [worker ${threadId}] found ${foundFilepaths.length} size groups`);

	// "cat" files of the shape `saveArrayJson`
	// stream the list of files into a single output file
	const nFilepath = `./precomputed/${n}.json`;
	let shapeCount = 0;
	async function* streamShapes() {
		yield '[\n';
		let first = true;
		for (const fp of foundFilepaths) {
			const lines = readline.createInterface({
				input: fs.createReadStream(fp),
				crlfDelay: Infinity,
			});
			for await (const line of lines) {
				const shape = line.trim();
				if (!shape || shape === '[' || shape === ']') continue;
				yield `${first ? '' : ',\n'}${shape.endsWith(',') ? shape.slice(0, -1) : shape}`;
				first = false;
				shapeCount++;
			}
		}
		yield '\n]';
	}
	await pipeline(Readable.from(streamShapes()), fs.createWriteStream(nFilepath));
	if (verbose > 1) console.info(`   [n=${n}] [worker ${threadId}] combined ${shapeCount} shapes`);

	if (verbose) console.timeEnd(` … [n=${n}] [worker ${threadId}] combine size group`);
}
