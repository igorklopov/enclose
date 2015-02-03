#!/usr/bin/env node

/* eslint camelcase:0 */
/* eslint curly:0 */

"use strict";

var fs = require("fs");
var path = require("path");
var spawn = require("child_process").spawn;
var EventEmitter = require("events").EventEmitter;

var binaries_json = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "binaries.json"
    )
  ), "utf8"
);

function getVersionString(args) {
  var pos =
    (args.indexOf("-v") + 1) ||
    (args.indexOf("--version") + 1);
  if (!pos) return null;
  return args[pos];
}

function getVersion(args) {
  var v = getVersionString(args);
  if (!v) v = binaries_json.default;
  var version = binaries_json[v] ||
                binaries_json["v" + v];
  return version;
}

function getArch(args) {
  var pos =
    (args.indexOf("-x") + 1) ||
    (args.indexOf("--x64") + 1);
  if (pos) return "x64";
  return "x86";
}

function getSuffix(arch) {
  return {
    win32: {
      ia32: "win32",
      x86: "win32",
      x64: "win64"
    },
    linux: {
      ia32: "linux-x86",
      x86: "linux-x86",
      x64: "linux-x64"
    }
  }[process.platform][arch];
}

function exec(args) {

  var version = getVersion(args);

  if (!version) {
    throw new Error(
      "Bad version. " +
      "See 'binaries.json'"
    );
  }

  var arch = getArch(args);
  var suffix = getSuffix(arch);
  var team = version[suffix];

  if (!team) {
    throw new Error(
      "Bad architecture. " +
      "See 'binaries.json'"
    );
  }

  var ee = new EventEmitter();

  var c = spawn(
    path.join(
      __dirname,
      team.enclose.name
    ), args
  );

  c.stdout.on("data", function(chunk) {
    process.stdout.write(chunk);
    ee.emit("data", chunk);
  });

  c.stderr.on("data", function(chunk) {
    process.stderr.write(chunk);
  });

  c.stdout.on("end", function() {
    ee.emit("end");
  });

  return ee;

}

function children(o, cb) {
  Object.keys(o).some(
    function(k) {
      cb(o[k], k);
    }
  );
}

function downloads() {

  var suffixes = [
    getSuffix("x86"), getSuffix("x64")
  ];

  var items = [];

  children(binaries_json, function(version) {
    if (typeof version !== "object") return; // "default" string
    children(version, function(suffix, key) {
      if (suffixes.indexOf(key) < 0) return;
      children(suffix, function(binary) {
        items.push(binary);
      });
    });
  });

  return items;

}

if (module.parent) {
  module.exports = {
    exec: exec,
    downloads: downloads
  };
} else {
  exec(
    process.argv.slice(2)
  );
}
