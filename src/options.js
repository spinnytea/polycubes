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
