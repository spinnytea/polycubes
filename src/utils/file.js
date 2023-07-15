const fs = require('fs');
const path = require('path');

const utilsFile = {

	existsSync: (filepath) => fs.existsSync(filepath),
	unlinkSync: (filepath) => fs.unlinkSync(filepath),

	loadJson: (filepath) => utilsFile.loadFile(filepath).then((data) => JSON.parse(data)),

	loadFile: (filepath) => (
		new Promise((resolve, reject) => {
			fs.readFile(filepath, 'utf8', (err, data) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(data);
				}
			});
		})
	),

	saveArrayJson: (filepath, array) => (
		new Promise((resolve, reject) => {
			const content = `[\n${array
				.map((v) => JSON.stringify(v))
				.join(',\n')}\n]`;
			fs.writeFile(filepath, content, (err) => {
				if (err) {
					reject(err);
				}
				else {
					resolve();
				}
			});
		})
	),

	listFiles: (folder) => (
		new Promise((resolve, reject) => {
			fs.readdir(folder, (err, filenames) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(filenames.map((filename) => path.join(folder, filename)));
				}
			});
		})
	),

};

module.exports = utilsFile;
