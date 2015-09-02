"use strict";

var React = require("react-native");
var {
  StyleSheet,
  TouchableOpacity
} = React;
var { Icon } = require("react-native-icons");

var SettingsButton = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
  },

  _handleRightButton() {
    if(this.props.onPress) {
      this.props.onPress()
    }
  },

  render() {
    return (
      <TouchableOpacity {...this.props} onPress={this._handleRightButton}>
        <Icon name="ion|ios-settings-strong"
              size={24}
              color="#fff"
              style={styles.root}/>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  root: {
    width: 50,
    height: 55
  },
});

module.exports = SettingsButton;
