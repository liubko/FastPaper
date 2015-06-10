"use strict";

// Anonymous crash reports with Mixpanel

var {
  Mixpanel
} = require("NativeModules");

module.exports = {
  launchApp() {
    Mixpanel.trackEvent("Launch Application");
  },

  error({ request, err }) {
    request = request || "Unknown";
    err = err || {};

    Mixpanel.trackError(request, JSON.stringify(err));
  }
};
