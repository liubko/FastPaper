"use strict";

var EC = require("../EventConstants");
var api = require("../api/");
var Q = require("q");

module.exports = {
  sync() {
    var queue = this.flux.stores.pocketQueue.getQueue();
    var username = this.flux.stores.user.getUsername();
    if (queue.length <= 0 || !username) {
      return;
    }

    api.article
      .modify(queue)
      .then(res => {
        this.dispatch(EC.SERVER.REMOVE_DELAYED_ACTION, res.action_results);
      })
      .catch(err => {
        this.flux.actions.analytics.error({
          name: "Pocket-Articles",
          request: "Sync queue",
          err: (err && err.response) ? JSON.parse(err.response.text || {}) : err
        });

        return Q.reject(err);
      })
      .done();
  }
};
