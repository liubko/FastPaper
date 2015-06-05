"use strict";

var Q = require("q");
var {
  Pocket
} = require("NativeModules");
var {
  DeviceEventEmitter
} = require('react-native');

class ArticleAPI {
  restoreSession() {
    var d = Q.defer();

    Pocket.getLoggedInUser(function (error, res) {
      // error - error happend in xcode function
      if (error) {
        d.reject(error || res.error)
      } else {
        res.isLoggedIn = res.isLoggedIn === "1";
        d.resolve(res);
      }
    });

    return d.promise;
  }

  login() {
    var d = Q.defer();

    Pocket.login(function(error, res) {
      if (error) {
        d.reject(error || res.error)
      } else {
        res.isLoggedIn = res.isLoggedIn === "1";
        d.resolve(res);
      }
    });

    return d.promise;
  }

  logout() {
    Pocket.logout();
    return Q();
  }
}

module.exports = ArticleAPI;
