'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const redPerfume = require('../index.js');

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

        expect(redPerfume.atomize())
          .toEqual(undefined);

        expect(console.error)
          .toHaveBeenCalledWith(testHelpers.trimIndentation(`
            _________________________
            Red-Perfume:
            options.tasks Must be an array of objects. See documentation for details.
          `, 12));

        console.error = consoleError;
        consoleError = undefined;
      });
    });

    describe('Valid options', () => {
      test('Using data and afterOutput hook', () => {
        options.uglify = true;
        options.input = '.example { padding: 10px; margin: 10px; }';

        expect(redPerfume.atomize(options))
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

            expect(redPerfume.atomize(options))
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

            expect(redPerfume.atomize(options))
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
            const expectedClassMap = {
              '.pseudo': [
                '.rp__color__--COLON__--OCTOTHORPF00',
                '.rp__text-decoration__--COLONnone',
                '.rp__color__--COLON__--OCTOTHORPA00___-HOVER',
                '.rp__text-decoration__--COLONunderline___-HOVER'
              ]
            };

            options = {
              verbose: true,
              customLogger: jest.fn(),
              tasks: [
                {
                  uglify: false,
                  styles: {
                    data: pseudoCSS,
                    hooks: {
                      afterOutput: function (options, { task, inputCss, atomizedCss, classMap, styleErrors }) {
                        expect(Object.keys(task))
                          .toEqual(['uglify', 'styles', 'markup', 'scripts', 'hooks']);

                        expect(inputCss)
                          .toEqual(pseudoCSS);

                        expect(atomizedCss)
                          .toEqual(testHelpers.trimIndentation(`
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
                          `, 28));

                        expect(classMap)
                          .toEqual(expectedClassMap);

                        expect(styleErrors)
                          .toEqual([]);
                      }
                    }
                  },
                  markup: [
                    {
                      data: inputMarkup,
                      hooks: {
                        afterOutput: function (options, { task, subTask, classMap, inputHtml, atomizedHtml, markupErrors }) {
                          expect(Object.keys(task))
                            .toEqual(['uglify', 'styles', 'markup', 'scripts', 'hooks']);

                          expect(Object.keys(subTask))
                            .toEqual(['data', 'hooks']);

                          expect(classMap)
                            .toEqual(expectedClassMap);

                          expect(inputHtml)
                            .toEqual(inputMarkup);

                          expect(testHelpers.trimIndentation(atomizedHtml))
                            .toEqual(testHelpers.trimIndentation(`
                              <!DOCTYPE html><html><head></head><body>
                                <div class="simple rp__color__--COLON__--OCTOTHORPF00 rp__text-decoration__--COLONnone rp__color__--COLON__--OCTOTHORPA00___-HOVER rp__text-decoration__--COLONunderline___-HOVER"></div>
                                <div class="after">
                                  <div class="nested"></div>
                                </div>
                              </body></html>
                            `, 30));

                          expect(markupErrors)
                            .toEqual([]);
                        }
                      }
                    }
                  ],
                  scripts: {
                    hooks: {
                      afterOutput: function (options, { task, classMap, scriptErrors }) {
                        expect(Object.keys(task))
                          .toEqual(['uglify', 'styles', 'markup', 'scripts', 'hooks']);

                        expect(classMap)
                          .toEqual(expectedClassMap);

                        expect(scriptErrors)
                          .toEqual([]);
                      }
                    }
                  }
                }
              ]
            };

            redPerfume.atomize(options);

            expect(options.customLogger)
              .not.toHaveBeenCalled();
          });

          test('Uglify', () => {
            const expectedClassMap = {
              '.pseudo': [
                '.rp__0',
                '.rp__1',
                '.rp__2',
                '.rp__3'
              ]
            };

            options = {
              verbose: true,
              customLogger: jest.fn(),
              tasks: [
                {
                  uglify: true,
                  styles: {
                    data: pseudoCSS,
                    hooks: {
                      afterOutput: function (options, { task, inputCss, atomizedCss, classMap, styleErrors }) {
                        expect(Object.keys(task))
                          .toEqual(['uglify', 'styles', 'markup', 'scripts', 'hooks']);

                        expect(inputCss)
                          .toEqual(pseudoCSS);

                        expect(atomizedCss)
                          .toEqual(testHelpers.trimIndentation(`
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
                          `, 28));

                        expect(classMap)
                          .toEqual(expectedClassMap);

                        expect(styleErrors)
                          .toEqual([]);
                      }
                    }
                  },
                  markup: [
                    {
                      data: inputMarkup,
                      hooks: {
                        afterOutput: function (options, { task, subTask, classMap, inputHtml, atomizedHtml, markupErrors }) {
                          expect(Object.keys(task))
                            .toEqual(['uglify', 'styles', 'markup', 'scripts', 'hooks']);

                          expect(Object.keys(subTask))
                            .toEqual(['data', 'hooks']);

                          expect(classMap)
                            .toEqual(expectedClassMap);

                          expect(inputHtml)
                            .toEqual(inputMarkup);

                          expect(testHelpers.trimIndentation(atomizedHtml))
                            .toEqual(testHelpers.trimIndentation(`
                              <!DOCTYPE html><html><head></head><body>
                                <div class="simple rp__0 rp__1 rp__2 rp__3"></div>
                                <div class="after">
                                  <div class="nested"></div>
                                </div>
                              </body></html>
                            `, 30));

                          expect(markupErrors)
                            .toEqual([]);
                        }
                      }
                    }
                  ],
                  scripts: {
                    hooks: {
                      afterOutput: function (options, { task, classMap, scriptErrors }) {
                        expect(Object.keys(task))
                          .toEqual(['uglify', 'styles', 'markup', 'scripts', 'hooks']);

                        expect(classMap)
                          .toEqual(expectedClassMap);

                        expect(scriptErrors)
                          .toEqual([]);
                      }
                    }
                  }
                }
              ]
            };

            redPerfume.atomize(options);

            expect(options.customLogger)
              .not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
