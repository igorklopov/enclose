module.exports = {

  patches: {

    "graceful-fs.js": [
      "*", // replace all code with:
      "module.exports = require('fs')"
    ]

  }

};
