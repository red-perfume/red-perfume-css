'use strict';

/**
 * @file    Validate and default the options object per documented API and log warnings.
 * @author  TheJaredWilcurt
 */

const helpers = require('./helpers.js');

const validator = {
  validateBoolean: function (key, value) {
    if (typeof(key) !== 'boolean') {
      key = value;
    }
    return key;
  },
  validateString: function (options, value, message) {
    if (value === '' || (value && typeof(value) !== 'string')) {
      value = undefined;
      helpers.throwError(options, message);
    }
    if (!value) {
      value = undefined;
    }
    return value;
  },
  validateCustomLogger: function (options) {
    if (!options.customLogger) {
      delete options.customLogger;
    } else if (typeof(options.customLogger) !== 'function') {
      delete options.customLogger;
      helpers.throwError(options, 'Optional customLogger must be a type of function.');
    }
    return options;
  },
  validateOptions: function (options) {
    if (typeof(options) !== 'object' || Array.isArray(options)) {
      options = undefined;
    }
    options = options || {};

    options.atomizedCss = '';
    options.classMap = {};
    options.styleErrors = [];

    options.verbose = this.validateBoolean(options.verbose, true);
    options = this.validateCustomLogger(options);

    options.uglify = this.validateBoolean(options.uglify, false);
    options.input = this.validateString(options, options.input, 'CSS Input must be a string with length > 0.');

    return options;
  }
};

/**
 * Validates the users options and sets default values.
 * Logs warnings.
 *
 * @param  {object} options  User's options
 * @return {object}          Defaulted/validated user options
 */
module.exports = function (options) {
  return validator.validateOptions(options);
};
