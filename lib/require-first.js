/**
 * @rowanmanning/require-first module
 * @module @rowanmanning/require-first
 */
'use strict';

/**
 * Require the first module that successfully resolves.
 *
 * @access public
 * @param {Array<String>} modules
 *     An array of modules to load. This uses `require` under the hood.
 * @returns {*}
 *     Returns the first module that loads.
 * @throws {Error}
 *     Throws if none of the modules can be loaded.
 */
module.exports = function requireFirst(modules) {
	for (const [index, module] of Object.entries(modules)) {
		try {
			return require(module);
		} catch (error) {
			if (error.code !== 'MODULE_NOT_FOUND') {
				throw error;
			}
			const match = error.message.match(/^cannot find module '([^']+)'/i);
			if (match && match[1] !== module) {
				throw error;
			}
			if (index === `${modules.length - 1}`) {
				throw createModuleError(modules);
			}
		}
	}
};

/**
 * Create a module error.
 *
 * @access private
 * @param {Array<String>} modules
 *     An array of module names that could not be loaded.
 * @returns {Error}
 *     Returns the created error.
 */
function createModuleError(modules) {
	const quotedModules = modules.map(module => `'${module}'`).join(', ');
	const moduleError = new Error(`Cannot find any of modules ${quotedModules}`);
	moduleError.code = 'MODULE_NOT_FOUND';
	return moduleError;
}
