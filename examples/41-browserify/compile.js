#!/usr/bin/env node

/* eslint no-process-exit:0 */

var path = require("path");
var enclose = require("../../").exec;
var windows = process.platform === "win32";
var wexe = windows ? ".exe" : "";

try {
  var browserify = path.dirname(require.resolve("browserify"));
} catch(error) {
  console.log("Failed to require('browserify')");
  console.log("Please run 'npm install' here");
  process.exit(1);
}

var source = path.join(
  browserify, "bin", "cmd.js"
);

enclose([
  "--config", "./config.js",
  "--output", "./browserify" + wexe,
  source
]);
