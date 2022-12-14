'use strict';

/**
 * @file    Creates uglified atomized class names like .rp__2xh3
 * @author  TheJaredWilcurt
 */

const { UGLIFYRESULT } = require('../api-type-definitions.js');

// a-z,0-9
const alphanumeric = 36;

/**
 * Increment the Uglifier index if it contains a known bad
 * value when base 36 encoded.
 *
 * @param  {number} uglifierIndex  Initial value
 * @return {number}                Incremented or original value (if good)
 */
function incrementIfContainsBad (uglifierIndex) {
  let knownBad = [
    'ad' // adblockers may hide these elements
  ];
  /**
   * Checks if a bad word can be found in a base 36 encoded number.
   *
   * @param  {string}  value  A string of text we want to avoid occuring in uglified class names
   * @return {boolean}        true = contains bad word, false = no bad word found
   */
  function containsBad (value) {
    return uglifierIndex.toString(alphanumeric).includes(value);
  }
  while (knownBad.some(containsBad)) {
    uglifierIndex = uglifierIndex + 1;
  }
  return uglifierIndex;
}

/**
 * Produces an class name with a prefix and a base 36 encoded index.
 *
 * @param  {number}       uglifierIndex  A starting value
 * @return {UGLIFYRESULT}                The class "name" and the incremented "index" number
 */
function cssUglifier (uglifierIndex) {
  uglifierIndex = uglifierIndex || 0;
  if (typeof(uglifierIndex) !== 'number') {
    uglifierIndex = 0;
  }
  uglifierIndex = Math.round(uglifierIndex);
  uglifierIndex = incrementIfContainsBad(uglifierIndex);

  return {
    name: '.rp__' + uglifierIndex.toString(alphanumeric),
    index: uglifierIndex + 1
  };
}

module.exports = cssUglifier;
