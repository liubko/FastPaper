"use strict";

var Fluxxor = require("fluxxor");
var _ = require("lodash");
var EC = require("../EventConstants");
var S = require('string');

var PageStore = Fluxxor.createStore({
  init() {
    this._page = "LOGIN_PAGE";
  },

  initialize() {
    this.init();

    this.bindActions(
      EC.UI.SET_PAGE, this.handleSetPage,
      EC.SERVER.LOGOUT, this.handleLogout
    );
  },

  /*==========  getters  ==========*/
  getPage() {
    return JSON.parse(JSON.stringify(this._page));
  },

  /*==========  handlers  ==========*/
  handleSetPage(page) {
    this._page = page;
    this.emit("change");
  },

  handleLogout() {
    this.init();
    this.emit("change");
  }
});

module.exports = PageStore;
