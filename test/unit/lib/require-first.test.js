'use strict';

const assert = require('proclaim');
const mockery = require('mockery');

describe('lib/require-first', () => {
	let requireFirst;

	beforeEach(() => {
		requireFirst = require('../../../lib/require-first');
	});

	describe('requireFirst(modules)', () => {
		let returnValue;

		beforeEach(() => {
			mockery.registerSubstitute('module-1', `${__dirname}/../mock/module-1`);
			mockery.registerSubstitute('module-2', `${__dirname}/../mock/module-2`);
			mockery.registerSubstitute('module-3', `${__dirname}/../mock/module-3`);
			mockery.registerSubstitute('module-error', `${__dirname}/../mock/module-error`);
			mockery.registerSubstitute('module-error-sub', `${__dirname}/../mock/module-error-sub`);
		});

		describe('when one module is required and it exists', () => {

			beforeEach(() => {
				returnValue = requireFirst(['module-1']);
			});

			it('returns the module', () => {
				assert.strictEqual(returnValue, require('module-1'));
			});

		});

		describe('when multiple modules are required and the first exists', () => {

			beforeEach(() => {
				returnValue = requireFirst(['module-1', 'module-2', 'module-3']);
			});

			it('returns the first module', () => {
				assert.strictEqual(returnValue, require('module-1'));
			});

		});

		describe('when multiple modules are required and the first does not exist, but the second does', () => {

			beforeEach(() => {
				returnValue = requireFirst(['module-one', 'module-2', 'module-3']);
			});

			it('returns the first module', () => {
				assert.strictEqual(returnValue, require('module-2'));
			});

		});

		describe('when multiple modules are required and the first and second do not exist, but the third does', () => {

			beforeEach(() => {
				returnValue = requireFirst(['module-one', 'module-two', 'module-3']);
			});

			it('returns the first module', () => {
				assert.strictEqual(returnValue, require('module-3'));
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
				assert.isInstanceOf(error, Error);
				assert.strictEqual(error.code, 'MODULE_NOT_FOUND');
				assert.strictEqual(error.message, `Cannot find any of modules 'module-one', 'module-two', 'module-three'`);
			});

		});

		describe('when a module is found but it throws an error', () => {
			let error;

			beforeEach(() => {
				try {
					requireFirst(['module-error']);
				} catch (caughtError) {
					error = caughtError;
				}
			});

			it('throws the error', () => {
				assert.isInstanceOf(error, Error);
				assert.strictEqual(error.message, 'mock-error');
			});

		});

		describe('when a module is found but one of its sub-dependencies is not', () => {
			let error;

			beforeEach(() => {
				try {
					requireFirst(['module-error-sub']);
				} catch (caughtError) {
					error = caughtError;
				}
			});

			it('throws the error', () => {
				assert.strictEqual(error.message, `Cannot find module 'module-nope'`);
			});

		});

	});

});
