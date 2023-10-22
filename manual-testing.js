'use strict';

/**
 * @file    A place to play around with/try to out Red Perfume
 * @author  TheJaredWilcurt
 */

const redPerfumeCss = require('./index.js');

const input = `
.cow #thing#test p .moo.type:hover:focus :hover {
    margin: 4px;
}.cow #thing#test p :hover p.moo.type:hover:focus {
    margin: 4px;
}
.dog .woof {
    margin: 4px;
}
.vehicle .car .horn {
    margin: 4px;
}
`;

const results = redPerfumeCss({
  uglify: true,
  input
});

debugger;
console.log(input);
console.log(results);
