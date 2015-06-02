"use strict";

var Fluxxor = require("fluxxor");
var _ = require("lodash");
var EC = require("../EventConstants");

var {
  AsyncStorage,
  NetInfo
} = require("react-native");

var THEMES = {
  LIGHT: "LIGHT",
  MONOKAI: "MONOKAI",
  OCEANIC: "OCEANIC"
};

var COLORS_BY_THEME = {
  LIGHT: {
    background: "#fff",
    pivot: "#ea5f70",
    line: "#222",
    contextText: "#929292",
    text: "#000",
  },
  MONOKAI: {
    background: "#272822",
    pivot: "#FF0069",
    line: "#75715E",
    contextText: "#75715E",
    text: "#F8F8F2",
  },
  OCEANIC: {
    background: "#424242",
    pivot: "#009DDD",
    line: "#D2D2D2",
    contextText: "#6C6C6C",
    text: "#D1D1D1",
  }
};

var SettingsStore = Fluxxor.createStore({
  init() {
    AsyncStorage.getItem("COLOR_THEME")
      .then((value) => {
        if (value !== null){
          if (COLORS_BY_THEME[value]) {
            this._colorTheme = value;
            this.emit("change");
          }
        }
      });

    NetInfo.isConnected.fetch()
      .done(this.handleInternetConnectivityChange);
  },

  initialize() {
    this._isConnected = true;
    this._colorTheme = "LIGHT";
    this.init();

    this.bindActions(
      EC.UI.SET_COLOR_THEME, this.handleChangeColorTheme
    );

    NetInfo.isConnected.addEventListener("change", this.handleInternetConnectivityChange);
  },

  /*==========  getters  ==========*/
  getColorThemeName() {
    return this._colorTheme;
  },

  getAllThemes() {
    return JSON.parse(JSON.stringify(COLORS_BY_THEME));
  },

  getThemeColors() {
    return COLORS_BY_THEME[this._colorTheme];
  },

  isConnected() {
    return this._isConnected;
  },

  /*==========  handlers  ==========*/
  handleChangeColorTheme(colorTheme) {
    this._colorTheme = colorTheme;

    AsyncStorage.setItem("COLOR_THEME", colorTheme)
      .then(() => console.log("Saved selection to disk: " + colorTheme))
      .catch((error) => console.log("AsyncStorage error: " + error.message))
      .done();

    this.emit("change");
  },

  handleInternetConnectivityChange(isConnected) {
    this._isConnected = isConnected;
    this.emit("change");
  }
});

module.exports = SettingsStore;
