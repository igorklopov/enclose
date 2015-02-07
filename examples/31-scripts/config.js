"use strict";

var windows = process.platform === "win32";
var wexe = windows ? ".exe" : "";

module.exports = {
  scripts: "./views/**/*"
};
