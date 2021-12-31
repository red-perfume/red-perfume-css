'use strict';

/**
 * @file    Process, atomize, uglify a CSS string
 * @author  TheJaredWilcurt
 */

const cssParser = require('./css-parser.js');
const cssStringify = require('./css-stringify.js');
const cssUglifier = require('./css-uglifier.js');
const encodeClassName = require('./css-class-encoding.js');
const helpers = require('./helpers.js');

/**
 * Remove property/value pairs that are duplicates.
 * `display: none; display: none;` becomes `display:none;`
 * `display: block; display: none;` is unchanged because they
 * are not identical.
 *
 * @param {object} classMap  The class map object used by the HTML/JSON
 */
function removeIdenticalProperties (classMap) {
  // Remove identical properties
  Object.keys(classMap).forEach(function (selector) {
    // The double reverse is so the last duplicate is kept in place, and the previous are removed
    // ['.rp__margin__--COLON2px', '.rp__margin__--COLON2px', '.rp__border__--COLON0px', '.rp__margin__--COLON2px'] =>
    // ['.rp__border__--COLON0px', '.rp__margin__--COLON2px']
    classMap[selector] = Array.from(new Set(classMap[selector].reverse())).reverse();
  });
}

/**
 * Updates the map of selectors to their atomized classes.
 *
 * @param  {object} classMap          The class map object used by the HTML/JSON
 * @param  {Array}  selectors         Parsed CSS selectors
 * @param  {string} encodedClassName  Encoded class name
 * @return {object}                   Returns the classMap object
 */
function updateClassMap (classMap, selectors, encodedClassName) {
  /*
    An array of selectors for
    .cat:hover, .bat:hover { margin: 2px; }
    looks like:
    [
      [
        {
          "type": "attribute",
          "name": "class",
          "action": "element",
          "value": "cat",
          "namespace": null,
          "ignoreCase": false,
          "original": ".cat:hover"
        },
        {
          "type": "pseudo",
          "name": "hover",
          "data": null
        }
      ],
      [
        {
          "type": "attribute",
          "name": "class",
          "action": "element",
          "value": "bat",
          "namespace": null,
          "ignoreCase": false,
          "original": ".bat:hover"
        },
        {
          "type": "pseudo",
          "name": "hover",
          "data": null
        }
      ]
    ]
  */
  selectors.forEach(function (selector) {
    let originalSelectorName = selector[0].original;
    // '.cow:hover' => '.cow'
    originalSelectorName = originalSelectorName.split(':')[0];

    classMap[originalSelectorName] = classMap[originalSelectorName] || [];
    classMap[originalSelectorName].push(encodedClassName.split(':')[0]);
  });
  return classMap;
}

/**
 * Ensure that non-classes are not atomized,
 * but still included in the output.
 *
 * @param  {object} rule  Parsed CSS Rule
 * @return {object}       New CSS rule as AST, newRule
 */
function handleNonClasses (rule) {
  let originalSelectorName = rule.selectors[0][0].original;
  const newRule = {
    type: 'rule',
    selectors: [[{ original: originalSelectorName }]],
    declarations: rule.declarations
  };
  return newRule;
}

/**
 * Creates the encoded class name and pairs it with the original selector.
 * Handles psuedo selectors too, like :hover. Mutates the classMap and
 * newRules.
 *
 * @param {object} options      User's options
 * @param {object} rule         A CSS Rule as AST including selectors
 * @param {object} declaration  A single CSS proptery/value pair as AST
 * @param {object} classMap     Map of original CSS selectors to encoded class names
 * @param {object} newRules     The atomized CSS as AST
 * @param {Array}  styleErrors  Array of style related errors
 */
function encodeDeclarationAsClassname (options, rule, declaration, classMap, newRules, styleErrors) {
  // Array of comma separated selectors on a specific rule
  const ruleSelectors = rule.selectors;
  const type = ruleSelectors[0][0].type;
  const isClass = ruleSelectors[0].find(function (selector) {
    return selector.name === 'class';
  });
  let encodedClassName = '';
  let encodedName = '';
  if (!isClass) {
    encodedName = ruleSelectors[0][0].original;
  } else {
    /* An encoded class name look like:
      .rp__padding__--COLON10px
    */
    encodedClassName = encodeClassName(options, declaration, styleErrors);
    if (type === 'tag') {
      encodedName = name + encodedClassName;
    }
  }

  if (ruleSelectors[0][1] && ruleSelectors[0][1].type && ruleSelectors[0][1].type === 'pseudo') {
    let pseudoName = ruleSelectors[0][1].name;
    // .rp__display__--COLONblock___-HOVER:hover
    let pseudoClassName = encodedClassName + '___-' + pseudoName.toUpperCase() + ':' + pseudoName;
    encodedClassName = pseudoClassName;
  }

  // Each selector is made up of parts like .cow.dog:hover:after would be an array of 4 objects for each part
  ruleSelectors.forEach(function (selectorParts) {
    let encodedPseudoNames = [];
    let pseudoNames = [];
    selectorParts.forEach(function (selectorPart) {
      if (selectorPart.type && selectorPart.type === 'pseudo') {
        let pseudoName = selectorPart.name;
        encodedPseudoNames.push('___-' + pseudoName.toUpperCase());
        pseudoNames.push(':' + pseudoName);
      }
    });
    // .rp__display__--COLONblock___-HOVER___-AFTER:hover:after
    encodedClassName = encodedClassName + encodedPseudoNames.join('') + pseudoNames.join('');

    classMap = updateClassMap(classMap, ruleSelectors, encodedClassName);

    newRules[encodedClassName] = {
      type: 'rule',
      selectors: [[encodedName || encodedClassName]],
      declarations: [declaration]
    };
  });
}

/**
 * Takes atomized class names and uglifies them.
 *
 * @param {object} classMap  Map of original CSS selectors to encoded class names
 * @param {object} newRules  The atomized CSS as AST
 */
function uglifyClassNames (classMap, newRules) {
  let index = 0;
  Object.keys(newRules).forEach(function (key) {
    if (key.startsWith('.')) {
      let pseudo = '';
      if (key.includes(':')) {
        let split = key.split(':');
        split.shift(0);
        pseudo = ':' + split.join(':');
      }
      let result = cssUglifier(index);

      index = result.index;

      let uglifiedName = result.name + pseudo;
      newRules[uglifiedName] = newRules[key];
      newRules[uglifiedName].selectors[0][0] = uglifiedName;
      delete newRules[key];

      Object.keys(classMap).forEach(function (mapKey) {
        key = key.split(':')[0];
        let indexOfKey = classMap[mapKey].indexOf(key);
        if (indexOfKey !== -1) {
          classMap[mapKey][indexOfKey] = result.name;
        }
      });
    }
  });
}

/**
 * Loop over all rules and atomize as needed.
 *
 * @param {object} options      User's options
 * @param {Array}  rules        CSS Rules as AST including selectors
 * @param {object} classMap     Map of original CSS selectors to encoded class names
 * @param {object} newRules     The atomized CSS as AST
 * @param {Array}  styleErrors  Array of style related errors
 */
function processRules (options, rules, classMap, newRules, styleErrors) {
  /* A rule looks like:
     {
       type: 'rule',
       selectors: [
         [
           {
             type: 'attribute',
             name: 'class',
             action: 'element',
             value: 'cow',
             ignoreCase: false,
             namespace: null,
             original: '.cow'
           }
         ]
       ],
       declarations: [
         {
           type: 'declaration',
           property: 'background',
           value: '#F00'
         },
         {
           type: 'declaration',
           property: 'border',
           value: 'none'
         }
       ]
     }
  */
  rules.forEach(function (rule) {
    // TODO: I think this needs improved
    let type = rule.selectors[0][0].type;
    let name = rule.selectors[0][0].name;
    if (type === 'tag' || (type === 'attribute' && name !== 'class')) {
      handleNonClasses(rule, newRules);
    } else {
      /* A declaration looks like:
        {
          type: 'declaration',
          property: 'padding',
          value: '10px'
        }
      */
      rule.declarations.forEach(function (declaration) {
        encodeDeclarationAsClassname(options, rule, declaration, classMap, newRules, styleErrors);
      });
    }
  });
}

/**
 * Takes in a string of CSS, parses it to AST, manipulates the AST to produce
 * atomized CSS, optionally uglifies the atomized class names, stringifies the
 * AST back to a string. Returns String and Atomization Map.
 *
 * @param  {object} options  User's options
 * @return {object}          The classMap of original to atomized names and the atomized CSS string
 */
const atomize = function (options) {
  let input = options.input;
  let uglify = options.uglify;
  let styleErrors = options.styleErrors;

  const message = 'Error parsing CSS.';
  let parsed;
  try {
    parsed = cssParser(options, input, styleErrors);
  } catch (err) {
    styleErrors.push(err);
    helpers.throwError(options, message, err);
  }
  if (!parsed) {
    styleErrors.push(message);
    helpers.throwError(options, message, input);
    return {
      classMap: {},
      atomizedCss: ''
    };
  }

  let classMap = {};
  const newRules = {};

  processRules(options, parsed.stylesheet.rules, classMap, newRules, styleErrors);
  removeIdenticalProperties(classMap);

  if (uglify) {
    uglifyClassNames(classMap, newRules);
  }

  const output = {
    type: 'stylesheet',
    stylesheet: {
      rules: [],
      parsingErrors: []
    }
  };
  Object.keys(newRules).forEach(function (key) {
    output.stylesheet.rules.push(newRules[key]);
  });

  return {
    // classMap: { '.cow': [ '.rp__0', '.rp__1' ], '.moo': [ '.rp__2', '.rp__1' ] }
    classMap,
    /*
      '.rp__0 { background: #F00; }' +
      '.rp__1 { border: none; }' +
      '.rp__2 { padding: 10px; }'
    */
    atomizedCss: cssStringify(output),
    styleErrors: options.styleErrors
  };
};

atomize.removeIdenticalProperties = removeIdenticalProperties;
module.exports = atomize;
