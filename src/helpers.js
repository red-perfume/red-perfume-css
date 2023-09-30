'use strict';

/**
 * @file    Shared helper functions used in multiple files
 * @author  TheJaredWilcurt
 */

const { OPTIONS } = require('../api-type-definitions.js');

const helpers = {
  /**
   * Takes array of strings and prefixes each with a given value.
   * Returns them joined on empty string.
   *
   * @param  {string[]} stringArray      Array of strings representing a portion of a selector to be prefixed
   * @param  {string}   characterPrefix  A prefix constant.
   * @return {string}                    The prefixed strings joined together.
   */
  joinStringArrayWithCharacterPrefix: function (stringArray, characterPrefix) {
    if (
      !Array.isArray(stringArray) ||
      !stringArray.length
    ) {
      return '';
    }
    if (characterPrefix) {
      return stringArray
        .map(function (element) {
          return characterPrefix + element;
        })
        .join('');
    }
    return stringArray.join('');
  },
  /**
   * Takes a string and replaces spaces with returns if
   * they are the last space on a console line (108 chars).
   *
   * @param  {string} message  Human readable warning/error
   * @return {string}          Message with returns added
   */
  insertReturns: function (message) {
    message = message || '';
    const maxLineLength = 108;
    let words = message.split(' ');
    let line = '';
    let lines = [];
    words.forEach(function (word) {
      let potentialLine = line + ' ' + word;
      if (potentialLine.length < maxLineLength) {
        line = potentialLine;
      } else {
        lines.push(line);
        line = word;
      }
    });
    lines.push(line.trim());
    return lines.join('\n').trim();
  },
  /**
   * Either calls the customLogger or does
   * console.error when errors/warnings happen
   * during validation or execution.
   *
   * @param {OPTIONS} options  User's options on verbose and custom logging
   * @param {string}  message  Human readable warning/error
   * @param {any}     error    Caught error object
   */
  throwError: function (options, message, error) {
    options.styleErrors.push({ message, error });
    if (options.verbose && options.customLogger) {
      options.customLogger(message, error);
    } else if (options.verbose) {
      console.error(
        '_________________________\n' +
        'Red-Perfume-CSS:\n' +
        this.insertReturns(message),
        error
      );
    }
  }
};

module.exports = helpers;
