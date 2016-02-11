#!/usr/bin/env node

/* eslint no-process-exit:0 */

var flags = [];
var arch = require("../../").system();
var enclose = require("../../").exec;
var x64 = (arch === "x64");
if (x64) flags.push("--x64");

try {
  require.resolve("node-thrust");
} catch(error) {
  console.log("Failed to require('node-thrust')");
  console.log("Please run 'npm install' here");
  process.exit(1);
}

flags.push("./index.js");
enclose(flags);
