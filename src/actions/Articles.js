"use strict";

var EC = require("../EventConstants");
var api = require("../api/");
var Q = require("q");

var {
  AlertIOS
} = require("react-native");

module.exports = {
  fetch(isInitial) {
    if (!isInitial && !this.flux.stores.settings.isConnected()) {
      AlertIOS.alert(
        "Error",
        "You must be connected to the internet to sync.",
        [
          {text: "OK", onPress: () => {}}
        ]
      );

      return Q.reject();
    }

    var since = this.flux.stores.articles.getSince();
    return api.pocket.fetch(since)
      .then(data => {
        this.dispatch(EC.SERVER.ARTICLES_RECEIVE, {
          list: data.list,
          since: data.since,
          isItAllArticles: !since
        });
        return data;
      })
      .catch(err => {
        this.flux.actions.analytics.error({
          name: "Pocket-Articles",
          request: "Fetch articles",
          err: (err && err.response) ? err.response.text : err
        });

        return Q.reject(err);
      });
  },

  archive(id) {
    this.flux.actions.articles
      ._modify({
        id: id,
        action: "archive",
        event: EC.SERVER.ARCHIVE_ARTICLE
      })
      .catch(err => {
        this.flux.actions.analytics.error({
          name: "Pocket-Articles",
          request: "Archive article",
          err: (err && err.response) ? err.response.text : err
        });
      })
      .done();
  },

  delete(id) {
    this.flux.actions.articles
      ._modify({
        id: id,
        action: "delete",
        event: EC.SERVER.DELETE_ARTICLE
      })
      .catch(err => {
        this.flux.actions.analytics.error({
          name: "Pocket-Articles",
          request: "Delete article",
          err: (err && err.response) ? err.response.text : err
        });
      })
      .done();
  },

  favorite(id) {
    this.dispatch(EC.SERVER.FAVORITE_ARTICLE, id);

    this.flux.actions.articles
      ._modify({
        id: id,
        action: "favorite",
      })
      .catch(err => {
        this.flux.actions.analytics.error({
          name: "Pocket-Articles",
          request: "Favourite article",
          err: (err && err.response) ? err.response.text : err
        });
      })
      .done();
  },

  unfavorite(id) {
    this.dispatch(EC.SERVER.UNFAVORITE_ARTICLE, id);

    this.flux.actions.articles
      ._modify({
        id: id,
        action: "unfavorite",
      })
      .catch(err => {
        this.flux.actions.analytics.error({
          name: "Pocket-Articles",
          request: "Unfavourite article",
          err: (err && err.response) ? err.response.text : err
        });
      })
      .done();
  },

  _modify({id, action, event}) {
    if (!this.flux.stores.settings.isConnected()) {
      if (event) {
        this.dispatch(event, id);
      }
      this.dispatch(EC.UI.DELAY_ACTION, {
        id: id,
        action: action
      });

      return Q();
    }

    return api.pocket
      .modify([{
        item_id: id,
        action: action
      }])
      .then(data => {
        if (event) {
          this.dispatch(event, id);
        }
      });
  }
};
