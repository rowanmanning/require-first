'use strict';

const missingModuleErrorRegExp = /^cannot find module '([^']+)'/i;

/**
 * Require the first module that successfully resolves.
 *
 * @public
 * @param {string[]} modules
 *     An array of modules to load. This uses `require` under the hood.
 * @param {any} [defaultReturnValue]
 *     The value to return if none of the modules are found.
 * @returns {any}
 *     Returns the first module that loads or `defaultReturnValue`.
 * @throws {Error}
 *     Throws if none of the modules can be loaded and `defaultReturnValue` is not defined.
 */
exports.requireFirst = function requireFirst(modules, defaultReturnValue) {
	for (const [index, module] of Object.entries(modules)) {
		try {
			return require(module);
		} catch (/** @type {any} */ error) {
			if (error.code !== 'MODULE_NOT_FOUND') {
				throw error;
			}
			const match = error.message.match(missingModuleErrorRegExp);
			if (match && match[1] !== module) {
				throw error;
			}
			if (index === `${modules.length - 1}`) {
				if (!defaultReturnValue) {
					throw createModuleError(modules);
				}
				return defaultReturnValue;
			}
		}
	}
};

/**
 * Create a module error.
 *
 * @private
 * @param {string[]} modules
 *     An array of module names that could not be loaded.
 * @returns {Error}
 *     Returns the created error.
 */
function createModuleError(modules) {
	const quotedModules = modules.map((module) => `'${module}'`).join(', ');
	const moduleError = new Error(`Cannot find any of modules ${quotedModules}`);
	// @ts-ignore
	moduleError.code = 'MODULE_NOT_FOUND';
	return moduleError;
}
