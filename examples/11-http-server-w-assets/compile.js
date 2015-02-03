#!/usr/bin/env node

var enclose = require("../../").exec;

enclose([
  "--assets", "./assets/**/*",
  "./index.js"
]);
