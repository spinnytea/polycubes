const fs = require('fs');

const utilsFile = {

	loadJson: (filename) => utilsFile.loadFile(filename).then((data) => JSON.parse(data)),

	loadFile: (filename) => (
		new Promise((resolve, reject) => {
			fs.readFile(filename, 'utf8', (err, data) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(data);
				}
			});
		})
	),

	saveArrayJson: (filename, array) => (
		new Promise((resolve, reject) => {
			const content = `[\n${array
				.map((v) => JSON.stringify(v))
				.join(',\n')}\n]`;
			fs.writeFile(filename, content, (err) => {
				if (err) {
					reject(err);
				}
				else {
					resolve();
				}
			});
		})
	),

};

module.exports = utilsFile;
