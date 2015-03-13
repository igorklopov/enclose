"use strict";

// SERIALPORT NEEDS FEW PATCHES
// TO FIND NATIVE ADDON ON DISK

var path = require("path");

var base = function(p, n) {
  return p.split(path.sep).slice(-n).join("/");
};

module.exports = {

  transform: function(record, cb) {

    if (base(record.file, 2) === "serialport/serialport.js") {
      record.body = record.body.toString("utf8").replace(
        "var PACKAGE_JSON = path.join(__dirname, 'package.json');",
        "var __dirname_on_disk = path.relative(require.main.dirname, __dirname);\n" +
        "var PACKAGE_JSON = path.join(__dirname_on_disk, 'package.json');"
      );
    }

    return cb();

  }

};
