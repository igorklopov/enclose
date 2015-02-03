"use strict";

// ESLINT NEEDS FEW PATCHES TO
// BUNDLE ALL FILES INTO THE BOX

var fs = require("fs");
var path = require("path");

var base = function(p, n) {
  return p.split(path.sep).slice(-n).join("/");
};

module.exports = {

  transform: function(record, cb) {

    if (base(record.file, 3) === "eslint/lib/load-rules.js") {

      record.body = record.body.toString("utf8").replace(
        "path.join(__dirname, \"rules\")",
        "null" // path-join-dirname is for files only
      ).replace(
        "fs.readdirSync(rulesDir)",
        "[" + fs.readdirSync(
          path.join(path.dirname(record.file), "rules")
        ).map(function(f) {
          return "path.basename(require.resolve(\"./rules/" + f + "\"))";
        }).join(",\n") + "]"
      ).replace(
        "require(path.join(rulesDir, file))",
        "require('./rules/' + file)"
      );

    } else

    if (base(record.file, 3) === "eslint/lib/cli.js") {

      record.body = record.body.toString("utf8").replace(
        "formatter = require(formatterPath);",
        "formatter = require(formatterPath + \".js\");\n" +
        fs.readdirSync(
          path.join(path.dirname(record.file), "formatters")
        ).map(function(f) {
          return "require(\"./formatters/" + f + "\");\n";
        }).join("")
      );

    }

    return cb();

  }

};
