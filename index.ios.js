"use strict";

require('js-base64'); // will init global Base64 object

var React = require("react-native");
var App = require("./src/App.js");
var Fluxxor = require("fluxxor");
var stores = require("./src/stores/");
var actions = require("./src/actions/");
var flux = new Fluxxor.Flux(stores, actions);

flux.stores.settings.on("change", suncQueue);
flux.stores.pocketQueue.on("change", suncQueue);

function suncQueue() {
  if (flux.stores.settings.isConnected()) {
    flux.actions.pocketQueue.sync();
  }
}

/*=============================
=            DEBUG            =
=============================*/
// flux.on("dispatch", (type, payload) => {
//   // console.log("[Dispatch]", type, JSON.stringify(payload));
//   console.log("[Dispatch]", type, payload);
// });
// window.flux = flux;

// var { AsyncStorage } = require("react-native");
// window.AsyncStorage = AsyncStorage;
// window.getAllInAsyncStorage = () => {
//   AsyncStorage.getAllKeys()
//     .then(value => {
//       console.log("AsyncStorage.getAllKeys:",value);
//       return AsyncStorage.multiGet(value)
//     })
//     .then(value => {
//       console.log("AsyncStorage.multiGet:",value);
//     })
//     .catch(err => {
//       console.log("AsyncStorage.err:" ,err);
//     });
// }
/*-----  End of DEBUG  ------*/

var FastPaper = React.createClass({
  render() {
    return (
      <App flux={flux} />
    );
  }
});

React.AppRegistry.registerComponent("FastPaper", () => FastPaper);
