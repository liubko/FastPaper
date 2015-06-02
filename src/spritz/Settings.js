module.exports = function (app) {
  var settings = {
    wpm: 300,
    smartSlowing: true,
    entityAnalysis: true,
    emptySentenceEnd: true
  };

  app.get = function (key) {
    return settings[key];
  }

  app.set = function (key, value) {
    settings[key] = value;
  }

  app.event = function (category, action, label) {
    console.log("application.event", category, action, label);
  }
}
