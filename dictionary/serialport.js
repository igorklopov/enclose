module.exports = {

  patches: {

    "serialport.js": [
      "var PACKAGE_JSON = path.join(__dirname, 'package.json');", "\n" +
      "var __dirname_on_disk = path.relative(require.main.dirname, __dirname);\n" +
      "var PACKAGE_JSON = path.join(__dirname_on_disk, 'package.json');"
    ]

  }

};
