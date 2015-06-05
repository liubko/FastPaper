"use strict";

var EC = require("../EventConstants");
var api = require("../api/");
var Q = require("q");
var Pocket = require("NativeModules").Pocket;

var Parse = require("../ParseSDK.js").Parse;
Parse.initialize(Pocket.PARSE_APP_ID, Pocket.PARSE_JS_KEY);

module.exports = {
  pageView(pageName) {
    Parse.Analytics.track("Page", {
      "Page name": pageName,
    });
  },

  launchApp() {
    Parse.Analytics.track("LaunchApp");
  },

  login() {
    Parse.Analytics.track("Login");
  },

  logout() {
    Parse.Analytics.track("Logout");
  },

  fetchText({ domain, author, word_count }) {
    Parse.Analytics.track("FetchArticle", {
      "Domain": domain || "unknown",
      "Author": author || "unknown",
      "Word count": "" + word_count || "0"
    });
  },

  error({ name, request, err }) {
    name = name || "General";
    err = err || {};

    Parse.Analytics.track(`Error-${name}`, {
      "request": request || "unknown",
      "error": JSON.stringify(err)
    });
  }
};
