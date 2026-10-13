const fs = require('fs');
const readline = require('node:readline');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const path = require('path');

const utilsFile = {
	existsSync: (filepath) => fs.existsSync(filepath),
	unlinkSync: (filepath) => fs.unlinkSync(filepath),
	mkdirSync: (filepath) => {
		if (!fs.existsSync(filepath)) {
			fs.mkdirSync(filepath);
			return true;
		}
		return false;
	},

	loadJson: (filepath) => utilsFile.loadFile(filepath).then((data) => JSON.parse(data)),

	loadFile: (filepath) =>
		new Promise((resolve, reject) => {
			fs.readFile(filepath, 'utf8', (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		}),

	saveFile: (filepath, data) =>
		new Promise((resolve, reject) => {
			fs.writeFile(filepath, typeof data === 'function' ? data() : data, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		}),

	saveNDJson: (filepath, array) =>
		utilsFile.saveFile(filepath, () => array.map((v) => JSON.stringify(v)).join('\n') + '\n'),

	loadNDJson: (filepath) =>
		utilsFile.loadFile(filepath).then((data) =>
			data
				.trim()
				.split('\n')
				.map((line) => JSON.parse(line))
		),

	listFiles: (folder) =>
		new Promise((resolve, reject) => {
			fs.readdir(folder, (err, filenames) => {
				if (err) {
					reject(err);
				} else {
					resolve(filenames.map((filename) => path.join(folder, filename)));
				}
			});
		}),

	/**
		read one line at a time using a generator

		@example
			for await (const line of utils.file.readlineStream(fp)) {
				console.log('read line: ' + line);
			}
	*/
	readlineStream: (filepath) =>
		readline.createInterface({
			input: fs.createReadStream(filepath),
			crlfDelay: Infinity,
		}),

	/** use a generator to yield content to a file; file closes when generator ends */
	pipelineWriteStream: async (filepath, generator) =>
		pipeline(Readable.from(generator()), fs.createWriteStream(filepath)),
};

module.exports = utilsFile;
