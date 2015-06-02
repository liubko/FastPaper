"use strict";

var Fluxxor = require("fluxxor");
var _ = require("lodash");
var EC = require("../EventConstants");
var S = require("string");

var {
  AsyncStorage
} = require("react-native");

var PocketQueueStore = Fluxxor.createStore({
  init() {
    this._queue = [];
  },

  initialize() {
    this.init();

    this.bindActions(
      EC.UI.DELAY_ACTION, this.handleDelayAction,
      EC.SERVER.REMOVE_DELAYED_ACTION, this.handleRemoveDelayedAction,
      EC.SERVER.LOGIN, this.handleLogin,
    );
  },

  /*==========  getters  ==========*/
  getQueue() {
    return this._queue;
  },

  /*==========  handlers  ==========*/
  handleDelayAction({id, action}) {
    // keep only one last action for each id
    // if there is action in the quey with same id, we want to remove it
    this._queue = this._queue.filter(action => action.item_id !== id);

    this._queue.push({
      item_id: id,
      action: action
    });

    this._saveQueueForOfflineMode();

    this.emit("change");
  },

  handleRemoveDelayedAction(action_results) {
    // var actionsToRemoveFromQueue = [];
    // action_results.forEach((res, index) => {
    //   if (res) {
    //     actionsToRemoveFromQueue.push(index)
    //   }
    // });
    // this._multisplice.apply(this, [this._queue].concat(actionsToRemoveFromQueue));
    this._queue = [];

    this._saveQueueForOfflineMode();

    this.emit("change");
  },

  handleLogin({username}) {
    var base64name = Base64.encode(username);
    AsyncStorage.getItem(`${base64name}_QUEUE`)
      .then((value) => {
        if (value !== null){
          this._queue = JSON.parse(value);
          this.emit("change");
        }
      });
  },

  _saveQueueForOfflineMode() {
    var base64name = Base64.encode(this.flux.stores.user.getUsername());
    AsyncStorage.setItem(`${base64name}_QUEUE`, JSON.stringify(this._queue))
      .then(() => console.log("Saved QUEUE to disk"))
      .catch((error) => console.log("AsyncStorage error: ", error.message))
      .done();
  },

  /*==========  Helpers  ==========*/
  _multisplice(array /*, ...args */){
    var args = Array.apply(null, arguments).slice(1);
    args.sort(function(a, b){
        return a - b;
    });
    for(var i = 0; i < args.length; i++){
        var index = args[i] - i;
        array.splice(index, 1);
    }
  }
});

module.exports = PocketQueueStore;
