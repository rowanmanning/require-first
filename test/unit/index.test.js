'use strict';

const index = require('../../index');
const requireFirst = require('../../lib/require-first');

describe('index', () => {

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('aliases `lib/require-first`', () => {
		expect(index).toStrictEqual(requireFirst);
	});

});
