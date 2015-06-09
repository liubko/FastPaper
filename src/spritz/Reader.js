// inspired by @olegcherr. https://github.com/olegcherr/Reedy-for-Chrome

var Utils = require('./Utils.js');
var PubSub = require('pubsub-js');

module.exports = (app) => {

  app.Reader = function(raw, debugName) {
    console.log("Reader.constor");

    function onSettingsUpdate(e, key, value) {
      console.log("Reader.onSettingsUpdate");
      if (key === 'entityAnalysis') {
        updateSequencer();
      }
    }

    function updateSequencer() {
      console.log("Reader.updateSequencer");
      var tokenStartIndex = -1;

      currentSeq && currentSeq.pause();

      if (app.get('entityAnalysis')) {
        currentSeq && (tokenStartIndex = currentSeq.getToken().startIndex);
        currentText = Utils.cleanUpTextAdvanced(raw);
        currentSeq = new app.Sequencer(currentText, app.advancedParser(currentText), debugName);
      } else {
        currentSeq && (tokenStartIndex = currentSeq.getToken().startIndex);
        currentText = Utils.cleanUpTextSimple(raw);
        currentSeq = new app.Sequencer(currentText, app.simpleParser(currentText), debugName);
      }

      view.setSequencer(currentSeq);
      self.currentSeq = currentSeq;

      tokenStartIndex > -1 && currentSeq.toTokenAtIndex(tokenStartIndex);

      // console.log("Unsubscribe Reader.PUBSUB.Update", currentText.length, currentSeq.length);
      // PubSub.unsubscribe("SPRITZ.Update");
      // PubSub.subscribe("SPRITZ.Update", (e, msg) => {
      //   onSequencerUpdate(msg);
      // });
      // if (currentText.length > 3000 && currentSeq.length > 400) {
      // } else {
      //   console.log("!!!!TEXT_IS_TO_SHORT!!!!!");
      // }
    }


    var self = this;

    var isDestroyed;
    var isConfigSent;
    var view = new app.View()

    var currentSeq;
    var currentText;

    self.destroy = () => {
      // console.log("READER.destroy");

      if (isDestroyed) return;
      isDestroyed = true;

      PubSub.unsubscribe("SPRITZ.SettingsUpdate")

      currentSeq.pause();
      currentSeq.destroy();
      view.destroy();

      currentSeq = currentText = view = undefined;
    }

    self.toPrevSentence = () => {
      // console.log("READER.toPrevSentence");
      currentSeq.toPrevSentence();
    }

    self.toNextSentence = () => {
      // console.log("READER.toNextSentence");
      currentSeq.toNextSentence();
    }

    updateSequencer();

    PubSub.subscribe("SPRITZ.SettingsUpdate", (e, msg) => {
      onSettingsUpdate(msg);
    });
  };
}
