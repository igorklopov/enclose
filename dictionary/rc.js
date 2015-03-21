module.exports = {

  patches: {

    "lib/utils.js": [
      "return find(process.cwd(), rel)",
      "return find(require('path').dirname(require.main.filename), rel)"
    ]

  }

};
