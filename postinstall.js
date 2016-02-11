#!/usr/bin/env node

/* eslint no-bitwise:0 */
/* eslint no-cond-assign:0 */

"use strict";

var fs = require("fs");
var path = require("path");
var parse = require("url").parse;
var format = require("url").format;
var http = require("http");
var https = require("https");
var httpx = function(p) { return p.protocol === "https:" ? https : http; };
var async = require("async");
var windows = process.platform === "win32";
var enclose = require("./bin/enclose.js");
var downloads = enclose.downloads();
var bucket = "https://enclosejs.s3.amazonaws.com";

process.stdout.write("Downloading precompiled binaries. Please wait ...\n");

async.mapSeries(downloads, function(download, cb) {

  process.stdout.write("Downloading " + download.name + " ...");

  var name = path.join(__dirname, "bin", download.name);

  async.waterfall([
    function(next) {

      var file = fs.createWriteStream(name);
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
        fs.unlink(name, function() {
          next(error);
        });
      }

      function end(back) {
        file.end(function() {
          back();
        });
      }

      function failure(error) {
        end(function() {
          remove(new Error(
            error.message + ", " + download.name
          ));
        });
      }

      function success() {
        end(function() {
          process.stdout.write("\n");
          next();
        });
      }

      file.on("open", function() {
        var loc = bucket + "/" + download.name;
        var p = parse(loc), key, key_part;
        if (key = process.env.ENCLOSEJS_KEY) {
          if (key_part = key.split(".")[0]) {
            p.pathname = "/" + key_part + p.pathname;
            loc = format(p);
          }
        }
        httpx(p).get(loc, function(res) {
          if (res.statusCode !== 200) {
            // res.pipe(process.stdout);
            return failure(new Error(
              "Status code is " + res.statusCode
            ));
          }
          res.on("data", function(chunk) {
            file.write(chunk);
            progress(chunk);
          }).on("end", function() {
            success();
          });
        }).on("error", function(error) {
          return failure(error);
        });
      });

    },
    function(next) {

      if (windows) {
        return next();
      } else {
        fs.stat(name, function(error, stat) {
          if (error) return next(error);
          var plusx = (stat.mode | 64 | 8).toString(8).slice(-3);
          fs.chmod(name, plusx, next);
        });
      }

    }
  ], cb);

}, function(error) {
  if (error) {
    process.stdout.write("\n");
    throw error;
  }
});
