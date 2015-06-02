var spritz = {};
require("./Settings.js")(spritz);
require("./Parser.js")(spritz);
require("./Reader.js")(spritz);
require("./Sequencer.js")(spritz);
require("./View.js")(spritz);

/*==========  For Debug  ==========*/
window.spritz = spritz;

module.exports = spritz;
