"use strict";

var Fluxxor = require("fluxxor");
var _ = require("lodash");
var EC = require("../EventConstants");
var S = require("string");

var {
  AsyncStorage
} = require("react-native");

var ArticlesStore = Fluxxor.createStore({
  init() {
    this._articles = {};
    this._since = undefined;
  },

  initialize() {
    this.init();

    this.bindActions(
      EC.SERVER.ARTICLES_RECEIVE, this.handleReceiveArticles,

      EC.SERVER.ARCHIVE_ARTICLE, this.handleArchive,
      EC.SERVER.DELETE_ARTICLE, this.handleDelete,
      EC.SERVER.FAVORITE_ARTICLE, this.handleFavorite,
      EC.SERVER.UNFAVORITE_ARTICLE, this.handleUnfavorite,

      EC.SERVER.LOGIN, this.handleLogin,
      EC.SERVER.LOGOUT, this.handleLogout
    );
  },

  /*==========  getters  ==========*/
  getArticles() {
    return this._formatArticles(this._articles);
  },

  getSince() {
    return this._since;
  },

  getArticle(id) {
    return this._articles && this._articles[id]
      ? JSON.parse(JSON.stringify(this._articles[id]))
      : undefined
  },

  /*==========  handlers  ==========*/
  handleReceiveArticles({list, since, isItAllArticles}) {
    if (isItAllArticles) {
      this._articles = list;
    } else {
      Object.keys(list).forEach(id => {
        if (list[id].status === "0") { // new
          this._articles[id] = list[id];
        } else { // 1 - archived, 2 - deleted
          delete this._articles[id];
        }
      });
    }

    this._since = since;
    this._saveListForOfflineMode();
    this._saveSinceValueForOfflineMode();
    this.emit("change");
  },

  handleArchive(id) {
    this._articles = _.omit(this._articles, id);
    this._saveListForOfflineMode();
    this.emit("change");
  },

  handleDelete(id) {
    this._articles = _.omit(this._articles, id);
    this._saveListForOfflineMode();
    this.emit("change");
  },

  handleFavorite(id) {
    this._articles[id].favorite = "1";
    this._saveListForOfflineMode();
    this.emit("change");
  },

  handleUnfavorite(id) {
    this._articles[id].favorite = "0";
    this._saveListForOfflineMode();
    this.emit("change");
  },

  handleLogin({username}) {
    var base64name = Base64.encode(username);
    AsyncStorage.multiGet([
        `${base64name}_ARTICLES_LIST`,
        `${base64name}_ARTICLES_SINCE`
      ])
      .then((res) => {
        if (res[0] && res[0][1] !== null){
          this._articles = JSON.parse(res[0][1]);
        }

        if (res[1] && res[1][1] !== null){
          this._since = JSON.parse(res[1][1]);
        }

        this.emit("change");
      });
  },

  handleLogout() {
    this.init();
    this.emit("change");
  },

  /*==========  helpers  ==========*/
  _formatArticles(articles) {
    return Object.keys(articles)
                 .map(key => articles[key])
                 .sort((a, b) => a.time_added < b.time_added ? 1 : a.time_added > b.time_added ? -1 : 0);
  },

  _saveListForOfflineMode() {
    var base64name = Base64.encode(this.flux.stores.user.getUsername());
    AsyncStorage.setItem(`${base64name}_ARTICLES_LIST`, JSON.stringify(this._articles))
      .then(() => console.log("Saved ARTICLES to disk"))
      .catch((error) => console.log("AsyncStorage error: ", error.message))
      .done();
  },

  _saveSinceValueForOfflineMode() {
    var base64name = Base64.encode(this.flux.stores.user.getUsername());
    AsyncStorage.setItem(`${base64name}_ARTICLES_SINCE`, JSON.stringify(this._since))
      .then(() => console.log("Saved SINCE value to disk"))
      .catch((error) => console.log("AsyncStorage error: ", error.message))
      .done();
  }
});

module.exports = ArticlesStore;
