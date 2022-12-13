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
 * @typedef  {object}   OUTPUT
 * @property {CLASSMAP} classMap     Example: { '.cow': ['.rp__0', '.rp__1'], '.moo': ['.rp__2', '.rp__1'] }
 * @property {string}   atomizedCss  A string of atomized CSS styles
 * @property {string[]} styleErrors  Array of strings of errors that occurred, or empty array if no errors occurred
 */

/**
 * @type {CLASSMAP}
 */
let CLASSMAP;

/**
 * @type {OPTIONS}
 */
let OPTIONS;

/**
 * @type {OUTPUT}
 */
let OUTPUT;


module.exports = {
  CLASSMAP,
  OPTIONS,
  OUTPUT
};
