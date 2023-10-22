'use strict';

/**
 * @file    Encodes a CSS class name
 * @author  TheJaredWilcurt
 */

const {
  DECLARATION,
  OPTIONS,
  SELECTORS
} = require('../api-type-definitions.js');

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
  return;
}

// TODO: Eventually this should be an option user's can provide.
const prefix = 'rp__';

/**
 * Takes in any string and encodes it to a new string.
 *
 * @param  {string} str  Input string ('rp__padding:2px')
 * @return {string}      Output string ('rp__padding__--COLON2px')
 */
function encodeString (str) {
  const arr = str.split('');
  const encoded = arr.map(function (character) {
    return (
      propertyValueEncodingMap[character] ||
      unicodeEncoding(character) ||
      character
    );
  });
  return encoded.join('');
}

/**
 * Takes parts of a selector and returns them encoded with a prefix.
 *
 * @param  {Array}  fragments  A portion of a selector (tags, classes, etc)
 * @param  {string} prefix     Matching prefix constant for this fragment type
 * @return {string}            All related strings prefixed and joined
 */
function prependClassNameFragmentPrefix (fragments, prefix) {
  const stringArray = fragments.map(function (fragment) {
    return encodeString(fragment);
  });
  return helpers.joinStringArrayWithCharacterPrefix(stringArray, prefix);
}

/**
 * Encodes property/value pairs as valid, decodable classnames.
 *
 * @example
 * let encodedClassName = encodeClassName(options, declaration);
 *
 * @param  {OPTIONS}     options      User's passed in options, containing verbose/customLoger
 * @param  {SELECTORS}   selectors    [description]
 * @param  {DECLARATION} declaration  Contains the Property and Value strings
 * @param  {string[]}    styleErrors  Array of strings for all style related errors
 * @return {string}                   A classname starting with . and a prefix
 */
function encodeClassName (options, selectors, declaration, styleErrors) {
  styleErrors = styleErrors || [];
  if (!declaration || declaration.property === undefined || declaration.value === undefined) {
    styleErrors.push(constants.IMPRESSED_MESSAGE);
    helpers.throwError(options, constants.IMPRESSED_MESSAGE);
  }
  declaration = declaration || {};
  const tagSection = prependClassNameFragmentPrefix(selectors.tags, constants.PREFIX.TAG);
  const idSection = prependClassNameFragmentPrefix(selectors.ids, constants.PREFIX.ID);
  const classSection = prependClassNameFragmentPrefix(selectors.classes, constants.PREFIX.CLASS) ;
  const pseudoSection = prependClassNameFragmentPrefix(selectors.pseudoNames, constants.PREFIX.PSUEDO);
  const newName = declaration.property + ':' + declaration.value;
  const encoded = encodeString(newName);
  return '.' + prefix + tagSection + idSection + classSection + pseudoSection + encoded;
}

// This is exported out too for a unit test
encodeClassName.propertyValueEncodingMap = propertyValueEncodingMap;
module.exports = encodeClassName;
