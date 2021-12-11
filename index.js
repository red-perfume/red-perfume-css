'use strict';

/**
 * @file    Main library entry point
 * @author  TheJaredWilcurt
 */

const validator = require('./src/validator.js');
const atomize = require('./src/atomize.js');

/**
 * Red-Perfume-CSS library entry point.
 *
 * @param  {object} options  User's options object based on the API
 * @return {object}          Object with atomized CSS and classNames object
 */
const redPerfumeCss = function (options) {
  options = validator(options);
  return atomize(options);
};

module.exports = redPerfumeCss;
