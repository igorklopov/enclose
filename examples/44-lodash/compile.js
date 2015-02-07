#!/usr/bin/env node

var enclose = require("../../").exec;
var x64 = process.arch === "x64";
var x64flag = x64 ? ["--x64"] : [];
enclose(x64flag.concat([ "./index.js" ]));
