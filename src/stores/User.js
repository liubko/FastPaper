"use strict";

var Fluxxor = require("fluxxor");
var _ = require("lodash");
var EC = require("../EventConstants");
var S = require('string');

var PageStore = Fluxxor.createStore({
  init() {
    this._username = undefined;
    this._isLoggedIn = false;
  },

  initialize() {
    this.init();

    this.bindActions(
      EC.SERVER.LOGIN, this.handleLogin,
      EC.SERVER.LOGOUT, this.handleLogout
    );
  },

  /*==========  getters  ==========*/
  getUsername() {
    return this._username;
  },

  isLoggedIn() {
    return this._isLoggedIn;
  },

  /*==========  handlers  ==========*/
  handleLogin({username, isLoggedIn}) {
    this._username = username;
    this._isLoggedIn = isLoggedIn;
    this.emit("change");
  },

  handleLogout() {
    this.init();
    this.emit("change");
  }
});

module.exports = PageStore;
