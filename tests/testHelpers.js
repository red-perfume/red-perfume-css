'use strict';

/**
 * @file    Helper functions used by unit tests
 * @author  TheJaredWilcurt
 */

const testHelpers = {
  /**
   * Removes a set amount of spaces from the start of every line passed in.
   * Used to make test expectations more readable.
   *
   * @param  {string} value   The text to change
   * @param  {number} amount  How much indentation to remove from each line
   * @return {string}         The changed text
   */
  trimIndentation: function (value, amount) {
    value = value || '';
    amount = amount || 2;
    let output = [];

    let spaces = new Array(amount).fill(' ').join('');
    let lines = value.split('\n');
    lines.forEach(function (line) {
      if (line.trim() !== '') {
        output.push(line.replace(spaces, ''));
      }
    });

    value = output.join('\n');
    return value.trim();
  }
};

module.exports = testHelpers;
