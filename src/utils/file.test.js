const path = require('path');
const utils = require('.');

describe('utils.file', () => {
	test('loadJson', async () => {
		const json = await utils.file.loadJson(path.join(__dirname, '..', '..', 'precomputed', '1.json'));
		expect(json).toEqual([[[[1]]]]);
	});
});