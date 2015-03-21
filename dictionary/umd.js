module.exports = {

  assets: [
    "template.js"
  ],

  patches: {

    "index.js": [
      "var rfile = require('rfile');",
      "var rfile = function(f) { " +
        "require('fs').readFileSync(" +
          "require('path').join(__dirname, f)" +
        "); " +
      "};"
    ]

  }

};
