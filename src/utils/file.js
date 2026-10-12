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

	/** like ndjson, but still json */
	saveArrayJson: (filepath, array) =>
		new Promise((resolve, reject) => {
			const content = `[\n${array.map((v) => JSON.stringify(v)).join(',\n')}\n]`;
			fs.writeFile(filepath, content, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		}),

	saveNDJson: (filepath, array) =>
		new Promise((resolve, reject) => {
			const content = array.map((v) => JSON.stringify(v)).join('\n');
			fs.writeFile(filepath, content, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		}),

	loadNDJson: (filepath) =>
		utilsFile.loadFile(filepath).then((content) => {
			return content.split('\n').map((line) => JSON.parse(line));
		}),

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
