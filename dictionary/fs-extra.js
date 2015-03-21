module.exports = {

  patches: {

    // TODO temporary solution
    // fix after require("graceful-fs", "option")

    "lib/index.js": [
      "require(\"graceful-fs\")",
      "require(\"fs\")"
    ]

  }

};
