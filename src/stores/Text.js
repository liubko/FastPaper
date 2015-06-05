"use strict";

var Fluxxor = require("fluxxor");
var _ = require("lodash");
var EC = require("../EventConstants");
var S = require("string");
var PubSub = require("pubsub-js");

var {
  AsyncStorage
} = require("react-native");

var TextStore = Fluxxor.createStore({
  init() {
    this._isPlaying = false;
    this._texts = {};
    this._text = "";
    this._spritz = require("../spritz/");
    this._reader = undefined;
    this._contextBefore = "";
    this._contextAfter = "";
    this._word = [];
    this.debouncedToPrevSentence = undefined;
    this.debouncedToNextSentence = undefined;

    AsyncStorage.getItem("WPM")
      .then((value) => {
        if (value !== null){
          value = parseInt(value);
          this._spritz.set("wpm", value);
          this.emit("change");
        }
      });
  },

  initialize() {
    this.init();

    this.bindActions(
      EC.SERVER.ARTICLES_RECEIVE, this.handleReceiveArticles,

      EC.UI.SELECT_TEXT, this.handleSelectText,
      EC.SERVER.TEXT_RECEIVE, this.handleReceiveText,

      EC.UI.SPRITZ_SET_WPM, this.handleSpritzSetWPM,
      EC.UI.SPRITZ_PLAY, this.handleSpritzPlay,
      EC.UI.SPRITZ_PAUSE, this.handleSpritzPause,
      EC.UI.SPRITZ_NEXT_SENTENCE, this.handleSpritzNextSentence,
      EC.UI.SPRITZ_PREV_SENTENCE, this.handleSpritzPrevSentence,
      EC.UI.SPRITZ_DESTROY_READER, this.handleDestroyReader,

      EC.SERVER.LOGIN, this.handleLogin,
      EC.SERVER.LOGOUT, this.handleLogout
    );
    PubSub.subscribe("SPRITZ.VIEW.UpdateContext", this.handleUpdateContext);
    PubSub.subscribe("SPRITZ.VIEW.UpdateWord", this.handleUpdateWord);
  },

  /*==========  getters  ==========*/
  getText() {
    return JSON.parse(JSON.stringify(this._text));
  },

  getTextById(id) {
    return this._texts[id]
      ? JSON.parse(JSON.stringify(this._texts[id]))
      : undefined;
  },

  isPlaying() {
    return JSON.parse(JSON.stringify(this._isPlaying));
  },
  // getReader() {
  //   return this._reader; // We return a link on purpose
  // },

  getContextBefore() {
    return JSON.parse(JSON.stringify(this._contextBefore));
  },

  getContextAfter() {
    return JSON.parse(JSON.stringify(this._contextAfter));
  },

  getWord() {
    return JSON.parse(JSON.stringify(this._word || []));
  },

  getWPM() {
    return this._spritz.get("wpm");
  },

  /*==========  handlers  ==========*/
  handleReceiveArticles() {
    // firs let artilces store to update
    this.waitFor(["articles"], (articlesStore) => {
      // get ids of articles that exists in pocket
      var articlesIds = articlesStore.getArticles().map(a => a.resolved_id);

      // filter through saved texts and exclude thouse which are no longer in pocket
      var newTextsObject = {};
      Object.keys(this._texts).forEach(id => {
        if (articlesIds.indexOf(id) >= 0) {
          newTextsObject[id] = this._texts[id];
        }
      });
      this._texts = newTextsObject;
      this._saveTextsOfflineMode();

      this.emit("change");
    });
  },


  handleSelectText(text) {
    this._text = this._formatText(text);

    if (this._reader) {
      this._reader.destroy();
      this._reader = undefined;
    }

    this._reader = new spritz.Reader(this._text, this._text.substring(0, 10));
    this.debouncedToPrevSentence = _.throttle(this._reader.currentSeq.toPrevSentence, 100, {
      'leading': false,
      'trailing': false,
    });
    this.debouncedToNextSentence = _.throttle(this._reader.currentSeq.toNextSentence, 100, {
      'leading': false,
      'trailing': false,
    });

    this.emit("change");
  },

  handleReceiveText({id, text}) {
    this._texts[id] = this._formatText(text);
    this._saveTextsOfflineMode();
    this.emit("change");
  },

  handleSpritzSetWPM(wpm) {
    this._spritz.set("wpm", wpm);

    AsyncStorage.setItem("WPM", wpm + "")
      .then(() => console.log("Saved selection to disk: " + wpm))
      .catch((error) => console.log("AsyncStorage error: " + error.message))
      .done();

    this.emit("change");
  },

  handleSpritzPlay() {
    if (!this._text || this._text.length <= 0) {
      return;
    }

    this._isPlaying = true;
    this._reader.currentSeq.play();
    this.emit("change");
  },

  handleSpritzPause() {
    this._isPlaying = false;
    this._reader.currentSeq.pause();
    this.emit("change");
  },

  handleSpritzNextSentence() {
    if (this.debouncedToNextSentence) {
      this.debouncedToNextSentence();
    }
  },

  handleSpritzPrevSentence() {
    if (this.debouncedToPrevSentence) {
      this.debouncedToPrevSentence();
    }
  },

  handleDestroyReader() {
    if (this._reader) {
      this._reader.destroy();
    }
    this._reader = undefined;
  },

  /*==========  PubSub handlers  ==========*/
  handleUpdateContext(e, msg) {
    this._contextBefore = msg.contextBefore;
    this._contextAfter = msg.contextAfter;
    this.emit("change");
  },

  handleUpdateWord(e, msg) {
    this._word = msg.word;
    this.emit("change");
  },

  handleLogin({username}) {
    var base64name = Base64.encode(username);

    AsyncStorage.getItem(`${base64name}_TEXTS`)
      .then((value) => {
        if (value !== null){
          this._texts = JSON.parse(value);
          this.emit("change");
        }
      });
  },

  handleLogout() {
    this.handleDestroyReader();
    this.emit("change");
  },

  /*==========  helpers  ==========*/
  _formatText(text) {
    // Trim trailing and leading whitespace.
    text = text.trim();
    // Shrink long whitespaces.
    text = text.replace(/\s+/g, " ");
    // Make sure punctuation is apprpriately spaced.
    text = text.replace(/\./g, ". ");
    text = text.replace(/\?/g, "? ");
    text = text.replace(/\!/g, "! ");

    text = S(text)
      .stripTags()
      .unescapeHTML()
      .trim()
      .s;

    return text;
  },

  _saveTextsOfflineMode() {
    var base64name = Base64.encode(this.flux.stores.user.getUsername());

    AsyncStorage.setItem(`${base64name}_TEXTS`, JSON.stringify(this._texts))
      .then(() => console.log("Saved TEXTS to disk"))
      .catch((error) => console.log("AsyncStorage error: ", error.message))
      .done();
  },

});

module.exports = TextStore;
