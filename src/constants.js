/**
	oritentation is an integer the represents how the x,y,z sizes relate to each other
	it's a sort of bit mask for x,y,z across sm,md,lg
	(if x<y and x<z, then x is sm; if x<y and x>z, then x is md; if x>y and x>z, then x is lg)
	- x sm 1
	- x md 2
	- x lg 4
	- y sm 8
	- y md 16
	- y lg 32
	- z sm 64
	- z md 128
	- z lg 256

	after we normalize these orientations, then only these ones are left
*/
const ORIENTATION = Object.freeze({
	SM_SM_SM: 1 + 8 + 64,
	SM_SM_MD: 1 + 8 + 128,
	SM_MD_MD: 1 + 16 + 128,
	SM_MD_LG: 1 + 16 + 256,
});
exports.ORIENTATION = ORIENTATION;

/**
	sometimes we can optimize operations by using bits/integers
	but integers in javascript are awkwardly sized
	so if we have operations that need to use more, we have to find alternatives
	(maybe a Buffer or drop down to C)

	MAX_SAFE_INTEGER_BITS = 53
*/
const MAX_SAFE_INTEGER_BITS = Number.MAX_SAFE_INTEGER.toString(2).length;
exports.MAX_SAFE_INTEGER_BITS = MAX_SAFE_INTEGER_BITS;
