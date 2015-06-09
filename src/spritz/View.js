// inspired by @olegcherr. https://github.com/olegcherr/Reedy-for-Chrome

var PubSub = require('pubsub-js');
var Utils = require('./Utils.js');

module.exports = function (app) {
  var CONTEXT_CHARS_LIMIT = 2000;

  var MIN_WPM = 50;
  var MAX_WPM = 2000;
  var WPM_STEP = 50;

  var MIN_FONT = 1;
  var MAX_FONT = 7;

  app.View = function () {
    function onSequencerUpdate(str, hyphenated) {
      updateWord(str, hyphenated);
      updateProgressBar();
      updateTimeLeft();
    }

    function onSequencerPlay() {
      updateWord();
    }

    function onSequencerPause() {
      updateWord(); // update is needed if paused on an "empty word" at the end of a sentence
    }

    function updateWord(str, hyphenated) {
      var word = '';
      if (str === false) {
        return;
      }

      str = str || sequencer.getToken().toString();

      var pivot = app.calcPivotPoint(str);
      var html =

      PubSub.publish("SPRITZ.VIEW.UpdateWord", {
        word: [
          Utils.htmlEncode(str.substr(0, pivot)).trim(),
          Utils.htmlEncode(str[pivot]).trim(),
          Utils.htmlEncode(str.substr(pivot + 1)).trim(),
        ],
        pivot: pivot,
        html: html
      });
    }

    function updateProgressBar() {
      // console.log("View.updateProgressBar", Math.round(sequencer.getProgress() * 1000) / 10 + '%');
      // $progressBar.style.width = Math.round(sequencer.getProgress()*1000)/10+'%';
    }

    function updateTimeLeft() {
      var timeLeft = sequencer.getTimeLeft();
      var sec = timeLeft / 1000;
      var min = sec / 60;
    }

    var self = this;
    var focusPoint = 0;
    var sequencer;


    self.setSequencer = function (seq) {
      if (sequencer) {
        PubSub.unsubscribe("SPRITZ.Play");
        PubSub.unsubscribe("SPRITZ.Pause");
        PubSub.unsubscribe("SPRITZ.Update");
      }

      sequencer = seq;

      PubSub.subscribe("SPRITZ.Play", () => {
        onSequencerPlay();
      });
      PubSub.subscribe("SPRITZ.Pause", () => {
        onSequencerPause();
      });
      PubSub.subscribe("SPRITZ.Update", (e, msg) => {
        onSequencerUpdate.apply(this, msg);
      });

      updateTimeLeft();
      updateWord();
    }

    self.destroy = function (seq) {
      PubSub.unsubscribe("SPRITZ.Play");
      PubSub.unsubscribe("SPRITZ.Pause");
      PubSub.unsubscribe("SPRITZ.Update");
    }

  };
}
