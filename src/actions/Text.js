"use strict";

var EC = require("../EventConstants");
var api = require("../api/");
var Q = require("q");

var {
  AlertIOS,
  StatusBarIOS
} = require("react-native");

module.exports = {
  fetchText(id) {
    var text = this.flux.stores.text.getTextById(id);
    if (text) {
      this.dispatch(EC.UI.SELECT_TEXT, text);
      return Q();
    }

    if (!this.flux.stores.settings.isConnected()) {
      AlertIOS.alert(
        "Error",
        "You must be connected to the internet to fetch text.",
        [
          {text: "OK", onPress: () => {}}
        ]
      );

      return Q.reject();
    }

    StatusBarIOS.setNetworkActivityIndicatorVisible(true);
    var article = this.flux.stores.articles.getArticle(id);
    return api.readability.fetchText(article.resolved_url)
      .then(data => {
        var text = data.content;
        this.dispatch(EC.SERVER.TEXT_RECEIVE, {
          id: id,
          text: text
        });
        this.dispatch(EC.UI.SELECT_TEXT, text);

        StatusBarIOS.setNetworkActivityIndicatorVisible(false);

        return text;
      })
      .catch(err => {
        StatusBarIOS.setNetworkActivityIndicatorVisible(false);

        AlertIOS.alert(
          "Error",
          "Can't fetch article text. Please try again.",
          [
            {text: "OK", onPress: () => {}}
          ]
        );

        this.flux.actions.analytics.error({
          name: "Readability",
          request: "Fetch text",
          err: (err && err.response) ? JSON.parse(err.response.text || {}) : err
        });

        return Q.reject(err);
      });
  },

  setWPM(wpm) {
    this.dispatch(EC.UI.SPRITZ_SET_WPM, wpm);
  },

  play() {
    this.dispatch(EC.UI.SPRITZ_PLAY);
  },

  pause() {
    this.dispatch(EC.UI.SPRITZ_PAUSE);
  },

  toNextSentence() {
    this.dispatch(EC.UI.SPRITZ_NEXT_SENTENCE);
  },

  toPrevSentence() {
    this.dispatch(EC.UI.SPRITZ_PREV_SENTENCE);
  },

  destroyReader() {
    this.dispatch(EC.UI.SPRITZ_DESTROY_READER);
  }
};
