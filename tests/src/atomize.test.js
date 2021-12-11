'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const validator = require('@/validator.js');
const atomize = require('@/atomize.js');

const testHelpers = require('@@/testHelpers.js');

describe('Atomize', () => {
  let options;
  let consoleError;
  const errorResponse = {
    classMap: {},
    atomizedCss: ''
  };

  beforeEach(() => {
    consoleError = console.error;
    console.error = jest.fn();
    options = validator.validateOptions({
      verbose: true,
      customLogger: jest.fn()
    });
  });

  afterEach(() => {
    console.error = consoleError;
    consoleError = undefined;
  });

  describe('removeIdenticalProperties', () => {
    test('Removes dupes', () => {
      const classMap = {
        '.duplicates': [
          '.rp__display__--COLONnone',
          '.rp__display__--COLONblock',
          '.rp__display__--COLONnone',
          '.rp__display__--COLONinline-block',
          '.rp__display__--COLONnone',
          '.rp__display__--COLONflex'
        ]
      };

      atomize.removeIdenticalProperties(classMap);

      expect(classMap)
        .toEqual({
          '.duplicates': [
            '.rp__display__--COLONblock',
            '.rp__display__--COLONinline-block',
            '.rp__display__--COLONnone',
            '.rp__display__--COLONflex'
          ]
        });
    });
  });

  describe('Bad inputs', () => {
    test('Empty object', () => {
      options = validator.validateOptions({});

      expect(atomize(options))
        .toEqual(errorResponse);

      expect(console.error)
        .toHaveBeenCalledWith(
          testHelpers.trimIndentation(`_________________________
            Red-Perfume-CSS:
            Invalid CSS input.`, 12),
          undefined
        );

      expect(console.error)
        .toHaveBeenCalledWith(
          testHelpers.trimIndentation(`_________________________
            Red-Perfume-CSS:
            Error parsing CSS`, 12),
          undefined
        );
    });

    test('Just options', () => {
      expect(atomize(options))
        .toEqual(errorResponse);

      expect(options.customLogger)
        .toHaveBeenCalledWith('Invalid CSS input.', undefined);

      expect(options.customLogger)
        .toHaveBeenCalledWith('Error parsing CSS', undefined);
    });
  });

  describe('Process CSS', () => {
    test('One rule', () => {
      options = validator.validateOptions({
        ...options,
        input: '.test { background: #F00; }',
        uglify: false
      });

      expect(atomize(options))
        .toEqual({
          atomizedCss: testHelpers.trimIndentation(`
            .rp__background__--COLON__--OCTOTHORPF00 {
              background: #F00;
            }
          `, 12),
          classMap: {
            '.test': [
              '.rp__background__--COLON__--OCTOTHORPF00'
            ]
          },
          styleErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('One rule (uglified)', () => {
      options = validator.validateOptions({
        ...options,
        input: '.test { background: #F00; }',
        uglify: true
      })

      expect(atomize(options))
        .toEqual({
          atomizedCss: testHelpers.trimIndentation(`
            .rp__0 {
              background: #F00;
            }
          `, 12),
          classMap: {
            '.test': [
              '.rp__0'
            ]
          },
          styleErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    const nonClasses = `
      h1 {
        background: #F00;
        border: 1px solid #00F;
      }
      [attr] {
        text-transform: small-caps;
        overflow: hidden;
      }
      [attr="123"] {
        position: absolute;
        border-radius: 2px;
      }
      #specificity-overkill {
        color: #FF0;
        z-index: 2;
      }
    `;

    test('Handle non-classes', () => {
      options = validator.validateOptions({
        ...options,
        input: nonClasses,
        uglify: false
      });

      expect(atomize(options))
        .toEqual({
          atomizedCss: testHelpers.trimIndentation(`
            h1 {
              background: #F00;
              border: 1px solid #00F;
            }
            [attr] {
              text-transform: small-caps;
              overflow: hidden;
            }
            [attr="123"] {
              position: absolute;
              border-radius: 2px;
            }
            #specificity-overkill {
              color: #FF0;
              z-index: 2;
            }
          `, 12),
          classMap: {},
          styleErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Handle non-classes (uglified)', () => {
      options = validator.validateOptions({
        ...options,
        input: nonClasses,
        uglify: true
      });

      expect(atomize(options))
        .toEqual({
          atomizedCss: testHelpers.trimIndentation(`
            h1 {
              background: #F00;
              border: 1px solid #00F;
            }
            [attr] {
              text-transform: small-caps;
              overflow: hidden;
            }
            [attr="123"] {
              position: absolute;
              border-radius: 2px;
            }
            #specificity-overkill {
              color: #FF0;
              z-index: 2;
            }
          `, 12),
          classMap: {},
          styleErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    const psuedoClasses = `
      .example {
        display: inline-block;
        text-align: right;
      }
      .example:hover {
        display: block;
        text-align: center
      }
      .example:active {
        color: #F00;
      }
      .example:visited {
        color: #00F;
      }
      .example:hover:after {
        content: '';
      }
      h1:hover {
        color: #F00;
      }
      .cow {
        background: #F00;
        color: #00F;
      }
      .cow:hover {
        background: #0F0;
      }
    `;

    test('Handle pseudo-classes', () => {
      options = validator.validateOptions({
        ...options,
        input: psuedoClasses,
        uglify: false
      })

      expect(atomize(options))
        .toEqual({
          atomizedCss: testHelpers.trimIndentation(`
            .rp__display__--COLONinline-block {
              display: inline-block;
            }
            .rp__text-align__--COLONright {
              text-align: right;
            }
            .rp__display__--COLONblock___-HOVER:hover {
              display: block;
            }
            .rp__text-align__--COLONcenter___-HOVER:hover {
              text-align: center;
            }
            .rp__color__--COLON__--OCTOTHORPF00___-ACTIVE:active {
              color: #F00;
            }
            .rp__color__--COLON__--OCTOTHORP00F___-VISITED:visited {
              color: #00F;
            }
            .rp__content__--COLON__--SINGLEQUOTE__--SINGLEQUOTE___-HOVER___-AFTER:hover:after {
              content: '';
            }
            h1:hover {
              color: #F00;
            }
            .rp__background__--COLON__--OCTOTHORPF00 {
              background: #F00;
            }
            .rp__color__--COLON__--OCTOTHORP00F {
              color: #00F;
            }
            .rp__background__--COLON__--OCTOTHORP0F0___-HOVER:hover {
              background: #0F0;
            }
          `, 12),
          classMap: {
            ".cow": [
              ".rp__background__--COLON__--OCTOTHORPF00",
              ".rp__color__--COLON__--OCTOTHORP00F",
              ".rp__background__--COLON__--OCTOTHORP0F0___-HOVER",
            ],
            ".example": [
              ".rp__display__--COLONinline-block",
              ".rp__text-align__--COLONright",
              ".rp__display__--COLONblock___-HOVER",
              ".rp__text-align__--COLONcenter___-HOVER",
              ".rp__color__--COLON__--OCTOTHORPF00___-ACTIVE",
              ".rp__color__--COLON__--OCTOTHORP00F___-VISITED",
              ".rp__content__--COLON__--SINGLEQUOTE__--SINGLEQUOTE___-HOVER___-AFTER",
            ],
          },
          styleErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Handle pseudo-classes (uglified)', () => {
      options = validator.validateOptions({
        ...options,
        input: psuedoClasses,
        uglify: true
      });

      expect(atomize(options))
        .toEqual({
          atomizedCss: testHelpers.trimIndentation(`
            h1:hover {
              color: #F00;
            }
            .rp__0 {
              display: inline-block;
            }
            .rp__1 {
              text-align: right;
            }
            .rp__2:hover {
              display: block;
            }
            .rp__3:hover {
              text-align: center;
            }
            .rp__4:active {
              color: #F00;
            }
            .rp__5:visited {
              color: #00F;
            }
            .rp__6:hover:after {
              content: '';
            }
            .rp__7 {
              background: #F00;
            }
            .rp__8 {
              color: #00F;
            }
            .rp__9:hover {
              background: #0F0;
            }
          `, 10),
          classMap: {},
          styleErrors: []
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });
});
