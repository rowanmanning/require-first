'use strict';

const assert = require('node:assert');
const td = require('testdouble');

describe('lib/require-first', () => {
	let requireFirst;
	let returnValue;

	beforeEach(() => {
		td.replace('module-1', 'mock-module-1');
		td.replace('module-2', 'mock-module-2');
		td.replace('module-3', 'mock-module-3');
		// Mockery.registerSubstitute('module-error', `${__dirname}/../mock/module-error`);
		// mockery.registerSubstitute('module-error-sub', `${__dirname}/../mock/module-error-sub`);
		requireFirst = require('../../../lib/require-first');
	});

	describe('requireFirst(modules)', () => {
		describe('when one module is required and it exists', () => {
			beforeEach(() => {
				returnValue = requireFirst(['module-1']);
			});

			it('returns the module', () => {
				assert.strictEqual(returnValue, 'mock-module-1');
			});
		});

		describe('when multiple modules are required and the first exists', () => {
			beforeEach(() => {
				returnValue = requireFirst(['module-1', 'module-2', 'module-3']);
			});

			it('returns the first module', () => {
				assert.strictEqual(returnValue, 'mock-module-1');
			});
		});

		describe('when multiple modules are required and the first does not exist, but the second does', () => {
			beforeEach(() => {
				returnValue = requireFirst(['module-one', 'module-2', 'module-3']);
			});

			it('returns the second module', () => {
				assert.strictEqual(returnValue, 'mock-module-2');
			});
		});

		describe('when multiple modules are required and the first and second do not exist, but the third does', () => {
			beforeEach(() => {
				returnValue = requireFirst(['module-one', 'module-two', 'module-3']);
			});

			it('returns the third module', () => {
				assert.strictEqual(returnValue, 'mock-module-3');
			});
		});

		describe('when multiple modules are required but none exist', () => {
			let error;

			beforeEach(() => {
				try {
					requireFirst(['module-one', 'module-two', 'module-three']);
				} catch (caughtError) {
					error = caughtError;
				}
			});

			it('throws an error', () => {
				assert.ok(error instanceof Error);
				assert.strictEqual(error.code, 'MODULE_NOT_FOUND');
				assert.strictEqual(
					error.message,
					`Cannot find any of modules 'module-one', 'module-two', 'module-three'`
				);
			});
		});

		describe('when a module is found but it throws an error', () => {
			let error;

			beforeEach(() => {
				try {
					requireFirst([`${__dirname}/../mock/module-error`, 'module-1']);
				} catch (caughtError) {
					error = caughtError;
				}
			});

			it('throws the error', () => {
				assert.ok(error instanceof Error);
				assert.strictEqual(error.message, 'mock-error');
			});
		});

		describe('when a module is found but one of its sub-dependencies is not', () => {
			let error;

			beforeEach(() => {
				try {
					requireFirst([`${__dirname}/../mock/module-error-sub`, 'module-1']);
				} catch (caughtError) {
					error = caughtError;
				}
			});

			it('throws the error', () => {
				assert.ok(/^cannot find module 'module-nope'/i.test(error.message));
			});
		});
	});

	describe('requireFirst(modules, defaultReturnValue)', () => {
		describe('when multiple modules are required but none exist', () => {
			beforeEach(() => {
				returnValue = requireFirst(
					['module-one', 'module-two', 'module-three'],
					'mock-default-return-value'
				);
			});

			it('returns `defaultReturnValue`', () => {
				assert.strictEqual(returnValue, 'mock-default-return-value');
			});
		});
	});

	describe('.default', () => {
		it('aliases the module exports', () => {
			assert.strictEqual(requireFirst, requireFirst.default);
		});
	});
});
