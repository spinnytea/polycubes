import { describe, test, expect } from 'vitest';
const path = require('path');
const utils = require('.');

describe('utils.file', () => {
	test('loadNDJson', async () => {
		const json = await utils.file.loadNDJson(path.join(__dirname, '..', '..', 'precomputed', '1.ndjson'));
		expect(json).toEqual([[[[1]]]]);
	});
});
