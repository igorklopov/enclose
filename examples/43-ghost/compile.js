#!/usr/bin/env node

/* eslint no-process-exit:0 */

var path = require("path");
var enclose = require("../../").exec;
var windows = process.platform === "win32";
var wexe = windows ? ".exe" : "";
var x64 = process.arch === "x64";
var x64flag = x64 ? ["--x64"] : [];

try {
  var ghost = path.dirname(require.resolve("ghost"));
} catch(error) {
  console.log("Failed to require('ghost')");
  console.log("Please run 'npm install' here");
  process.exit(1);
}

var source = path.join(
  ghost, "..", "index.js"
);

enclose(x64flag.concat([
  "--config", "./config.js",
  "--output", "./ghost" + wexe,
  source
]));
