#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const utils = require('./src/utils');

yargs(hideBin(process.argv))
	.command('generate [n]', 'generate polycubes of size n', (_yargs) => (
		_yargs
			.positional('n', {
				describe: 'how large are the polycubes (how many cubical cells)',
				type: 'number',
				default: 1,
			})
	), (argv) => {
		if (argv.verbose) console.info(`generating polycubes of size ${argv.n}`);
		generate(argv.n);
	})
	.option('verbose', {
		alias: 'v',
		type: 'count',
		description: 'Run with verbose logging',
	})
	.parse();

// TODO uhm… get started with something simple
// TODO render it?
// TODO workflow + testing
//  - generate next
//  - rotations
//  - compare to existing
// TODO speed it all up
async function generate(n) {
	const data = await utils.file.loadJson('./precomputed/1.json');
	console.error(JSON.stringify(data, null, 2));
	await utils.file.saveArrayJson('./precomputed/1.json', data);
	console.error(`nothing to do with ${n}!\n`);
}
