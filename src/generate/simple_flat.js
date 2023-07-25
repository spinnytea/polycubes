const { DEDUP_ADDITIONS } = require('../options');
const Polycube = require('../Polycube');
const utils = require('../utils');

// TODO remove dependency
const { listLocationsToGrow, grow, rotate } = require('./simple_layers');

/**
	n=(n-1) => size groups -> rotate and local dedup -> aggregate

	IDEA stream data from files
	 - when we do additions, each size group can be written to a different file
	 - each file can be rotated/deduped independently
	 - a final process that recombines all the files
	 - the only part that needs to take up memory is the the rotate and local dup (processing a specific size group)
	 - (i mean, it will still take up _space_, but it can take up disk space instead of memory)
	 - i guess an analogy would be map-reduce: n=(n-1) => (map) size groups -> (work) rotate and local dedup -> (reduce) aggregate

	IDEA once a single size group gets too large, that can also be split
	 - we can do it in batches, write multiple files; since we can sort the items, they can all be sorted
	 - then we can stream the files and do a sorted unique as we go

	@param {Polycube[]} polycubes all polycubes of size=n
	@returns {Polycube[]} all polycubes of size=(n+1)
*/
function generateNextFlat(polycubes, { verbose } = {}) {
	if (verbose) console.time(' … extending / grouping');
	if (verbose > 1) console.info();
	const sizeGroups = new Map();
	function getSizeGroup(polycube) {
		const size = polycube.sizeGroup();
		if (!sizeGroups.has(size)) {
			sizeGroups.set(size, (DEDUP_ADDITIONS ? new Map() : []));
		}
		return sizeGroups.get(size);
	}

	polycubes.forEach((polycube, idx) => {
		const locations = listLocationsToGrow(polycube);
		const nexts = locations
			.map((location) => grow(polycube, location))
			.map((next) => (new Polycube(utils.shape.normalize(next.shape))));

		nexts.forEach((next) => {
			const sizeGroup = getSizeGroup(next);
			if (DEDUP_ADDITIONS) {
				sizeGroup.set(next.serialized, next);
			}
			else {
				sizeGroup.push(next);
			}
		});
		if (verbose > 1) {
			let nestsCount = 0;
			sizeGroups.forEach((list) => { nestsCount += (DEDUP_ADDITIONS ? list.size : list.length); });
			console.info(`   ${idx + 1} of ${polycubes.length}: found ${nestsCount} options`);
		}
	});
	if (verbose) console.timeEnd(' … extending / grouping');

	if (verbose) console.time(' … rotating / uniqing');
	if (verbose > 1) console.info();
	const found = [];
	sizeGroups.forEach((list) => {
		const foundHere = aggregate(list);
		Array.prototype.push.apply(found, foundHere);
	});
	found.sort((a, b) => b.serialized.localeCompare(a.serialized));
	if (verbose) console.timeEnd(' … rotating / uniqing');

	return found;
}

function aggregate(list) {
	const foundMap = new Map();
	list.forEach((next) => {
		if (foundMap.size === 0) {
			foundMap.set(next.serialized, next);
		}
		else {
			// the first of the rotations is our vanguard, the one we want to add
			// all the rest are other rotations, basically duplicates
			// if any of the rotations are a match, then we don't add our vanguard
			const rotations = rotate(next);
			const alreadyExists = rotations.some((polycube) => (
				foundMap.has(polycube.serialized)
			));
			if (!alreadyExists) {
				foundMap.set(rotations[0].serialized, rotations[0]);
			}
		}
	});
	return Array.from(foundMap.values());
}

exports.generateNextFlat = generateNextFlat;
