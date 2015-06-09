// inspired by @olegcherr. https://github.com/olegcherr/Reedy-for-Chrome

var PubSub = require('pubsub-js');
var Utils = require('./Utils.js');

module.exports = function (app) {

  function getSinFactor(num, min, max) {
    return Math.sin(PI2 * (num - min) / (max - min));
  }

  function getWpmReducing(wasReadingLaunchedSinceOpen) {
    return wasReadingLaunchedSinceOpen ? INIT_WPM_REDUCE_1 : INIT_WPM_REDUCE_0;
  }



  var SENTENCE_END_COMPL = 2.1,
    INIT_WPM_REDUCE_0 = 0.5, // from 0 to 1 - wpm reduce factor for the FIRST start (more value means higher start wpm)
    INIT_WPM_REDUCE_1 = 0.6, // from 0 to 1 - wpm reduce factor for the FOLLOWING starts (more value means higher start wpm)
    ACCEL_CURVE = 3, // from 0 to infinity - more value means more smooth acceleration curve
    PI2 = Math.PI / 2;


  app.Sequencer = function (raw, data, debugName) {
    function getTiming(complexity) {
      // console.log("Sequencer.getTiming");
      var gradualAccel = app.get('gradualAccel'),
        targetWpm = app.get('wpm'),
        res;


      if (gradualAccel && wpm < targetWpm && startWpm < targetWpm) {
        if (wpm)
          wpm += 50 / (1 + ACCEL_CURVE * getSinFactor(wpm, startWpm, targetWpm));
        else
          wpm = startWpm = targetWpm * getWpmReducing(wasLaunchedSinceOpen);

        if (wpm >= targetWpm)
          wpm = targetWpm;
      } else {
        wpm = targetWpm;
      }

      // Don't allow `startWpm` to get gte than `targetWpm`
      if (startWpm >= targetWpm)
        startWpm = targetWpm;


      res = 60000 / wpm;

      if (gradualAccel && !wasLaunchedSinceOpen)
        res /= 1.5;

      if (!wasLaunchedSinceOpen)
        res *= 2;
      else if (app.get('smartSlowing'))
        res *= complexity;

      return res;
    }

    function next(justRun) {
      // console.log("Sequencer.next");

      clearTimeout(timeout);

      if (!self.isRunning) return;

      if (self.index >= length - 1) {
        setTimeout(function () {
          self.pause();
        }, 500);
      } else {
        justRun || self.toNextToken(true);
        token = self.getToken();

        function doUpdate() {
          var hyphenated = wasLaunchedSinceOpen && !justRun && app.get('hyphenation') ? token.toHyphenated() : [token.toString()],
            part;

          (function go() {
            if (part = hyphenated.shift()) {
              PubSub.publish("SPRITZ.Update", [part, hyphenated])

              timeout = setTimeout(go, getTiming(token.getComplexity()));
            } else {
              next();
            }
          })();
        }

        if (!justRun && self.index && data[self.index - 1].isSentenceEnd && app.get('emptySentenceEnd')) {
          PubSub.publish("SPRITZ.Update", [false])

          timeout = setTimeout(doUpdate, getTiming(SENTENCE_END_COMPL));
        } else {
          doUpdate();
        }
      }
    }

    function normIndex() {
      // console.log("Sequencer.normIndex");
      self.index = Utils.norm(self.index, 0, length - 1);
    }

    function changeIndex(back) {
      // console.log("Sequencer.changeIndex");
      var indexBefore = self.index;
      back ? self.index-- : self.index++;
      normIndex();

      if (self.index !== indexBefore) {
        complexityRemain = Utils.norm(complexityRemain + data[back ? self.index + 1 : self.index].getComplexity() * (back ? 1 : -1), 0, complexityTotal - complexityFirstToken);
        return true;
      }

      return false;
    }



    var self = this;
    var wasLaunchedSinceOpen = false;
    var length = data.length;
    var textLength = raw.length;
    var token = data[0];
    var wpm = 0;
    var startWpm = 0;
    var complexityFirstToken = token.getComplexity();
    var complexityTotal = (function (length, i, res) {
      for (; i < length && (res += data[i].getComplexity()); i++) {}
      return res;
    })(length, 0, 0);
    var complexityRemain = complexityTotal - complexityFirstToken;
    var timeout;


    self.isRunning = false;

    self.length = length;
    self.index = 0;


    self.play = function () {
      // console.log("Sequencer.play");
      if (self.isRunning) return;
      self.isRunning = true;
      wpm = 0;

      PubSub.publish("SPRITZ.Play")

      next(true);

      wasLaunchedSinceOpen = true;
    }

    self.pause = function () {
      // console.log("Sequencer.pause");
      clearTimeout(timeout);

      if (!self.isRunning) return;
      self.isRunning = false;

      PubSub.publish("SPRITZ.Pause")
    }

    self.toggle = function () {
      // console.log("Sequencer.toggle");
      self.isRunning ? self.pause() : self.play();
    }


    self.getToken = function () {
      // console.log("Sequencer.getToken");
      // console.log("Sequencer getToken", debugName);

      return data[self.index];
    }

    self.getContext = function (charsLimit) {
      // console.log("Sequencer.getContext");
      var token = self.getToken();

      var before = raw.substring(charsLimit ? Math.max(token.startIndex - charsLimit, 0) : 0, token.startIndex).trim();
      var after = raw.substring(token.endIndex, charsLimit ? Math.min(token.endIndex + charsLimit, raw.length) : raw.length).trim();


      return {
        before: Utils.htmlEncode(before).replace(/\n/g, "<br/>"),
        after: Utils.htmlEncode(after).replace(/\n/g, "<br/>"),
      };
    }

    self.getSequel = function () {
      // console.log("Sequencer.getSequel");
      if (self.getToken().isSentenceEnd)
        return [];

      var fromIndex = self.index + 1,
        res = [],
        t, i;

      for (i = 0; i < 10 && (t = data[fromIndex + i]); i++) {
        res.push(t.toString());
        if (t.isSentenceEnd) break;
      }

      return res;
    }


    self.toNextToken = function (noEvent) {
      // console.log("Sequencer.toNextToken");
      if (changeIndex() && !noEvent) {
        PubSub.publish("SPRITZ.Update")
      }
    }

    self.toPrevToken = function () {
      // console.log("Sequencer.toPrevToken");
      if (changeIndex(true)) {
        PubSub.publish("SPRITZ.Update")
      }
    }

    self.toNextSentence = function () {
      // console.log("Sequencer.toNextSentence");
      while (changeIndex()) {
        if (data[self.index - 1].isSentenceEnd) {
          break;
        }
      }

      PubSub.publish("SPRITZ.Update")
    }

    self.toPrevSentence = function () {
      // console.log("Sequencer.toPrevSentence");
      var startIndex = self.index;

      while (changeIndex(true)) {
        if (data[self.index].isSentenceEnd && (startIndex - self.index > 1 || self.index - 1 < 0 || data[self.index - 1].isSentenceEnd)) {
          if (startIndex - self.index > 1) {
            changeIndex();
          }
          break;
        }
      }

      PubSub.publish("SPRITZ.Update")
    }

    self.toLastToken = function () {
      // console.log("Sequencer.toLastToken");
      self.index = length - 1;
      complexityRemain = 0;

      normIndex();
      PubSub.publish("SPRITZ.Update")
    }

    self.toFirstToken = function () {
      // console.log("Sequencer.toFirstToken");
      self.index = 0;
      complexityRemain = complexityTotal - complexityFirstToken;

      normIndex();
      PubSub.publish("SPRITZ.Update")
    }

    self.toTokenAtIndex = function (index) {
      // console.log("Sequencer.toTokenAtIndex");
      self.index = -1;
      complexityRemain = complexityTotal;

      while (changeIndex()) {
        if (data[self.index].endIndex >= index)
          break;
      }

      PubSub.publish("SPRITZ.Update")
    }

    self.toProgress = function (val) {
      // console.log("Sequencer.toProgress");
      self.toTokenAtIndex(textLength * val);
    }


    self.getProgress = function () {
      // console.log("Sequencer.getProgress");
      return self.index / (length - 1);
    }

    self.getTimeLeft = function () {
      // console.log("Sequencer.getTimeLeft");
      return complexityRemain * (60000 / app.get('wpm'));
    }


    self.destroy = function () {
      // console.log("Sequencer.destroy");
      for (var i = 0; i < data.length; i++) {
        data[i].destroy();
        data[i] = null;
      }

      raw = data = null;
    }

  }


}
