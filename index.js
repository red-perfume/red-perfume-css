'use strict';

/**
 * @file    Main library entry point
 * @author  TheJaredWilcurt
 */

const { OPTIONS, OUTPUT } = require('./api-type-definitions.js');
const atomize = require('./src/atomize.js');
const validator = require('./src/validator.js');

/**
 * Red-Perfume-CSS library entry point.
 *
 * @param  {OPTIONS} [options]  User's options object based on the API
 * @return {OUTPUT}             Object with atomized CSS, classNames object, and styleErrors array
 */
const redPerfumeCss = function (options) {
  options = validator.validateOptions(options);
  return atomize(options);
};

module.exports = redPerfumeCss;
