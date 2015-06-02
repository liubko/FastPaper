"use strict";

var EC = require("../EventConstants");
var api = require("../api/");
var Q = require("q");

var {
  AlertIOS
} = require("react-native");

module.exports = {
  fetch(isInitial) {
    /*=================================
    =            FOR DEBUG            =
    =================================*/
    // var {
    //   ARTICLES
    // } = require("../testData.js");
    // ARTICLES.since = new Date().getTime();
    // this.dispatch(EC.SERVER.ARTICLES_RECEIVE, ARTICLES);
    // return Q(ARTICLES);
    /*-----  End of FOR DEBUG  ------*/

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
      .fail(err => {
        console.log("Can't fetch articles:", err);
      });
  },

  archive(id) {
    return this.flux.actions.articles
      ._modify({
        id: id,
        action: "archive",
        event: EC.SERVER.ARCHIVE_ARTICLE
      });
  },

  delete(id) {
    return this.flux.actions.articles
      ._modify({
        id: id,
        action: "delete",
        event: EC.SERVER.DELETE_ARTICLE
      });
  },

  favorite(id) {
    this.dispatch(EC.SERVER.FAVORITE_ARTICLE, id);

    return this.flux.actions.articles
      ._modify({
        id: id,
        action: "favorite",
      });
  },

  unfavorite(id) {
    this.dispatch(EC.SERVER.UNFAVORITE_ARTICLE, id);

    return this.flux.actions.articles
      ._modify({
        id: id,
        action: "unfavorite",
      });
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
