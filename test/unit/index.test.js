'use strict';

const assert = require('proclaim');

describe('index', () => {
	let index;
	let requireFirst;

	beforeEach(() => {
		index = require('../../index');
		requireFirst = require('../../lib/require-first');
	});

	it('aliases `lib/require-first`', () => {
		assert.strictEqual(index, requireFirst);
	});

});
