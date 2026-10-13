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

	now that we have better ways of checking if something exists,
	we can check later before we rotate
	it means we have to push more items around, but we can reduce the places that need to dedup
	(if it takes more space to dedup up front and it's not worth paying, deferring might be worthwhile)
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

	it's probably hard to improve upon this in javascript
	since objects are keyed by strings and all

	it doesn't seem to be a huge speedup, but we need to serialize anyway for the maps
*/
// const USE_POLYCUBE_SERIALIZE_FOR_EQUALS = true;
// exports.USE_POLYCUBE_SERIALIZE_FOR_EQUALS = USE_POLYCUBE_SERIALIZE_FOR_EQUALS;

/**
	node index.js clean && node index.js enumerate 9

	## `generateNextSimple` and `generateNextGroupBySize`
	 - can compute 8 polycubes in 400 ms
	 - 11 polycubes explodes at growAndGroup with "JavaScript heap out of memory"

	## `generateNextFlat`
	 - can compute 9 polycubes in 1.8 seconds
	 - can sometimes compute 10 polycubes in 22 seconds, or will sometimes just explode with "JavaScript heap out of memory"

	## `generateNextPGA`
	 - can compute 9 polycubes in 1.3 seconds / 880 MiB
	 - can compute 10 polycubes in 8.8 seconds / 1700 MiB
	 - 11 polycubes explodes at growAndGroup with "JS heap out of memory"
	   did get past the "grow and group" phase one time
*/
const MAX_N = 10;
exports.MAX_N = MAX_N;
