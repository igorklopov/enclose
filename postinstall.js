#!/usr/bin/env node

/* eslint no-bitwise:0 */
/* eslint no-cond-assign:0 */
/* eslint no-use-before-define:0 */

"use strict";

var fs = require("fs");
var path = require("path");
var parse = require("url").parse;
var format = require("url").format;
var crypto = require("crypto");
var https = require("https");
var async = require("async");
var windows = process.platform === "win32";
var enclose = require("./bin/enclose.js");
var downloads = enclose.downloads();
var bucket = "https://enclosejs.s3.amazonaws.com";

process.stdout.write("Downloading precompiled binaries. Please wait ...\n");

async.mapSeries(downloads, function(download, cb) {

  var name = download.name;
  process.stdout.write("Downloading " + name + " ...");
  var fsname = path.join(__dirname, "bin", name);

  async.waterfall([
    function(next) {

      var signature = "";

      function finish(error) {
        next(error, signature);
      }

      var loc = location(".sha256");
      https.get(loc, function(res) {
        if (res.statusCode !== 200) {
          return finish(new Error([
            res.statusCode, loc
          ]));
        }
        res.on("data", function(chunk) {
          signature += chunk.toString();
        }).on("end", function() {
          finish();
        });
      }).on("error", function(error) {
        finish(error);
      });

    },
    function(signature, next) {

      var file = fs.createWriteStream(fsname);
      var hash = crypto.createHash("sha256");
      hash.setEncoding("hex");
      var read = 0;

      var thresholds = [
        10, 20, 30, 40, 50, 60, 70, 80, 90
      ].map(function(t) {
        return {
          caption: t.toString() + "%",
          value: t * download.size / 100 | 0
        };
      });

      function progress(chunk) {
        var was = read;
        read += chunk.length;
        thresholds.some(function(t) {
          if (t.value > read) {
            return true;
          }
          if (t.value >= was) {
            process.stdout.write(" " + t.caption);
          }
        });
      }

      function remove(error) {
        fs.unlink(fsname, function() {
          next(error);
        });
      }

      function end(back) {
        file.end(function() {
          hash.end(function() {
            back();
          });
        });
      }

      function finish(error) {
        end(function() {
          if (error) {
            return remove(error);
          }
          var have = hash.read();
          if (have !== signature) {
            return remove(new Error([
              name, have, signature
            ]));
          }
          process.stdout.write("\n");
          next();
        });
      }

      file.on("open", function() {
        var loc = location();
        https.get(loc, function(res) {
          if (res.statusCode !== 200) {
            return finish(new Error([
              res.statusCode, loc
            ]));
          }
          res.on("data", function(chunk) {
            file.write(chunk);
            hash.write(chunk);
            progress(chunk);
          }).on("end", function() {
            finish();
          });
        }).on("error", function(error) {
          finish(error);
        });
      });

    },
    function(next) {

      if (windows) {
        return next();
      } else {
        fs.stat(fsname, function(error, stat) {
          if (error) return next(error);
          var plusx = (stat.mode | 64 | 8).toString(8).slice(-3);
          fs.chmod(fsname, plusx, next);
        });
      }

    }
  ], cb);

  function location(append) {
    var url = bucket + "/" + name + (append || "");
    var p = parse(url), key, key_part;
    if (key = process.env.ENCLOSEJS_KEY) {
      if (key_part = key.split(".")[0]) {
        p.pathname = "/" + key_part + p.pathname;
        url = format(p);
      }
    }
    return url;
  }

}, function(error) {
  if (error) {
    process.stdout.write("\n");
    throw error;
  }
});
