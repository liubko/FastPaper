"use strict";

var ArticlesStore = require("./Articles.js");
var PageStore = require("./Page.js");
var PocketQueueStore = require("./PocketQueue.js");
var TextStore = require("./Text.js");
var SettingsStore = require("./Settings.js");
var UserStore = require("./User.js");

module.exports = {
  articles: new ArticlesStore(),
  page: new PageStore(),
  pocketQueue: new PocketQueueStore(),
  text: new TextStore(),
  settings: new SettingsStore(),
  user: new UserStore()
};
