'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const validator = require('@/validator.js');

const testHelpers = require('@@/testHelpers.js');

describe('Validator', () => {
  let options;

  beforeEach(() => {
    options = {
      verbose: true,
      customLogger: jest.fn()
    };
  });

  describe('validateBoolean', () => {
    test('undefined, true', () => {
      expect(validator.validateBoolean(undefined, true))
        .toEqual(true);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('undefined, false', () => {
      expect(validator.validateBoolean(undefined, false))
        .toEqual(false);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('falsy, true', () => {
      expect(validator.validateBoolean('', true))
        .toEqual(true);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('truthy, false', () => {
      expect(validator.validateBoolean('asdf', false))
        .toEqual(false);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('true, true', () => {
      expect(validator.validateBoolean(true, true))
        .toEqual(true);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('false, false', () => {
      expect(validator.validateBoolean(false, false))
        .toEqual(false);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('true, false', () => {
      expect(validator.validateBoolean(true, false))
        .toEqual(true);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('false, true', () => {
      expect(validator.validateBoolean(false, true))
        .toEqual(false);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });

  describe('validateString', () => {
    test('Falsy', () => {
      expect(validator.validateString(options, false, 'message'))
        .toEqual(undefined);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Non-string', () => {
      options = validator.validateOptions(options);

      expect(validator.validateString(options, {}, 'message'))
        .toEqual(undefined);

      expect(options.customLogger)
        .toHaveBeenCalledWith('message', undefined);
    });

    test('String', () => {
      expect(validator.validateString(options, 'Test', 'message'))
        .toEqual('Test');

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });

  describe('validateCustomLogger', () => {
    let consoleError;

    beforeEach(() => {
      consoleError = console.error;
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = consoleError;
      consoleError = undefined;
    });

    test('Falsy', () => {
      options.customLogger = false;

      expect(validator.validateCustomLogger(options).hasOwnProperty('customLogger'))
        .toEqual(false);

      expect(console.error)
        .not.toHaveBeenCalled();
    });

    test('Non-function', () => {
      options = validator.validateOptions(options);
      options.customLogger = {};

      expect(validator.validateCustomLogger(options).hasOwnProperty('customLogger'))
        .toEqual(false);

      expect(console.error)
        .toHaveBeenCalledWith(
          testHelpers.trimIndentation(`
            _________________________
            Red-Perfume-CSS:
            Optional customLogger must be a type of function.
          `, 12),
          undefined
        );
    });

    test('Function', () => {
      expect(validator.validateCustomLogger(options).hasOwnProperty('customLogger'))
        .toEqual(true);

      expect(console.error)
        .not.toHaveBeenCalled();

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });

  describe('validateOptions', () => {
    test('No options', () => {
      let consoleError = console.error;
      console.error = jest.fn();

      expect(validator.validateOptions())
        .toEqual({
          atomizedCss: '',
          classMap: {},
          input: undefined,
          styleErrors: [],
          uglify: false,
          verbose: true
        });

      expect(console.error)
        .not.toHaveBeenCalled();

      console.error = consoleError;
      consoleError = undefined;
    });

    test('No input', () => {
      expect(validator.validateOptions(options))
        .toEqual({
          verbose: true,
          customLogger: options.customLogger,
          atomizedCss: '',
          classMap: {},
          input: undefined,
          styleErrors: [],
          uglify: false
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });
});
