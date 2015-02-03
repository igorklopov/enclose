#!/usr/bin/env node

/* eslint curly:0 */

"use strict";

var fs = require("fs");
var path = require("path");
var http = require("http");
var async = require("async");
var crypto = require("crypto");
var windows = process.platform === "win32";
var enclose = require("./bin/enclose.js");
var downloads = enclose.downloads();

process.stdout.write("Downloading precompiled binaries. Please wait ...\n");

async.mapSeries(downloads, function(download, cb) {

  if (!download.location) {
    return cb(new Error("No location URL"));
  }

  process.stdout.write("Downloading " + download.name + " ...");

  var name = path.join(__dirname, download.name);

  async.waterfall([
    function(next) {

      var file = fs.createWriteStream(name);
      var hash = crypto.createHash("sha1");
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
        fs.unlink(name, function() {
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

      function failure(error) {
        end(function() {
          remove(new Error(
            error.message + ", " + download.name
          ));
        });
      }

      function success() {
        end(function() {
          if (hash.read() !== download.shasum) {
            return remove(new Error(
              "Shasum wrong, " + download.name
            ));
          }
          process.stdout.write("\n");
          next();
        });
      }

      file.on("open", function() {
        http.get(download.location, function(res) {
          if (res.statusCode !== 200) {
            return failure(new Error(
              "Status code is " + res.statusCode
            ));
          }
          res.on("data", function(chunk) {
            file.write(chunk);
            hash.write(chunk);
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
        next();
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
  if (error) throw error;
});
