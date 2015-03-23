module.exports = {

  patches: {

    // TODO temporary solution
    // fix after require('...', 'option')

    "lib/BufferUtil.js": [
      "*",
      "module.exports = require('./BufferUtil.fallback');"
    ],

    "lib/Validation.js": [
      "*",
      "module.exports = require('./Validation.fallback');"
    ]

  }

};
