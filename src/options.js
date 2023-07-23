/**
	true: create matricies for each of the 24 rotations (utils.shape.rotate)
	 - takes longer to generate rotations
	 - takes more memory
	false: don't change the shape, just compare with a different looping order (utils.rotation.equals)
	 - rotations are basically free to "have"
	 - takes MUCH longer to compare them ?? the whole whole point was that this should be _faster_
*/
const USE_ACTUAL_ROTATIONS = true;
exports.USE_ACTUAL_ROTATIONS = USE_ACTUAL_ROTATIONS;

/**
	after adding cubes to the previous n,
	before generating rotations,
	do a first pass at deduping

	we don't need to rotate the same thing twice
*/
const DEDUP_ADDITIONS = true;
exports.DEDUP_ADDITIONS = DEDUP_ADDITIONS;

/**
	last checked: 6 is 5s, i didn't have the patience for 7
	"actual rotations" (USE_ACTUAL_ROTATIONS = true) takes a long time to rotate
	"logical rotations" (USE_ACTUAL_ROTATIONS = false) takes a long time to aggregate
*/
const MAX_N = 6;
exports.MAX_N = MAX_N;
