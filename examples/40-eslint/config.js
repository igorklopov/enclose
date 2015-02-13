"use strict";

// ESLINT NEEDS FEW PATCHES TO
// BUNDLE ALL FILES INTO THE BOX

var path = require("path");

module.exports = {

  dirs: function(cli) {
    var root = path.dirname(cli.input);
    return [
      path.join(root, "../lib/rules"),
      path.join(root, "../lib/formatters")
    ];
  },

  scripts: function(cli) {
    var root = path.dirname(cli.input);
    return [
      path.join(root, "../lib/rules/*.js"),
      path.join(root, "../lib/formatters/*.js")
    ];
  }

};
