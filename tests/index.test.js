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

    describe('Valid options', () => {
      test('Using data and afterOutput hook', () => {
        options.uglify = true;
        options.input = '.example { padding: 10px; margin: 10px; }';

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
              '.example': ['.rp__0', '.rp__1']
            },
            styleErrors: []
          });

        expect(options.customLogger)
          .not.toHaveBeenCalled();
      });

      describe('Every type of CSS', () => {
        describe('Simple', () => {
          const simpleCSS = `
            .simple {
              padding: 10px;
              margin: 10px;
            }
          `;

          test('Normal', () => {
            options.uglify = false;
            options.input = simpleCSS;

            expect(redPerfumeCss(options))
              .toEqual({
                atomizedCss: testHelpers.trimIndentation(`
                  .rp__padding__--COLON10px {
                    padding: 10px;
                  }
                  .rp__margin__--COLON10px {
                    margin: 10px;
                  }
                `, 18),
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
            options.uglify = true;
            options.input = simpleCSS;

            expect(redPerfumeCss(options))
              .toEqual({
                atomizedCss: testHelpers.trimIndentation(`
                  .rp__0 {
                    padding: 10px;
                  }
                  .rp__1 {
                    margin: 10px;
                  }
                `, 18),
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

        describe('Pseudo', () => {
          const pseudoCSS = `
            .pseudo {
              color: #F00;
              text-decoration: none;
            }
            .pseudo:hover {
              color: #A00;
              text-decoration: underline;
            }
          `;

          test('Normal', () => {
            options.uglify = false;
            options.input = pseudoCSS;

            expect(redPerfumeCss(options))
              .toEqual({
                atomizedCss: testHelpers.trimIndentation(`
                  .rp__color__--COLON__--OCTOTHORPF00 {
                    color: #F00;
                  }
                  .rp__text-decoration__--COLONnone {
                    text-decoration: none;
                  }
                  .rp__color__--COLON__--OCTOTHORPA00___-HOVER:hover {
                    color: #A00;
                  }
                  .rp__text-decoration__--COLONunderline___-HOVER:hover {
                    text-decoration: underline;
                  }
                `, 18),
                classMap: {
                  '.pseudo': [
                    '.rp__color__--COLON__--OCTOTHORPF00',
                    '.rp__text-decoration__--COLONnone',
                    '.rp__color__--COLON__--OCTOTHORPA00___-HOVER',
                    '.rp__text-decoration__--COLONunderline___-HOVER'
                  ]
                },
                styleErrors: []
              });

            expect(options.customLogger)
              .not.toHaveBeenCalled();
          });

          test('Uglify', () => {
            options.uglify = true;
            options.input = pseudoCSS;

            expect(redPerfumeCss(options))
              .toEqual({
                atomizedCss: testHelpers.trimIndentation(`
                  .rp__0 {
                    color: #F00;
                  }
                  .rp__1 {
                    text-decoration: none;
                  }
                  .rp__2:hover {
                    color: #A00;
                  }
                  .rp__3:hover {
                    text-decoration: underline;
                  }
                `, 18),
                classMap: {
                  '.pseudo': [
                    '.rp__0',
                    '.rp__1',
                    '.rp__2',
                    '.rp__3'
                  ]
                },
                styleErrors: []
              });

            expect(options.customLogger)
              .not.toHaveBeenCalled();
          });
        });

        describe('Qualifying', () => {
          const qualifyingCSS = `
            h1.qualifying {
              border: 1px solid #000;
              padding: 10px;
              line-height: 1.4;
            }
          `;

          test('Normal', () => {
            options.uglify = false;
            options.input = qualifyingCSS;

            expect(redPerfumeCss(options))
              .toEqual({
                atomizedCss: testHelpers.trimIndentation(`
                  h1.rp__border__--COLON1px____--solid____--__--OCTOTHORP000 {
                    border: 1px solid #000;
                  }
                  h1.rp__padding__--COLON10px {
                    padding: 10px;
                  }
                  h1.rp__line-height__--COLON1__--DOT4 {
                    line-height: 1.4;
                  }
                `, 18),
                classMap: {
                  'h1.qualifying': [
                    '.rp__border__--COLON1px____--solid____--__--OCTOTHORP000',
                    '.rp__padding__--COLON10px',
                    '.rp__line-height__--COLON1__--DOT4'
                  ]
                },
                styleErrors: []
              });

            expect(options.customLogger)
              .not.toHaveBeenCalled();
          });

          test('Uglify', () => {
            options.uglify = true;
            options.input = qualifyingCSS;

            expect(redPerfumeCss(options))
              .toEqual({
                atomizedCss: testHelpers.trimIndentation(`
                  h1.rp__0 {
                    border: 1px solid #000;
                  }
                  h1.rp__1 {
                    padding: 10px;
                  }
                  h1.rp__2 {
                    line-height: 1.4;
                  }
                `, 18),
                classMap: {
                  'h1.qualifying': [
                    '.rp__0',
                    '.rp__1',
                    '.rp__2'
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
  });
});
