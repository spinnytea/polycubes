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
	shapes with different sizes will never be equal
	i.e. [1,2,3] will never equal [2,2,3]

	in which case, we can organize them into different lists
	then when we aggregate (n^2 to de-dup)
	when will have smaller lists
	instead of every shape in one giant list, we'll have different lists for each size

	this requires NORMALIZE_ROTATIONS to work
	i mean, we _could_ do it without normalize, but it doesn't quite make sense to support that
	 - i guess a naive way would be to group by x+y+z lengths, and have too many things in the lists; it'd be _better_
	 - or we could, well, normalize the x,y,z without rotating them, and then generate all 24 rotations, but srsly, this is awful
*/
const GROUP_BY_SIZE = true;
exports.GROUP_BY_SIZE = GROUP_BY_SIZE;

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
	last checked: 2 is -
	last checked: 3 is -
	last checked: 4 is 5 ms
	last checked: 5 is 30 ms (60ms alone)
	last checked: 6 is 300 ms (350ms alone)
	last checked: 7 is 50s - 75s
*/
const MAX_N = 7;
exports.MAX_N = MAX_N;
