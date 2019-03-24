'use strict';

describe('lib/require-first', () => {
	let requireFirst;

	beforeEach(() => {
		jest.resetModules();
		requireFirst = require('../../../lib/require-first');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('requireFirst(modules)', () => {
		let returnValue;

		beforeEach(() => {
			jest.mock('module-1', () => 'mock-module-1', {virtual: true});
			jest.mock('module-2', () => 'mock-module-2', {virtual: true});
			jest.mock('module-3', () => 'mock-module-3', {virtual: true});
			jest.mock('module-error', () => {
				throw new Error('mock-error');
			}, {virtual: true});
			jest.mock('module-error-sub', () => require('module-nope'), {virtual: true});
		});

		describe('when one module is required and it exists', () => {

			beforeEach(() => {
				returnValue = requireFirst(['module-1']);
			});

			it('returns the module', () => {
				expect(returnValue).toStrictEqual(require('module-1'));
			});

		});

		describe('when multiple modules are required and the first exists', () => {

			beforeEach(() => {
				returnValue = requireFirst(['module-1', 'module-2', 'module-3']);
			});

			it('returns the first module', () => {
				expect(returnValue).toStrictEqual(require('module-1'));
			});

		});

		describe('when multiple modules are required and the first does not exist, but the second does', () => {

			beforeEach(() => {
				returnValue = requireFirst(['module-one', 'module-2', 'module-3']);
			});

			it('returns the first module', () => {
				expect(returnValue).toStrictEqual(require('module-2'));
			});

		});

		describe('when multiple modules are required and the first and second do not exist, but the third does', () => {

			beforeEach(() => {
				returnValue = requireFirst(['module-one', 'module-two', 'module-3']);
			});

			it('returns the first module', () => {
				expect(returnValue).toStrictEqual(require('module-3'));
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
				expect(error).toBeInstanceOf(Error);
				expect(error.code).toStrictEqual('MODULE_NOT_FOUND');
				expect(error.message).toStrictEqual(`Cannot find any of modules 'module-one', 'module-two', 'module-three'`);
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
				expect(error).toBeInstanceOf(Error);
				expect(error.message).toStrictEqual('mock-error');
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
				expect(error.message).toStrictEqual(`Cannot find module 'module-nope' from 'require-first.test.js'`);
			});

		});

	});

});
