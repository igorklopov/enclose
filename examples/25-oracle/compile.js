#!/usr/bin/env node

/* eslint no-process-exit:0 */

"use strict";

var flags = [];
var enclose = require("../../").exec;

try {
  require.resolve("oracle");
} catch (error) {
  console.log("Failed to require('oracle')");
  console.log("Please run 'npm install' here");
  process.exit(1);
}

flags.push("./index.js");
enclose(flags);
