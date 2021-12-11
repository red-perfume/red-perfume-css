'use strict';

/**
 * @file    Validate and default the options object per documented API and log warnings.
 * @author  TheJaredWilcurt
 */

const helpers = require('./helpers.js');

const validator = {
  /**
   * Validates and defaults would-be booleans.
   *
   * @param  {boolean} key    Value to validate
   * @param  {boolean} value  Default value to use if not a boolean
   * @return {boolean}        The value or default
   */
  validateBoolean: function (key, value) {
    if (typeof(key) !== 'boolean') {
      key = value;
    }
    return key;
  },
  /**
   * Validates a value is a string.
   *
   * @param  {object} options  User's options
   * @param  {string} value    Value that should be a string
   * @param  {string} message  The message to log if not a string
   * @return {string}          The string or undefined
   */
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
  /**
   * Validates optional customLogger is a function.
   *
   * @param  {object} options  User's options
   * @return {object}          Modified user's options
   */
  validateCustomLogger: function (options) {
    if (!options.customLogger) {
      delete options.customLogger;
    } else if (typeof(options.customLogger) !== 'function') {
      delete options.customLogger;
      helpers.throwError(options, 'Optional customLogger must be a type of function.');
    }
    return options;
  },
  /**
   * Validates and defaults all values in the options object.
   *
   * @param  {object} options  User's options
   * @return {object}          Modified user's options
   */
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

module.exports = validator;
