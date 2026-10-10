const { DEDUP_ADDITIONS } = require('../options');
const Polycube = require('../Polycube');
const utils = require('../utils');

// TODO (techdebt) remove dependency
const { listLocationsToGrow, grow } = require('./simple_layers');

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
			.map((next) => (new Polycube(utils.shape.normalizeOrientation(next.shape))));

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
			let nextsCount = 0;
			sizeGroups.forEach((list) => { nextsCount += (DEDUP_ADDITIONS ? list.size : list.length); });
			console.info(`   ${idx + 1} of ${polycubes.length}: found ${nextsCount} options`);
		}
	});
	if (verbose) console.timeEnd(' … extending / grouping');

	if (verbose) console.time(' … rotating / uniqing');
	if (verbose > 1) console.info();
	const found = [];
	let currGroupIdx = 1;
	sizeGroups.forEach((list, key) => {
		const foundHere = aggregate(list);
		Array.prototype.push.apply(found, foundHere);
		if (verbose > 1) {
			const [xLength, , zLength] = list.values().next().value.size();
			const squareness = (xLength / zLength).toFixed(1);
			console.info(`   ${currGroupIdx} of ${sizeGroups.size}: ${key} (${squareness}) found ${foundHere.length} shapes`);
			currGroupIdx += 1;
		}
	});
	found.sort((a, b) => b.serialized.localeCompare(a.serialized));
	if (verbose) console.timeEnd(' … rotating / uniqing');

	return found;
}

function aggregate(list) {
	const foundMap = new Map();
	list.forEach((next) => {
		// `Polycube.rotations` will return all `utils.shape.makeRotations`
		// const rotations = next.rotations();
		// `utils.shape.normalizeInnerOrientationRotation` will pick the best `utils.shape.makeRotations` for this orientation
		const shape = utils.shape.normalizeInnerOrientationRotation(next.shape);
		const normalized = new Polycube({ shape, orientation: next.orientation });
		foundMap.set(normalized.serialized, normalized);
	});
	return Array.from(foundMap.values());
}

exports.generateNextFlat = generateNextFlat;
