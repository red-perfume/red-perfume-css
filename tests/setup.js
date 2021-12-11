'use strict';

/**
 * @file    Jest setup
 * @author  TheJaredWilcurt
 */

// const testHelpers = require('@@/testHelpers.js');

global.beforeEach(() => {
});

global.afterEach(() => {
  jest.resetModules();
  // thing = jest.fn(); gets called, then .toHaveBeenCalledWith() will see all calls, but this clears the log after each test
  jest.clearAllMocks();
});

// Jest's setTimeout defaults to 5 seconds.
// Bump the timeout to 60 seconds.
jest.setTimeout(60 * 1000);
