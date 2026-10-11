const Polycube = require('../Polycube');
const utils = require('../utils');
const { listLocationsToGrow, grow } = require('./simple_layers'); // TODO (techdebt) remove dependency

/**
	n=(n-1) => size groups -> rotate and local dedup -> aggregate

	IDEA (optimize) stream data from files
	 - when we do additions, each size group can be written to a different file
	 - each file can be rotated/deduped independently
	 - a final process that recombines all the files
	 - the only part that needs to take up memory is the the rotate and local dup (processing a specific size group)
	 - (i mean, it will still take up _space_, but it can take up disk space instead of memory)
	 - i guess an analogy would be map-reduce: n=(n-1) => (map) size groups -> (work) rotate and local dedup -> (reduce) aggregate

	IDEA (optimize) once a single size group gets too large, that can also be split
	 - we can do it in batches, write multiple files; since we can sort the items, they can all be sorted
	 - then we can stream the files and do a sorted unique as we go


	## Benchmarking
	- `n=2` -
	- `n=3` -
	- `n=4` 1 ms (12 ms alone)
	- `n=5` 2 ms (15 ms alone)
	- `n=6` 7 ms (20 ms alone)
	- `n=7` 45 ms (60 ms alone)
	- `n=8` 300 ms (360 ms alone)
	- `n=9` 1.8 s (1.9 s alone)
	- `n=10` 22 s (25 s alone) … or "JavaScript heap out of memory"

	@param {Polycube[]} polycubes all polycubes of size=n
	@returns {Polycube[]} all polycubes of size=(n+1)
*/
function generateNextFlat(polycubes, { verbose } = {}) {
	if (verbose > 1) console.info(`   starting with ${polycubes.length} options`);
	if (verbose) console.time(' … extending / grouping');
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
			console.info(`   ${idx + 1} of ${polycubes.length}: found ${nextsCount} total options`);
		}
	});
	if (verbose) console.timeEnd(' … extending / grouping');
	let nextsCount = 0;
	if (verbose > 1) {
		sizeGroups.forEach((list) => {
			nextsCount += list.size;
		});
		console.info(`   found ${nextsCount} options, across ${sizeGroups.size} groups`);
	}

	if (verbose) console.time(' … rotating / uniqing');
	const found = [];
	let pointVsArrayTotal = 0;
	let currGroupIdx = 1;
	sizeGroups.forEach((list, size) => {
		const foundHere = aggregate(list);
		Array.prototype.push.apply(found, foundHere);
		if (verbose > 2) {
			const polycube = list.values().next().value;
			const [xLength, yLength, zLength] = polycube.size();
			const squareness = (xLength / zLength).toFixed(1);
			const pointVsArray = (3 * polycube.n()) / (xLength * yLength * zLength);
			pointVsArrayTotal += pointVsArray * list.size;
			console.info(
				`   ${currGroupIdx} of ${sizeGroups.size}: ${size} (${squareness}, ${pointVsArray.toFixed(1)}) found ${foundHere.length} shapes`
			);
			currGroupIdx += 1;
		}
	});
	found.sort((a, b) => b.serialized.localeCompare(a.serialized));
	if (verbose > 2)
		console.info(`   ratio 'point : array' projected memory ${(pointVsArrayTotal / nextsCount).toFixed(1)}`);
	if (verbose) console.timeEnd(' … rotating / uniqing');
	if (verbose > 1) console.info(`   ending with ${found.length} options`);

	return found;
}

function aggregate(list) {
	const foundMap = new Map();
	list.forEach((next) => {
		const normalized = next.normalize();
		foundMap.set(normalized.serialized, normalized);
	});
	return Array.from(foundMap.values());
}

exports.generateNextFlat = generateNextFlat;
