#!/usr/bin/env node

"use strict";

var non_literal_in_require = "./views/profile.js";
var profile = require(non_literal_in_require);
console.log(profile);
