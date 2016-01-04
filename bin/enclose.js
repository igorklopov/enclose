#!/usr/bin/env node

/* eslint camelcase:0 */
/* eslint curly:0 */

"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("assert");
var spawn = require("child_process").spawn;
var spawnSync = require("child_process").spawnSync;
var execSync = require("child_process").execSync;
var binaries_json_name = "binaries.json";
var binaries_json;

try {
  binaries_json = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        binaries_json_name
      )
    ), "utf8"
  );
} catch(_) {
  assert(_);
}

function get_suffix(arch) {
  return {
    win32: {
      x86: "win32",
      x64: "win64"
    },
    linux: {
      x86: "linux-x86",
      x64: "linux-x64",
      armv6: "linux-armv6",
      armv7: "linux-armv7"
    },
    darwin: {
      x86: "darwin-x86",
      x64: "darwin-x64"
    }
  }[process.platform][arch];
}

function get_version(args) {
  var pos =
    (args.indexOf("-v") + 1) ||
    (args.indexOf("--version") + 1);
  if (!pos) return "default";
  return args[pos];
}

function get_version_obj(version, suffix) {
  var bjs = binaries_json[suffix];
  if (!bjs) return null;
  var v = version;
  if (!bjs[v]) v = "v" + v;
  var bjsv = bjs[v];
  var link = (typeof bjsv === "string");
  if (link) return get_version_obj(bjsv, suffix);
  if (bjsv) bjsv.version = v;
  return bjsv;
}

function get_arm_arch() {
  var cpu = fs.readFileSync("/proc/cpuinfo", "utf8");
  var found = cpu.match(/CPU architecture: (.?)\n/);
  if (!found) return "armv6";
  if (!found[1]) return "armv6";
  return "armv" + found[1];
}

function get_arch() {
  var arch = process.arch;
  if (arch === "ia32") return "x86";
  if (arch === "x86") return "x86";
  if (arch === "x64") return "x64";
  if (arch === "arm") return get_arm_arch();
  return "";
}

function get_arch_from_args(args) {
  var arch = get_arch();
  var x64 = (args.indexOf("-x") + 1) ||
            (args.indexOf("--x64") + 1);
  if (arch === "x86" && x64) return "x64";
  if (arch === "x86") return "x86";
  if (arch === "x64" && x64) return "x64";
  if (arch === "x64") return "x86";
  return arch;
}

function get_system() {

  var arch = get_arch();

  if (arch === "x86" &&
      process.platform === "win32" &&
      process.env.PROCESSOR_ARCHITEW6432) {
    arch = "x64";
  }

  if (arch === "x86" &&
      process.platform === "linux" &&
      execSync("uname -m").toString() === "x86_64\n") {
    arch = "x64";
  }

  if (process.platform === "darwin") {
    arch = "x64";
  }

  return arch;

}

var exec = function(args, cb) {

  if (!cb) {
    cb = function(error) {
      if (error) throw error;
    };
  }

  if (!binaries_json) {
    return cb(new Error(
      "File '" + binaries_json_name +
      "' not found. Reinstall EncloseJS"
    ));
  }

  var arch;

  if (args.length) {
    arch = get_arch_from_args(args);
  } else {
    arch = get_system();
  }

  if (!arch) {
    return cb(new Error(
      "Unknown architecture"
    ));
  }

  var suffix = get_suffix(arch);
  var version = get_version(args);
  var version_obj = get_version_obj(version, suffix);

  if (!version_obj) {
    return cb(new Error(
      "Bad version '" + version + "' or " +
      "architecture '" + arch + "'. " +
      "See file '" + binaries_json_name + "'"
    ));
  }

  var full = path.join(
    __dirname,
    version_obj.enclose.name
  );

  if ((args.indexOf("--color") < 0) &&
      (args.indexOf("--no-color") < 0)) {
    if (process.stdout.isTTY) {
      args.push("--color");
    }
  }

  var c = spawn(full, args);
  var counter = 0, status = 0;

  c.on("error", function(error) {
    assert(counter < 3);
    if (fs.existsSync(full)) {
      cb(new Error(
       "Your OS does not support " +
        version_obj.version + "-" + suffix + ". " +
        "Run with or without --x64 flag."
      ));
    } else {
      if (error.code === "ENOENT") {
        cb(new Error(
         "Compiler not found for " +
          version_obj.version + "-" + suffix
        ));
      } else {
        cb(error);
      }
    }
  });

  function maybe_exit() {
    if (++counter < 3) return;
    cb(null, status);
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

  c.on("exit", function(status_) {
    status = status_;
    maybe_exit();
  });

};

exec.sync = function(args) {

  if (!binaries_json) {
    throw new Error(
      "File '" + binaries_json_name +
      "' not found. Reinstall EncloseJS"
    );
  }

  var arch;

  if (args.length) {
    arch = get_arch_from_args(args);
  } else {
    arch = get_system();
  }

  if (!arch) {
    throw new Error(
      "Unknown architecture"
    );
  }

  var suffix = get_suffix(arch);
  var version = get_version(args);
  var version_obj = get_version_obj(version, suffix);

  if (!version_obj) {
    throw new Error(
      "Bad version '" + version + "' or " +
      "architecture '" + arch + "'. " +
      "See file '" + binaries_json_name + "'"
    );
  }

  var full = path.join(
    __dirname,
    version_obj.enclose.name
  );

  if ((args.indexOf("--color") < 0) &&
      (args.indexOf("--no-color") < 0)) {
    if (process.stdout.isTTY) {
      args.push("--color");
    }
  }

  var c = spawnSync(full, args, { stdio: "inherit" });
  var error = c.error;

  if (error) {
    if (fs.existsSync(full)) {
      throw new Error(
       "Your OS does not support " +
        version_obj.version + "-" + suffix + ". " +
        "Run with or without --x64 flag."
      );
    } else {
      if (error.code === "ENOENT") {
        throw new Error(
         "Compiler not found for " +
          version_obj.version + "-" + suffix
        );
      } else {
        throw error;
      }
    }
  }

  return c.status;

};

function children(o, cb) {
  Object.keys(o).some(
    function(k) {
      cb(o[k], k);
    }
  );
}

function downloads() {

  var system = get_system();

  var suffixes = {
    x86: [
      get_suffix("x86")
    ],
    x64: [
      get_suffix("x86"),
      get_suffix("x64")
    ],
    armv6: [
      get_suffix("armv6")
    ],
    armv7: [
      get_suffix("armv6"),
      get_suffix("armv7")
    ]
  }[system];

  if (!suffixes) {
    throw new Error(
      "Unknown system " + system
    );
  }

  var items = [];

  children(binaries_json, function(suffix, key) {
    if (suffixes.indexOf(key) < 0) return; // *****
    children(suffix, function(version) {
      if (typeof version !== "object") return; // "default" string
      children(version, function(binary) {
        items.push(binary);
      });
    });
  });

  return items;

}

if (module.parent) {
  module.exports = {
    exec: exec,
    downloads: downloads,
    arch: get_arch,
    system: get_system
  };
} else {
  exec(
    process.argv.slice(2)
  );
}
