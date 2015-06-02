"use strict";

var EC = require("../EventConstants");
var api = require("../api/");
var Q = require("q");

module.exports = {
  setColorTheme(colorTheme) {
    this.dispatch(EC.UI.SET_COLOR_THEME, colorTheme);
  },
};
