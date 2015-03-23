module.exports = {

  patches: {

    // TODO temporary solution
    // fix after require('bluebird', 'option')

    "promise.js": [
      "require('bluebird')",
      "null"
    ]

  }

};
