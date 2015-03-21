module.exports = {

  patches: {

    // TODO temporary solution
    // fix after require('emitter', 'option')

    "index.js": [
      "require('emitter')",
      "null"
    ]

  }

};
