#!/usr/bin/env node

var enclose = require("../../").exec;
var x64 = process.arch === "x64";

enclose([

  // takes other options from config.js
  // transforms can be passed only in config

  "--config", "./config.js",
  x64 ? "--x64" : "",
  "./index.js"
]);
