"use strict";

var EC = require("../EventConstants");
var api = require("../api/");
var Q = require("q");

module.exports = {
  setPage(page) {
    this.dispatch(EC.UI.SET_PAGE, page);
  }
};
