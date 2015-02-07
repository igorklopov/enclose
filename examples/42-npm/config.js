"use strict";

// NPM NEEDS FEW PATCHES TO
// BUNDLE ALL FILES INTO THE BOX

var fs = require("fs");
var path = require("path");

var base = function(p, n) {
  return p.split(path.sep).slice(-n).join("/");
};

module.exports = {

  scripts: function(cli) {

    return [path.join(
      path.dirname(cli.input), "lib/*.js"
    ), path.join(
      path.dirname(cli.input), "node_modules/npm-registry-client/lib/*.js"
    ), path.join(
      path.dirname(cli.input), "node_modules/npm-registry-client/lib/dist-tags/*.js"
    )];

  },

  transform: function(record, cb) {

    if (base(record.file, 2) === "config/defaults.js") {

      // TODO bug in 0.11.14
      // remove after upgrade to 0.11.15+
      record.body = record.body.toString("utf8").replace(
        "\"local-address\" : getLocalAddresses()",
        "\"local-address\" : undefined"
      );

    } else

    if (base(record.file, 2) === "npm-registry-client/index.js") {

      record.body = record.body.toString("utf8").replace(
        // TODO readdir emulator
        "fs.readdirSync(join(__dirname, \"lib\"))",
        "var root = [" + fs.readdirSync(
          path.join(path.dirname(record.file), "lib")
        ).map(function(f) {
          return "'" + f + "'";
        }).join(", ") + "]\n  root"
      ).replace(
        "var stat = fs.statSync(entry)",
        "var stat = { isDirectory: function() { " +
          "return require('path').extname(entry) === ''; " +
        "} };"
      ).replace(
        "fs.readdirSync(entry)",
        "var sub = { 'dist-tags': [" + fs.readdirSync(
          path.join(path.dirname(record.file), "lib", "dist-tags")
        ).map(function(f) {
          return "'" + f + "'";
        }).join(", ") + "] }[f];\n      sub"
      );

      // fs.writeFileSync("_npm-registry-client-index.js", record.body);

    } else

    if (base(record.file, 3) === "npm/lib/npm.js") {

      record.body = record.body.toString("utf8").replace(
        // graceful-fs is used, called 'fs'.
        // enclosejs virtual fs should be used
        "JSON.parse(fs.readFileSync(",
        "require('smalloc'); " +
        "JSON.parse(require('fs').readFileSync("
      );

    }

    return cb();

  }

};
