#!/usr/bin/env node

/* eslint curly:0 */

"use strict";

if (require.main === module) {

  var rc;

  try {
    rc = require("rc");
  } catch(error) {
    console.log("Failed to require('rc')");
    console.log("Please run 'npm install' here");
    process.exit(1);
  }

  var sailsrc = rc("sails");
  if (sailsrc.environment !== "production") throw new Error(
    "Use only for production environment"
  );

  var sails = {
    config:
      sailsrc,
    log: {
      error: console.log,
      info: console.log,
      verbose: console.log,
      warn: console.log
    },
    childProcesses: [
    ],
    emit: function() {
    }
  };

  var grunt = "sails/lib/hooks/grunt/index.js";
  var hook = require(grunt)(sails);

  hook.initialize(function(error) {
    if (error) throw error;
    // sails.childProcesses[0].kill("SIGINT");
    var enclose = require("../../").exec;
    var flags = [];
    var x64 = process.arch === "x64";
    if (x64) flags.push("--x64");
    // flags.push("--loglevel", "info");
    flags.push("--config", process.argv[1]);
    flags.push("./app.js");
    enclose(flags);
  });

} else { /************ second part is config ***/

  module.exports = {

    dirs: [
      ".tmp",
      ".tmp/**/*",
      "api",
      "api/**/*",
      "assets",
      "assets/**/*",
      "config",
      "config/**/*",
      "views",
      "views/**/*"
    ],

    scripts: [
      "api/**/*.js",
      "config/**/*.js"
    ],

    assets: [
      ".sailsrc",
      ".tmp/**/*.*",
      "api/**/*.*",
     "!api/**/*.js",
      "assets/**/*",
      "config/**/*.*",
     "!config/**/*.js",
      "views/**/*"
    ],

    patches: {

      "app.js": [

        "process.chdir(__dirname)",
        "", // no need to chdir

        "require('sails/node_modules/rc');",
        "null",

        "sails.lift(rc('sails'));",
        "var c = rc('sails');" +
        // use it here to point to packaged files
        "c.appPath = __dirname;" +
        "sails.lift(c);"

      ]

    }

  };

}
