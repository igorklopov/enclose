#!/usr/bin/env node

var enclose = require("../../").exec;

enclose([

  // takes other options from config.js
  // transforms can be passed only in config

  "--config", "./config.js",
  "./index.js"
]);
