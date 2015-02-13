"use strict";

// NPM NEEDS FEW PATCHES TO
// BUNDLE ALL FILES INTO THE BOX

var path = require("path");

var base = function(p, n) {
  return p.split(path.sep).slice(-n).join("/");
};

module.exports = {

  dirs: function(cli) {
    var root = path.dirname(cli.input);
    return [
      path.join(root, "node_modules/npm-registry-client/lib"),
      path.join(root, "node_modules/npm-registry-client/lib/dist-tags")
    ];
  },

  scripts: function(cli) {
    var root = path.dirname(cli.input);
    return [
      path.join(root, "lib/*.js"),
      path.join(root, "node_modules/npm-registry-client/lib/*.js"),
      path.join(root, "node_modules/npm-registry-client/lib/dist-tags/*.js")
    ];
  },

  transform: function(record, cb) {

    if (base(record.file, 2) === "npm-registry-client/index.js") {
      record.body = record.body.toString("utf8").replace(
        // graceful-fs is used, called 'fs'.
        // enclosejs virtual fs should be used
        "require(\"graceful-fs\")",
        "require(\"fs\")"
      );
    } else

    if (base(record.file, 3) === "npm/lib/npm.js") {
      record.body = record.body.toString("utf8").replace(
        // the same
        "JSON.parse(fs.readFileSync(",
        "JSON.parse(require('fs').readFileSync("
      );
    }

    return cb();

  }

};
