"use strict";

var windows = process.platform === "win32";
var wexe = windows ? ".exe" : "";

module.exports = {
  output: "./file-name-set-from-config" + wexe
};
