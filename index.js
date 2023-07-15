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
		enumerate(argv);
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

// TODO metrics? (how many polycubes created, pruned, spaces tested, etc)
// TODO speed it all up
async function enumerate(argv) {
	const { n, verbose } = argv;
	if (n < 1) throw new Error('n cannot be lower than 1');
	if (n === 1) return; // this one is checked in
	const MAX_N = 3;
	if (n > MAX_N) throw new Error(`n is too high (for now, max of ${MAX_N})`);

	// check if we have generated the one below
	// if not, do so first
	if (!utils.file.existsSync(`./precomputed/${n - 1}.json`)) {
		if (verbose) console.info(`precomputing ${n - 1}`);
		await enumerate({ ...argv, n: n - 1 });
	}
	// compute the requested level even if it already exists (because testing, who wants to delete it to run it again)

	console.time(`generating polycubes for ${n}`);

	if (verbose) console.info(`loading polycubes for ${n - 1}`);
	const shapes = await utils.file.loadJson(`./precomputed/${n - 1}.json`);
	const polycubes = shapes.map((shape) => new Polycube({ shape }));

	if (verbose) console.info('generating...');
	const foundPolycubes = generateNext(polycubes);
	const foundShapes = foundPolycubes.map((polycube) => polycube.shape);

	if (verbose) console.info(`saving ${foundShapes.length} shapes for n=${n}`);
	await utils.file.saveArrayJson(`./precomputed/${n}.json`, foundShapes);

	console.timeEnd(`generating polycubes for ${n}`);
}

async function dummy() {
	const shapes = await utils.file.loadJson('./precomputed/1.json');
	console.info(JSON.stringify(shapes, null, 2));
	const polycube = new Polycube({ shape: shapes[0] });
	console.info(polycube, polycube.size());
	await utils.file.saveArrayJson('./precomputed/1.json', shapes);
	console.info(JSON.stringify(generateNext([polycube])));
}
