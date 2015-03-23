module.exports = {

  patches: {

    // TODO temporary solution
    // fix after require('canvas', 'option')

    "lib/jsdom/level2/html.js": [
      "var canvas = new (require('canvas'))(0,0);",
      "var canvas = null;"
    ]

  }

};
