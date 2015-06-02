"use strict";

var React = require("react-native");
var {
  StyleSheet,
  View,
  ActivityIndicatorIOS
} = React;

var Loader = React.createClass({
  propTypes: {
    isVisible: React.PropTypes.bool,
    overlayStyle: React.PropTypes.object,
    spinnerStyle: React.PropTypes.object,
    showOverlay: React.PropTypes.bool,
    spinnerColor: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      spinnerColor: "white"
    };
  },

  getInitialState() {
    return {
      isVisible: this.props.isVisible
    };
  },

  show(){
    this.setState({
      isVisible: true
    });
  },

  hide() {
    this.setState({
      isVisible: false
    });
  },

  render() {
    if(!this.state.isVisible) {
      return <View />;
    }

    return (
      <View style={[styles.overlay, this.props.overlayStyle]}>
        <ActivityIndicatorIOS style={[styles.spinner, this.props.spinnerStyle]}
                              color={this.props.spinnerColor}
                              size="large" />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: "#FFFFFF"
  },
  spinner: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  }
});

module.exports = Loader;
