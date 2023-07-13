#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
	.command('generate [n]', 'generate polycubes of size n', (yargs) => {
		return yargs
		.positional('n', {
			describe: 'how large are the polycubes (how many cubical cells)',
			type: 'number',
			default: 1
		})
	}, (argv) => {
		if (argv.verbose) console.info(`generating polycubes of size ${argv.n}`)
		generate(argv.n)
	})
	.option('verbose', {
		alias: 'v',
		type: 'count',
		description: 'Run with verbose logging'
	})
	.parse()

function generate(n) {
	console.error(`nothing to do with ${n}!\n`);
}
