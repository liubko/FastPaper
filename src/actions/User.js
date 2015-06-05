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
      })
      .catch(err => {
        this.flux.actions.analytics.error({
          name: "Pocket-User",
          request: "Restore Session",
          err: err
        });

        return Q.reject(err);
      });
  },

  login() {
    return api.user
      .login()
      .then(data => {
        this.dispatch(EC.SERVER.LOGIN, data);

        this.flux.actions.analytics.login();
        return data;
      })
      .catch(err => {
        this.flux.actions.analytics.error({
          name: "Pocket-User",
          request: "Login",
          err: err
        });

        return Q.reject(err);
      });
  },

  logout() {
    this.flux.actions.analytics.logout();

    return api.user
      .logout()
      .then(data => {
        this.dispatch(EC.SERVER.LOGOUT);

        return data;
      })
      .catch(err => {
        this.flux.actions.analytics.error({
          name: "Pocket-User",
          request: "Logout",
          err: err
        });

        return Q.reject(err);
      });
  }
};
