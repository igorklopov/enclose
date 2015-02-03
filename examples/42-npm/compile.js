#!/usr/bin/env node

/* eslint no-process-exit:0 */

var path = require("path");
var enclose = require("../../").exec;
var windows = process.platform === "win32";
var wexe = windows ? ".exe" : "";

try {
  var npm = path.dirname(require.resolve("npm"));
} catch(error) {
  console.log("Failed to require('npm')");
  console.log("Please make 'npm' accessible");
  process.exit(1);
}

var source = path.join(
  npm, "..", "cli.js"
);

enclose([
  "--config", "./config.js",
  "--output", "./npm" + wexe,
  source
]);
