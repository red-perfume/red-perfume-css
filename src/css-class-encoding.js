'use strict';

/**
 * @file    Encodes a CSS class name
 * @author  TheJaredWilcurt
 */

const constants = require('./constants.js');
const helpers = require('./helpers.js');

const symbolMap = {
  '&': 'AMPERSAND',
  '*': 'ASTERISK',
  '@': 'ATSIGN',
  '\\': 'BACKSLASH',
  '^': 'CARET',
  '¢': 'CENT',
  '>': 'CLOSEANGLEBRACKET',
  '}': 'CLOSECURLYBRACE',
  ')': 'CLOSEPAREN',
  ']': 'CLOSESQUAREBRACKET',
  ':': 'COLON',
  ',': 'COMMA',
  '©': 'COPYRIGHT',
  '¤': 'CURRENCY',
  '°': 'DEGREE',
  '÷': 'DIVIDE',
  $: 'DOLARSIGN',
  '.': 'DOT',
  '"': 'DOUBLEQUOTE',
  '=': 'EQUAL',
  '!': 'EXCLAMATION',
  '/': 'FORWARDSLASH',
  '`': 'GRAVE',
  '½': 'HALF',
  µ: 'MU',
  '#': 'OCTOTHORP',
  '<': 'OPENANGLEBRACKET',
  '{': 'OPENCURLYBRACE',
  '(': 'OPENPAREN',
  '[': 'OPENSQUAREBRACKET',
  '¶': 'PARAGRAPH',
  '%': 'PERCENT',
  '|': 'PIPE',
  '+': 'PLUS',
  '±': 'PLUSMINUS',
  '£': 'POUNDSTERLING',
  '¼': 'QUARTER',
  '?': 'QUESTIONMARK',
  '®': 'REGISTERED',
  ';': 'SEMICOLON',
  '\'': 'SINGLEQUOTE',
  '¾': 'THREEQUARTERS',
  '~': 'TILDE',
  '¥': 'YENYUAN'
};

const prefixedSymbolMap = {};

Object.keys(symbolMap).forEach(function (key) {
  prefixedSymbolMap[key] = constants.PREFIX.SYMBOL + symbolMap[key];
});

// Initially I thought this too verbose, but there is literally no limit on class lengths other than the machine's memory/CPU.
// Firefox actually let me create and reference a classname with 100,000,000 characters. It was slow, but it worked fine.
const propertyValueEncodingMap = {
  ...prefixedSymbolMap,
  ' ': constants.PREFIX.SPACE
};

/**
 * Takes in a single character string. If it is part of the normal ASCII set, does nothing,
 * otherwise returns '__--U' and the charCode.
 *
 * @example
 * unicodeEncoding('â'); // '__--U226'
 *
 * @param  {string} character  A single character string
 * @return {string}            The original ASCII char or '__--U' + charCode
 */
function unicodeEncoding (character) {
  let code = character.charCodeAt();
  // 33 = !, 48 = 0, 65 = A, 97 = a, 126 = ~
  if (code < 33 || code > 126) {
    return constants.PREFIX.SYMBOL + 'U' + code;
  }
}

// TODO: Eventually this should be an option user's can provide.
const prefix = 'rp__';

/**
 * Encodes propter/value pairs as valid, decodable classnames.
 *
 * @example
 * let encodedClassName = encodeClassName(options, declaration);
 *
 * @param  {object} options      User's passed in options, containing verbose/customLoger
 * @param  {object} declaration  Contains the Property and Value strings
 * @param  {Array}  styleErrors  Array containing all style related errors
 * @return {string}              A classname starting with . and a prefix
 */
function encodeClassName (options, declaration, styleErrors) {
  styleErrors = styleErrors || [];
  if (!declaration || declaration.property === undefined || declaration.value === undefined) {
    styleErrors.push(constants.IMPRESSED_MESSAGE);
    helpers.throwError(options, constants.IMPRESSED_MESSAGE);
  }
  declaration = declaration || {};
  let newName = declaration.property + ':' + declaration.value;
  let nameArray = newName.split('');
  let encoded = nameArray.map(function (character) {
    return (
      propertyValueEncodingMap[character] ||
      unicodeEncoding(character) ||
      character
    );
  });
  return '.' + prefix + encoded.join('');
}

// This is exported out too for a unit test
encodeClassName.propertyValueEncodingMap = propertyValueEncodingMap;
module.exports = encodeClassName;
