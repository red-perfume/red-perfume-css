'use strict';

/**
 * @file    Converts CSS AST to a string
 * @author  TheJaredWilcurt
 */

const css = require('css');

const { STYLESHEETAST } = require('../api-type-definitions.js');

/**
 * Takes in a CSS AST and turns it into a string of CSS.
 *
 * @param  {STYLESHEETAST} input  A CSS Abstract Syntax Tree (AST)
 * @return {string}               Valid CSS (not minified)
 */
function cssStringify (input) {
  if (
    typeof(input) !== 'object' ||
    Array.isArray(input) ||
    !input.stylesheet ||
    !input.stylesheet.rules
  ) {
    return '';
  }

  const options = {};
  const styles = css.stringify(input, options);

  return styles
    .split('}\n\n')
    .join('}\n');
}

module.exports = cssStringify;
