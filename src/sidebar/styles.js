var React = require('react-native');
var deviceScreen = require('Dimensions').get('window');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBarBase: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 20,
  },
  statusBarOverlay: {
    flex:1
  },
  menu: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',

    top: 0,
    bottom: 0,
    right: 0,
  },
  frontView: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#ffffff',
    width: deviceScreen.width,
    height: deviceScreen.height,
  },
  touchHandler: {
    position: 'absolute',
    height: deviceScreen.height,
    flex: 1,
    backgroundColor: 'transparent',
    opacity: 0.2,
    width: 20,
    top: 65,
    right: 0,
  },
  fullWidth: {
    width: deviceScreen.width
  }
});
