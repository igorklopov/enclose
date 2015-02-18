#!/usr/bin/env node

/* eslint camelcase:0 */
/* eslint no-process-exit:0 */

"use strict";

require("node-thrust")(function(error, api) {
  var w = api.window({
    root_url: "http://enclosejs.com"
  });
  w.on("closed", function() {
    process.exit();
  });
  w.show();
}, {
  exec_path: "./node_modules/node-thrust/vendor/thrust/thrust_shell"
});
