#!/usr/bin/env node

/* eslint curly:0 */
/* eslint no-process-exit:0 */

var flags = [];
var platform = process.platform;
var arch = require("../../").system();
var enclose = require("../../").exec;
var windows = (platform === "win32");
var exe = windows ? ".exe" : "";
var x64 = (arch === "x64");
if (x64) flags.push("--x64");

try {
  require.resolve("eslint");
} catch(error) {
  console.log("Failed to require('eslint')");
  console.log("Please run 'npm install' here");
  process.exit(1);
}

flags.push("--output", "./eslint" + exe);
flags.push("./index.js");
enclose(flags);
