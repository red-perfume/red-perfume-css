'use strict';

/**
 * @file    A place to play around with/try to out Red Perfume
 * @author  TheJaredWilcurt
 */

const redPerfumeCss = require('./index.js');

const results = redPerfumeCss({
  uglify: false,
  input: `
    .cow,
    .cat {
        font-size: 12px;
        padding: 8px;
    }
    .dog {
        font-size: 12px;
        background: #F00;
        padding: 8px;
    }
  `
});

console.log(results);
