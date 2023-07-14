#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { generateNext } = require('./src/generate/simple');
const Polycube = require('./src/Polycube');
const utils = require('./src/utils');

yargs(hideBin(process.argv))
	.demandCommand()
	.command('enumerate [n]', 'enumerate polycubes of size n', (_yargs) => (
		_yargs
			.positional('n', {
				describe: 'how large are the polycubes (how many cubical cells)',
				type: 'number',
				default: 1,
			})
	), (argv) => {
		if (argv.verbose) console.info(`generating polycubes of size ${argv.n}`);
		enumerate(argv.n);
	})
	.command('dummy', 'run enumerate 2 directly', (argv) => {
		if (argv.verbose) console.info(`generating polycubes of size ${argv.n}`);
		dummy();
	})
	.option('verbose', {
		alias: 'v',
		type: 'count',
		description: 'Run with verbose logging',
	})
	.showHelpOnFail(true)
	.help('help', 'Show usage instructions.')
	.alias('help', 'h')
	.parse();

// TODO render it?
// TODO metrics?
// TODO speed it all up
async function enumerate(n) {
	// TODO convert enumerate to a proper workflow
	//  - load n-1 (else enumerate(n-1))
	//  - generate
	//  - save n

	const shapes = await utils.file.loadJson('./precomputed/1.json');
	console.info(JSON.stringify(shapes, null, 2));
	const polycube = new Polycube({ shape: shapes[0] });
	console.info(polycube, polycube.size());
	await utils.file.saveArrayJson('./precomputed/1.json', shapes);
	console.info(JSON.stringify(generateNext([polycube])));
	console.log(`nothing to do with ${n}!\n`);
}

async function dummy() {
	const shapes = await utils.file.loadJson('./precomputed/1.json');
	console.info(JSON.stringify(shapes, null, 2));
	const polycube = new Polycube({ shape: shapes[0] });
	console.info(polycube, polycube.size());
	await utils.file.saveArrayJson('./precomputed/1.json', shapes);
	console.info(JSON.stringify(generateNext([polycube])));
}
