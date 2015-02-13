#!/usr/bin/env node

/* eslint curly:0 */
/* eslint no-process-exit:0 */

var path = require("path");
var enclose = require("../../").exec;
var flags = [];
var windows = process.platform === "win32";
var wexe = windows ? ".exe" : "";
var x64 = process.arch === "x64";
if (x64) flags.push("--x64");

try {
  var browserify = path.dirname(require.resolve("browserify"));
} catch(error) {
  console.log("Failed to require('browserify')");
  console.log("Please run 'npm install' here");
  process.exit(1);
}

flags.push("--config", "./config.js");
flags.push("--output", "./browserify" + wexe);
flags.push(path.join(browserify, "bin/cmd.js"));
enclose(flags);
