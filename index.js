const validator = require('./src/validator.js');
const atomize = require('./src/atomize.js');

const redPerfumeCss = function (options) {
  options = validator(options);
  return atomize(options);
};

module.exports = redPerfumeCss;
