'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const redPerfumeCss = require('../index.js');

const testHelpers = require('@@/testHelpers.js');

describe('Red Perfume', () => {
  let options;

  beforeEach(() => {
    options = {
      verbose: true,
      customLogger: jest.fn()
    };
  });

  describe('Atomize', () => {
    describe('Failures and invalid states', () => {
      test('Empty', () => {
        let consoleError = console.error;
        console.error = jest.fn();

        expect(redPerfumeCss())
          .toEqual({
            atomizedCss: '',
            classMap: {}
          });

        expect(console.error)
          .toHaveBeenCalledWith(
            testHelpers.trimIndentation(`
              _________________________
              Red-Perfume-CSS:
              Invalid CSS input.
            `, 14),
            undefined
          );

        expect(console.error)
          .toHaveBeenCalledWith(
            testHelpers.trimIndentation(`
              _________________________
              Red-Perfume-CSS:
              Error parsing CSS.
            `, 14),
            undefined
          );

        console.error = consoleError;
        consoleError = undefined;
      });
    });

    // More detailed CSS tests go in the other test files
    describe('One simple integration test', () => {
      const input = `
        .simple {
          padding: 10px;
          margin: 10px;
        }
      `;

      test('Normal', () => {
        options = {
          ...options,
          input,
          uglify: false
        };

        expect(redPerfumeCss(options))
          .toEqual({
            atomizedCss: testHelpers.trimIndentation(`
              .rp__padding__--COLON10px {
                padding: 10px;
              }
              .rp__margin__--COLON10px {
                margin: 10px;
              }
            `, 14),
            classMap: {
              '.simple': [
                '.rp__padding__--COLON10px',
                '.rp__margin__--COLON10px'
              ]
            },
            styleErrors: []
          });

        expect(options.customLogger)
          .not.toHaveBeenCalled();
      });

      test('Uglify', () => {
        options = {
          ...options,
          input,
          uglify: true
        };

        expect(redPerfumeCss(options))
          .toEqual({
            atomizedCss: testHelpers.trimIndentation(`
              .rp__0 {
                padding: 10px;
              }
              .rp__1 {
                margin: 10px;
              }
            `, 14),
            classMap: {
              '.simple': [
                '.rp__0',
                '.rp__1'
              ]
            },
            styleErrors: []
          });

        expect(options.customLogger)
          .not.toHaveBeenCalled();
      });
    });
  });
});
