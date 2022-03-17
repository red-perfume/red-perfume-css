'use strict';

/**
 * @file    ESLint setup
 * @author  TheJaredWilcurt
 */

const path = require('path');

module.exports = {
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'tjw-base',
    'tjw-import',
    'tjw-jest',
    'tjw-jsdoc'
  ],
  rules: {
    'max-lines-per-function': [
      'warn',
      {
        max: 50,
        skipBlankLines: true,
        skipComments: true
      }
    ],
    'jsdoc/check-examples': 'off',
    'jsdoc/require-example': 'off'
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              '@': path.resolve('src'),
              '@@': path.resolve('tests')
            }
          }
        }
      }
    }
  }
};
