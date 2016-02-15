#!/usr/bin/env node

"use strict";

if (require.main === module) {

  var flags = [];
  var arch = require("../../").system();
  var enclose = require("../../").exec;
  var x64 = (arch === "x64");
  if (x64) flags.push("--x64");
  flags.push("--config", process.argv[1]);
  flags.push("--output", process.argv[1] + ".exe");
  flags.push("./octane/all.js");
  enclose(flags);

} else {

  // if you specify script as an asset,
  // it will be disclosed in final binary
  // and will run full speed (without
  // compiled code speed limitations)

  module.exports = {
    assets: [
      "octane/*.js"
    ]
  };

}
