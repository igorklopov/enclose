"use strict";

// GHOST NEEDS FEW PATCHES TO
// BUNDLE ALL FILES INTO THE BOX

var path = require("path");

var base = function(p, n) {
  return p.split(path.sep).slice(-n).join("/");
};

module.exports = {

  scripts: function(cli) {

    return [path.join(
      path.dirname(cli.input),
      "node_modules/express/node_modules/accepts/node_modules/negotiator/lib/*.js"
    )];

  },

  transform: function(record, cb) {

    if (base(record.file, 5) === "ghost/core/server/config/index.js") {

      record.body = record.body.toString("utf8").replace(
        "pg = require('pg');", ""
      ).replace(
        "pg = require('pg.js');", ""
      );

    } else

    if (base(record.file, 2) === "ghost/config.example.js") {

      record.body = record.body.toString("utf8").replace(
        "path.join(__dirname, '/content/data/ghost.db')",
        "path.join(process.cwd(), '/content/data/ghost.db')"
      ).replace(
        "path.join(__dirname, '/content/data/ghost-dev.db')",
        "path.join(process.cwd(), '/content/data/ghost-dev.db')"
      ).replace(
        "path.join(__dirname, '/content/data/ghost-test.db')",
        "path.join(process.cwd(), '/content/data/ghost-test.db')"
      ).replace(
        "path.join(__dirname, '/content/')",
        "path.join(process.cwd(), '/content/')"
      );

    } else

    if (base(record.file, 5) === "ghost/node_modules/fs-extra/lib/index.js") {

      record.body = record.body.toString("utf8").replace(
        "require(\"graceful-fs\")",
        "require(\"fs\")"
      );

    } else

    if (base(record.file, 5) === "ghost/core/server/utils/startup-check.js") {

      record.body = record.body.toString("utf8").replace(
        "appRoot = path.resolve(__dirname, '../../../')",
        "appRoot = process.cwd()"
      ).replace(
        "packages: function checkPackages() {",
        "packages: function checkPackages() { return;"
      );

    }

    return cb();

  }

};
