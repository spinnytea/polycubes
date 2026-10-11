export async function generateNextPGA(polycubes, { n, verbose } = {}) {
	if (polycubes) throw new Error('generateNextPGA does not require the list of polycubes');

	console.info(`Hello World ${n}!`);
	if (verbose) console.info('uhm, yes?');
}

/** signal to `dynamic` that it does not need to load or save files */
generateNextPGA.managesFiles = true;
