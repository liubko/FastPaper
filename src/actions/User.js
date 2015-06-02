"use strict";

var EC = require("../EventConstants");
var api = require("../api/");
var Q = require("q");

module.exports = {
  /*==========  User  ==========*/
  restoreSession() {
    /*=================================
    =            For Debug            =
    =================================*/
    // var data = {"username":"Test User","isLoggedIn":true};
    // this.dispatch(EC.SERVER.LOGIN, data);
    // return Q(data);
    /*-----  End of For Debug  ------*/
    this.flux.actions.analytics.launchApp();

    return api.user
      .restoreSession()
      .then(data => {
        this.dispatch(EC.SERVER.LOGIN, data);

        return data;
      });
  },

  login() {
    return api.user
      .login()
      .then(data => {
        this.dispatch(EC.SERVER.LOGIN, data);

        this.flux.actions.analytics.login();
        return data;
      });
  },

  logout() {
    this.flux.actions.analytics.logout();

    return api.user
      .logout()
      .then(data => {
        this.dispatch(EC.SERVER.LOGOUT);

        return data;
      });
  }
};
