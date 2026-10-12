const fs = require('fs');
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

	/** @deprecated like ndjson, but still json */
	saveArrayJson: (filepath, array) =>
		utilsFile.saveFile(filepath, () => `[\n${array.map((v) => JSON.stringify(v)).join(',\n')}\n]`),

	saveNDJson: (filepath, array) => utilsFile.saveFile(filepath, () => array.map((v) => JSON.stringify(v)).join('\n')),

	loadNDJson: (filepath) =>
		utilsFile.loadFile(filepath).then((data) => data.split('\n').map((line) => JSON.parse(line))),

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
};

module.exports = utilsFile;
