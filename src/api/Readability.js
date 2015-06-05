"use strict";

var Q = require("q");
var sa = require('superagent');
var {
  Config
} = require("NativeModules");

class ReadabilityAPI {
  fetchText(url) {
    var d = Q.defer();
    var host = "https://www.readability.com/api/content/v1/parser";

    sa.get(`${host}?token=${Config.READABILITY_TOKEN}&url=${url}`)
      .end(function(error, res) {
        if (error) {
          d.reject(error);
        } else {
          d.resolve(JSON.parse(res.text));
        }
      });

    return d.promise;
  }
}

module.exports = ReadabilityAPI;
