#!/usr/bin/env node

/* eslint curly:0 */

var enclose = require("../../").exec;
var flags = [];
var x64 = process.arch === "x64";
if (x64) flags.push("--x64");

// enclosejs unites options from command
// line and from config.js. transforms can
// be passed only from config.js

flags.push("--config", "./config.js");
flags.push("./index.js");
enclose(flags);
