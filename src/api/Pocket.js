"use strict";

var Q = require("q");
var sa = require('superagent');
var Pocket = require("NativeModules").Pocket;

class PocketAPI {
  fetch(since) {
    var d = Q.defer();

    Pocket.fetch(since, function (error, res) {
      // error - callback error from xcode
      // res.error - pocket api error
      if (error || res.error) {
        d.reject(error || res.error)
      } else {
        d.resolve({
          list: res.list,
          since: res.since
        });
      }
    });

    return d.promise;
  }

  // expected params:
  //
  //   actions: [{
  //     item_id: id
  //     action: action
  //   }]
  modify(actions) {
    var d = Q.defer();

    Pocket.modify(actions, function (error, res) {
      // res.error - pocket api error

      // {"status":1,"action_results":[true]}
      if (error || res.error || res.status !== 1) {
        d.reject(error || res.error)
      } else {
        d.resolve(res);
      }
    });

    return d.promise;
  }
}

module.exports = PocketAPI;
