#!/usr/bin/env node

/* eslint no-process-exit:0 */

var path = require("path");
var enclose = require("../../").exec;
var windows = process.platform === "win32";
var wexe = windows ? ".exe" : "";
var x64 = process.arch === "x64";

try {
  var npm = path.dirname(require.resolve("npm"));
} catch(error) {
  console.log("Failed to require('npm')");
  console.log("Please run 'npm install' here");
  process.exit(1);
}

var source = path.join(
  npm, "..", "cli.js"
);

enclose([
  "--config", "./config.js",
  "--output", "./npm" + wexe,
  x64 ? "--x64" : "",
  source
]);
