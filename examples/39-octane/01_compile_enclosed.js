#!/usr/bin/env node

/* eslint curly:0 */

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

  module.exports = {
  };

}
