#!/usr/bin/env node

var enclose = require("../../").exec;
var x64 = process.arch === "x64";

enclose([
  "--assets", "./assets/**/*",
  x64 ? "--x64" : "",
  "./index.js"
]);
