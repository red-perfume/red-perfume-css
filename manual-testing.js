'use strict';

/**
 * @file    A place to play around with/try to out Red Perfume
 * @author  TheJaredWilcurt
 */

const redPerfumeCss = require('./index.js');

const input = `
.moo .bark {
    margin: 4px;
    display: block;
}
.dog .woof {
    margin: 4px;
    color: #555555;
}
.vehicle .car .horn {
    margin: 4px;
}
.vehicle {
    margin: 4px;
}
.test.test2 {
  margin: 2px;
}
.test, .test2 {
  margin: 2px;
}
`;

const results = redPerfumeCss({
  uglify: false,
  input
});

debugger;
console.log(input);
console.log(results);
