'use strict';

/**
 * @file    Shared helper functions used in multiple files
 * @author  TheJaredWilcurt
 */

const helpers = {
  /**
   * Either calls the customLogger or does
   * console.error when errors/warnings happen
   * during validation or execution.
   *
   * @param {object} options  User's options on verbose and custom logging
   * @param {string} message  Human readable warning/error
   * @param {any}    error    Caught error object
   */
  throwError: function (options, message, error) {
    options.styleErrors.push({ message, error });
    if (options.verbose && options.customLogger) {
      options.customLogger(message, error);
    } else if (options.verbose) {
      console.error(
        '_________________________\n' +
        'Red-Perfume-CSS:\n' +
        message,
        error
      );
    }
  }
};

module.exports = helpers;
