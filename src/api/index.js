'use strict';

var Pocket = require('./Pocket');
var Readability = require('./Readability');
var User = require('./User');

module.exports = {
  pocket: new Pocket(),
  readability: new Readability(),
  user: new User()
};
