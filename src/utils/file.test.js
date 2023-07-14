const path = require('path');
const utilFile = require('./file');

describe('file', () => {
	test('loadJson', async () => {
		const json = await utilFile.loadJson(path.join(__dirname, '..', '..', 'precomputed', '1.json'));
		expect(json).toEqual([[[[1]]]]);
	});
});