'use strict';
/* eslint-disable max-lines-per-function */

/**
 * @file    Testing file
 * @author  TheJaredWilcurt
 */

const constants = require('@/constants.js');
const classEncoding = require('@/css-class-encoding.js');
const validator = require('@/validator.js');

describe('Class encoding', () => {
  let options;
  const error = constants.IMPRESSED_MESSAGE;

  beforeEach(() => {
    options = validator.validateOptions({
      verbose: true,
      customLogger: jest.fn()
    });
  });

  describe('Bad inputs', () => {
    test('Empty', () => {
      expect(classEncoding(options))
        .toEqual('.rp__undefined__--COLONundefined');

      expect(options.customLogger)
        .toHaveBeenCalledWith(error, undefined);
    });

    test('Array', () => {
      expect(classEncoding(options, []))
        .toEqual('.rp__undefined__--COLONundefined');

      expect(options.customLogger)
        .toHaveBeenCalledWith(error, undefined);
    });

    test('Number', () => {
      expect(classEncoding(options, 4))
        .toEqual('.rp__undefined__--COLONundefined');

      expect(options.customLogger)
        .toHaveBeenCalledWith(error, undefined);
    });

    test('Empty object', () => {
      expect(classEncoding(options, {}))
        .toEqual('.rp__undefined__--COLONundefined');

      expect(options.customLogger)
        .toHaveBeenCalledWith(error, undefined);
    });

    test('Declaration without property', () => {
      expect(classEncoding(options, { value: '1px' }))
        .toEqual('.rp__undefined__--COLON1px');

      expect(options.customLogger)
        .toHaveBeenCalledWith(error, undefined);
    });

    test('Declaration without value', () => {
      expect(classEncoding(options, { property: 'width' }))
        .toEqual('.rp__width__--COLONundefined');

      expect(options.customLogger)
        .toHaveBeenCalledWith(error, undefined);
    });
  });

  describe('Encode', () => {
    test('Encode hex color', () => {
      const declaration = {
        property: 'background',
        value: '#F00'
      };

      expect(classEncoding(options, declaration))
        .toEqual('.rp__background__--COLON__--OCTOTHORPF00');

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Encode all special characters', () => {
      const allSpecialCharacters = '&*@\\^¢>})]:,©¤°÷$."=!/`½µ#<{([¶%|+±£¼?®;\'¾~¥ ';
      let allSpecialEncodings = [
        '__--AMPERSAND',
        '__--ASTERISK',
        '__--ATSIGN',
        '__--BACKSLASH',
        '__--CARET',
        '__--CENT',
        '__--CLOSEANGLEBRACKET',
        '__--CLOSECURLYBRACE',
        '__--CLOSEPAREN',
        '__--CLOSESQUAREBRACKET',
        '__--COLON',
        '__--COMMA',
        '__--COPYRIGHT',
        '__--CURRENCY',
        '__--DEGREE',
        '__--DIVIDE',
        '__--DOLARSIGN',
        '__--DOT',
        '__--DOUBLEQUOTE',
        '__--EQUAL',
        '__--EXCLAMATION',
        '__--FORWARDSLASH',
        '__--GRAVE',
        '__--HALF',
        '__--MU',
        '__--OCTOTHORP',
        '__--OPENANGLEBRACKET',
        '__--OPENCURLYBRACE',
        '__--OPENPAREN',
        '__--OPENSQUAREBRACKET',
        '__--PARAGRAPH',
        '__--PERCENT',
        '__--PIPE',
        '__--PLUS',
        '__--PLUSMINUS',
        '__--POUNDSTERLING',
        '__--QUARTER',
        '__--QUESTIONMARK',
        '__--REGISTERED',
        '__--SEMICOLON',
        '__--SINGLEQUOTE',
        '__--THREEQUARTERS',
        '__--TILDE',
        '__--YENYUAN',
        '_____-'
      ];

      const declaration = {
        property: 'content',
        value: allSpecialCharacters
      };

      expect(Object.keys(classEncoding.propertyValueEncodingMap).join(''))
        .toEqual(allSpecialCharacters);

      expect(classEncoding(options, declaration))
        .toEqual('.rp__content__--COLON' + allSpecialEncodings.join(''));

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Encode unicode characters', () => {
      const declaration = {
        property: 'content',
        value: '🌕🌗🌑'
      };

      expect(classEncoding(options, declaration))
        .toEqual('.rp__content__--COLON__--U55356__--U57109__--U55356__--U57111__--U55356__--U57105');

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });
});
