/**
 * OPTIONAL: console.error is called by default if verbose: true.
 *
 * Your own custom logging function called with helpful warning/error
 * messages from the internal validators. Only used if verbose: true.
 *
 * @callback {Function} CUSTOMLOGGER
 * @param    {string}   message       The human readable warning/error message
 * @param    {object}   [error]       Sometimes an error or options object is passed
 * @return   {void}
 */

/**
 * @typedef  {object}       OPTIONS
 * @property {boolean}      [verbose=true]  Logs out helpful warnings/errors using `customLogger` or console.error.
 * @property {CUSTOMLOGGER} [customLogger]  Called (if verbose: true) with helpful warning/error messages from internal validators.
 * @property {boolean}      [uglify=false]  If `false` atomized classes are long (`.rp__padding__--COLOR12px`). If `true` they are short (`.rp__b5p`).
 * @property {string}       [input='']      A string of any valid CSS to be atomized
 */

/**
 * @typedef  {object} CLASSMAP
 * @property {object.<string, string[]>} classMapEntry  The key is the original classname, the value is an array of strings of atomized classes
 */

/**
 * @typedef  {object}  SELECTORCHUNK
 * @property {string}  type           The type of selector ('tag', 'attribute')
 * @property {string}  name           Selector name ('class')
 * @property {string}  action         Action ('element')
 * @property {string}  value          Actual selector value ('cow')
 * @property {boolean} ignoreCase     If casing should be ignored (false)
 * @property {string}  namespace      Not sure what this is (null)
 * @property {string}  original       The original value for this selector ('.cow')
 */

/**
 * @typedef {SELECTORCHUNK[]} SELECTOR
 */

/**
 * @typedef {SELECTOR[]} SELECTORS
 */

/**
 * @typedef  {object} DECLARATION
 * @property {string} type      The type of AST ('declaration')
 * @property {string} property  The CSS property name ('background', 'width')
 * @property {string} value     The CSS value ('#F00', '100px')
 */

/**
 * @typedef {DECLARATION[]} DECLARATIONS
 */

/**
 * @typedef  {object}       RULE
 * @property {string}       type          The type of the AST ('rule')
 * @property {SELECTORS}    selectors     Array of arrays containing AST objects for each part of the CSS Selector
 * @property {DECLARATIONS} declarations  Array of declaration objects for each property/value pair
 */

/**
 * @typedef  {object}   OUTPUT
 * @property {CLASSMAP} classMap     Example: { '.cow': ['.rp__0', '.rp__1'], '.moo': ['.rp__2', '.rp__1'] }
 * @property {string}   atomizedCss  A string of atomized CSS styles
 * @property {string[]} styleErrors  Array of strings of errors that occurred, or empty array if no errors occurred
 */

/**
 * @type {CUSTOMLOGGER}
 */
let CUSTOMLOGGER;

/**
 * @type {OPTIONS}
 */
let OPTIONS;

/**
 * @type {CLASSMAP}
 */
let CLASSMAP;

/**
 * @type {SELECTORCHUNK}
 */
let SELECTORCHUNK;

/**
 * @type {SELECTOR}
 */
let SELECTOR;

/**
 * @type {SELECTORS}
 */
let SELECTORS;

/**
 * @type {DECLARATION}
 */
let DECLARATION;

/**
 * @type {DECLARATIONS}
 */
let DECLARATIONS;

/**
 * @type {RULE}
 */
let RULE;

/**
 * @type {OUTPUT}
 */
let OUTPUT;

module.exports = {
  CUSTOMLOGGER,
  OPTIONS,
  CLASSMAP,
  SELECTORCHUNK,
  SELECTOR,
  SELECTORS,
  DECLARATION,
  DECLARATIONS,
  RULE,
  OUTPUT
};
