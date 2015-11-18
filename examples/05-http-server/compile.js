#!/usr/bin/env node

/* eslint curly:0 */

var flags = [];
var arch = require("../../").system();
var enclose = require("../../").exec;
var x64 = (arch === "x64");
if (x64) flags.push("--x64");
flags.push("./index.js");
enclose(flags);
