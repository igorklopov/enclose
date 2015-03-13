#!/usr/bin/env node

"use strict";

var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("/dev/ttyS0", {
  baudrate: 57600
});

serialPort.open(function(error) {
  if (error) { throw error; }
  console.log("open");
  serialPort.on("data", function(data) {
    console.log("data received: ", data);
  });
  serialPort.write("ls\n", function(error2, results) {
    if (error2) { throw error2; }
    console.log("results ", results);
  });
});
