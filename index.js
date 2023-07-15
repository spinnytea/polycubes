#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { generateNext } = require('./src/generate/simple_layers');
const dynamic = require('./src/dynamic');
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
	.command('clean', 'remove old precomputed files', () => {
		clean();
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
// TODO is it useful to sort anything? can we find collisions faster?
function enumerate(argv) {
	const { n, verbose } = argv;
	return dynamic(generateNext, { n, verbose });
}

async function dummy() {
	const shapes = await utils.file.loadJson('./precomputed/1.json');
	console.info(JSON.stringify(shapes, null, 2));
	const polycube = new Polycube({ shape: shapes[0] });
	console.info(polycube, polycube.size());
	await utils.file.saveArrayJson('./precomputed/1.json', shapes);
	console.info(JSON.stringify(generateNext([polycube])));
}

function clean() {
	utils.file.listFiles('./precomputed').then((filepaths) => {
		filepaths.forEach((filepath) => {
			if (filepath.endsWith('.gitignore')) return;
			if (filepath.endsWith('1.json')) return;

			console.info(`deleting ${filepath}`);
			utils.file.unlinkSync(filepath);
		});
	});
}
