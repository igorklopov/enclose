#!/usr/bin/env node

"use strict";

var oracle = require("oracle");

var connectData = {
  hostname: "localhost",
  port: 1521,
  database: "xe", // System ID (SID)
  user: "oracle",
  password: "oracle"
};

oracle.connect(connectData, function(error, connection) {
  if (error) { throw error; }
  connection.execute("SELECT systimestamp FROM dual", [], function(error2, results) {
    if (error2) { throw error2; }
    console.log(results);
    connection.close(); // call only when query is finished executing
  });
});
