#!/usr/bin/env node

/* eslint curly:0 */
/* eslint no-process-exit:0 */

var flags = [];
var arch = require("../../").system();
var enclose = require("../../").exec;
var x64 = (arch === "x64");
if (x64) flags.push("--x64");
var modules = process.versions.modules;
if (modules) flags.push("--version", "modules" + modules);

try {
  require.resolve("oracle");
} catch(error) {
  console.log("Failed to require('oracle')");
  console.log("Please run 'npm install' here");
  process.exit(1);
}

flags.push("./index.js");
enclose(flags);
