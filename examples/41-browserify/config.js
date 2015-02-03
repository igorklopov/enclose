"use strict";

// BROWSERIFY NEEDS FEW PATCHES
// TO BUNDLE ALL FILES INTO THE BOX

var path = require("path");

var base = function(p, n) {
  return p.split(path.sep).slice(-n).join("/");
};

module.exports = {

  assets: function(cli) {

    return [path.join(
      path.dirname(cli.input), "*.txt"
    ), path.join(
      path.dirname(cli.input), "../node_modules/umd/template.js"
    ), path.join(
      path.dirname(cli.input), "../node_modules/umd/node_modules/uglify-js/lib/*"
    )];

  },

  transform: function(record, cb) {

    if (base(record.file, 2) === "umd/index.js") {

      record.body = record.body.toString("utf8").replace(
        "var rfile = require('rfile');",
        "var rfile = function(f) { " +
          "require('fs').readFileSync(" +
            "require('path').join(__dirname, f)" +
          "); " +
        "};"
      );

    } else

    if (base(record.file, 3) === "uglify-js/tools/node.js") {

      record.body = record.body.toString("utf8").replace(
        "return path.join(path.dirname(fs.realpathSync(__filename)), file);",
        "return path.join(path.dirname(__filename), file);"
      );

    }

    return cb();

  }

};
