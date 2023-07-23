/**
	after adding cubes to the previous n,
	before generating rotations,
	rotate all shapes to a normal orientation

	this will help us find more duplicates up front
	more importantly, this will help us reduce the number or rotations we need to do

	this also means that once we know the orientation, we can minimize the number of rotations we need
	i.e. if there is an axis with a unique size (e.g. [sm,md,md]),
	  then we only need to rotate along that axis (+flip)
	  then we only need 8 rotations instead of all 24

	given a particular shape with a particular size, it may be oriented [sm,md,md], [md,sm,md], [md,md,sm]
	without knowing anthing more, we would need to generate all 24 rotations
	but if we rotate it up front to a normalized orientation [sm,md,md],
	then we don't need to generate comparisons for the other ones, since they will have been normalized too

	@see `constants.ORIENTATION` for more detail
*/
const NORMALIZE_ROTATIONS = true;
exports.NORMALIZE_ROTATIONS = NORMALIZE_ROTATIONS;

/**
	after adding cubes to the previous n,
	before generating rotations,
	do a first pass at deduping

	we don't need to rotate the same thing twice
*/
const DEDUP_ADDITIONS = true;
exports.DEDUP_ADDITIONS = DEDUP_ADDITIONS;

/**
	when we generate rotations
	(8 or 24 of them)
	should we dedup that list

	this sounds good on the surface, redue the 8184 things we need while it's just 24
	but this will be n^2 to dedup
	and we don't constantly cross check rotations
	once we find something, we only use the representative rotation, and drop the rest

	so this may actually slow things down
*/
const DEDUP_ROTATIONS = false;
exports.DEDUP_ROTATIONS = DEDUP_ROTATIONS;

/**
	strings are simpler to work with, so polycube has a serialize function
	instead of using `utils.shape.equals`, which iterates all of the 3d arrays,
	serialize the polycube into a string once, and then use that for equality comparisons
*/
const USE_POLYCUBE_SERIALIZE_FOR_EQUALS = true;
exports.USE_POLYCUBE_SERIALIZE_FOR_EQUALS = USE_POLYCUBE_SERIALIZE_FOR_EQUALS;

/**
	this can divide `generateNextGroupBySize` further into 9 groups
	we know that _every_ cube will have 8 corners, so we can count the number of 1s
	the same shape will have the same count regardles of rotation, and it's trivial to do

	+0, +1, +2, +3, +4, +5, +6, +7, +8
*/
const COUNT_CORNERS_TO_GROUP = true;
exports.COUNT_CORNERS_TO_GROUP = COUNT_CORNERS_TO_GROUP;

/**
	last checked: 2 is -
	last checked: 3 is -
	last checked: 4 is 5 ms (35 ms alone)
	last checked: 5 is 20 ms (50 ms alone)
	last checked: 6 is 50 ms (85 ms alone)
	last checked: 7 is 1.8 s
*/
const MAX_N = 8;
exports.MAX_N = MAX_N;
