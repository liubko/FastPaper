// inspired by @olegcherr. https://github.com/olegcherr/Reedy-for-Chrome

var Utils = require('./Utils.js');
var PubSub = require('pubsub-js');

module.exports = (app) => {

  app.Reader = (raw, debugName) => {

    function onSettingsUpdate(e, key, value) {
      // console.log("Reader.onSettingsUpdate");
      if (key === 'entityAnalysis') {
        updateSequencer();
      }
    }

    // function onSequencerUpdate() {
    //   console.log("Reader.onSequencerUpdate", isConfigSent, currentSeq.index);
    //   if (!isConfigSent && currentSeq.index === Math.round(currentSeq.length / 3 * 2)) {
    //     isConfigSent = true;

    //     app.event('Config', 'WPM', app.get('wpm'));

    //     app.event('Config', 'Gradual acceleration', app.get('gradualAccel'));
    //     app.event('Config', 'Smart slowing', app.get('smartSlowing'));

    //     app.event('Config', 'Entity analysis', app.get('entityAnalysis'));
    //     app.event('Config', 'Hyphenation', app.get('hyphenation'));
    //     app.event('Config', 'Empty sentence end', app.get('emptySentenceEnd'));

    //     app.event('Config', 'Progress bar', app.get('progressBar'));
    //     app.event('Config', 'Time left', app.get('timeLeft'));
    //     app.event('Config', 'Sequel', app.get('sequel'));
    //   }
    // }

    function updateSequencer() {
      // console.log("Reader.updateSequencer");
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
