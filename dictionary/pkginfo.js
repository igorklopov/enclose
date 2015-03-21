module.exports = {

  patches: {

    "lib/pkginfo.js": [
      "var files = fs.readdirSync(dir);",
      "/* var files = fs.readdirSync(dir); */",
      "if (~files.indexOf('package.json')) {",
      "if (fs.existsSync(path.join(dir, 'package.json'))) {"
    ]

  }

};
