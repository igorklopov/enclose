#!/usr/bin/env node

/* eslint no-process-exit:0 */

var path = require("path");
var enclose = require("../../").exec;
var windows = process.platform === "win32";
var wexe = windows ? ".exe" : "";

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

enclose([
  "--config", "./config.js",
  "--output", "./ghost" + wexe,
  source
]);
