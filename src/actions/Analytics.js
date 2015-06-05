"use strict";

// Anonymous statistics

var {
  Flurry
} = require("NativeModules");

module.exports = {
  launchApp() {
    Flurry.logEvent("LaunchApp");
  },

  login() {
    Flurry.logEvent("Login");
  },

  logout() {
    Flurry.logEvent("Logout");
  },

  fetchText({ domain, author, word_count }) {
    Flurry.logEventWithParameters("Fetch Text", {
      "Domain": domain || "unknown",
      "Author": author || "unknown",
      "Word count": "" + word_count || "0"
    });
  },

  error({ request, err }) {
    err = err || {};

    Flurry.logError(request, JSON.stringify(err));
  }
};
