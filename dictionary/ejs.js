module.exports = {

  assets: [
    "lib/ejs.js"
  ],

  patches: {

    // TODO temporary solution
    // fix after content-to-code recompilation

    "lib/ejs.js": [
      "rethrow.toString()",
      "'function rethrow' + fs.readFileSync(__filename, 'utf8').split('function rethrow')[1].split('/**')[0]"
    ]

  }

};
