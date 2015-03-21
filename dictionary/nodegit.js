module.exports = {

  scripts: [
    "lib/*.js"
  ],

  patches: {

    // TODO temporary solution
    // fix after require("...", "option")

    "lib/nodegit.js": [

      "require(\"../build/Debug/nodegit\");",
      "null",

      // TODO fix ASAP add code to error
      "unhandledException.code != \"MODULE_NOT_FOUND\"",
      "false"

    ]

  }

};
