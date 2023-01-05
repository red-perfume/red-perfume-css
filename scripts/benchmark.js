'use strict';

/**
 * @file    Benchmark the atomizer code in the current branch
 * @author  TheJaredWilcurt
 */

/* eslint-disable-next-line import/no-extraneous-dependencies */
const runBenchmarks = require('red-perfume-benchmarks');

const redPerfumeCss = require('../index.js');

const outcome = runBenchmarks(redPerfumeCss);

console.log(outcome);
