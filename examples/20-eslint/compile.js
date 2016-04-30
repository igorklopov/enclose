#!/usr/bin/env node

/* eslint no-process-exit:0 */

"use strict";

var flags = [];
var platform = process.platform;
var enclose = require("../../").exec;
var windows = (platform === "win32");
var exe = windows ? ".exe" : "";

try {
  require.resolve("eslint");
} catch (error) {
  console.log("Failed to require('eslint')");
  console.log("Please run 'npm install' here");
  process.exit(1);
}

flags.push("--output", "./eslint" + exe);
flags.push("./index.js");
enclose(flags);
