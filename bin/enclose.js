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

function get_version_string(args) {
  var pos =
    (args.indexOf("-v") + 1) ||
    (args.indexOf("--version") + 1);
  if (!pos) return null;
  return args[pos];
}

function get_version(args) {
  var v = get_version_string(args);
  if (!v) v = binaries_json.default;
  var version = binaries_json[v] ||
                binaries_json["v" + v];
  return version;
}

function get_arch(args) {
  var help64 =
    (args.length === 0) &&
    (process.arch === "x64");
  if (help64) return "x64";
  var pos =
    (args.indexOf("-x") + 1) ||
    (args.indexOf("--x64") + 1);
  if (pos) return "x64";
  return "x86";
}

function get_suffix(arch) {
  return {
    win32: {
      x86: "win32",
      x64: "win64"
    },
    linux: {
      x86: "linux-x86",
      x64: "linux-x64"
    },
    darwin: {
      x86: "darwin-x86",
      x64: "darwin-x64"
    }
  }[process.platform][arch];
}

function exec(args) {

  var version = get_version(args);

  if (!version) {
    throw new Error(
      "Bad version. " +
      "See 'binaries.json'"
    );
  }

  var arch = get_arch(args);
  var suffix = get_suffix(arch);
  var team = version[suffix];

  if (!team) {
    throw new Error(
      "Bad architecture. " +
      "See 'binaries.json'"
    );
  }

  var full = path.join(
    __dirname,
    team.enclose.name
  );

  if ((args.indexOf("--color") < 0) &&
      (args.indexOf("--no-color") < 0)) {
    if (process.stdout.isTTY) {
      args.push("--color");
    }
  }

  var c = spawn(full, args);
  var ee = new EventEmitter();
  var counter = 0;

  c.on("error", function(error) {
    process.stdout.write(full);
    process.stdout.write(error.toString());
    ee.emit("error", error);
  });

  function maybe_exit() {
    if (++counter < 3) return;
    ee.emit("exit");
  }

  c.stderr.on("data", function(chunk) {
    process.stderr.write(chunk);
  });

  c.stderr.on("end", function() {
    maybe_exit();
  });

  c.stdout.on("data", function(chunk) {
    process.stdout.write(chunk);
  });

  c.stdout.on("end", function() {
    maybe_exit();
  });

  c.on("exit", function() {
    maybe_exit();
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

  var suffixes = {
    ia32: [
      get_suffix("x86")
    ],
    x64: [
      get_suffix("x86"),
      get_suffix("x64")
    ]
  }[process.arch];

  var items = [];

  children(binaries_json, function(version) {
    if (typeof version !== "object") return; // "default" string
    children(version, function(suffix, key) {
      if (suffixes.indexOf(key) < 0) return; // *****
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
