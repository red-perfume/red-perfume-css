'use strict';

/**
 * @file    A place to play around with/try to out Red Perfume
 * @author  TheJaredWilcurt
 */

const redPerfumeCss = require('./index.js');

const input = `
  h1.example {
    display: block;
    text-align: center;
  }
`;

const results = redPerfumeCss({
  uglify: false,
  input
});

console.log(input);
console.log(results);
