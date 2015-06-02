/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
"use strict";

var React = require("react-native");
var Fluxxor = require("fluxxor");
var window = require("Dimensions").get("window");
var _ = require("lodash");
var Icon = require("FAKIconImage");

var {
  AppRegistry,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  SliderIOS
} = React;

var MyText = require("./MyText.js");
var LoginPage = require("../pages/LoginPage");

var WPM_STEP = 10;
var Menu = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin("text", "settings", "user")
  ],

  propTypes: {
    menuActions: React.PropTypes.object,
  },

  getStateFromFlux() {
    return {
      username: this.getFlux().stores.user.getUsername(),
      wpm: this.getFlux().stores.text.getWPM(),
      themes: this.getFlux().stores.settings.getAllThemes(),
      activeThemeName: this.getFlux().stores.settings.getColorThemeName()
    };
  },

  _handleSliderChange(value) {
    value = parseInt(value * 1000);
    var newWPM = parseInt(value / WPM_STEP) * WPM_STEP;
    this.setState({
      wpm: newWPM
    });
  },

  _handleSlideComplete(value) {
    value = parseInt(value * 1000);
    var newWPM = parseInt(value / WPM_STEP) * WPM_STEP;
    this.setState({
      wpm: newWPM
    });

    this.getFlux().actions.text.setWPM(newWPM);
  },

  _handleSelectTheme(theme) {
    this.getFlux().actions.settings.setColorTheme(theme);
  },

  _handleLogout() {
    this.getFlux().actions.user
      .logout()
      .then(() => {
        this.props.getNavigator()
          .resetTo({
            title: "Login Page",
            component: LoginPage,
            passProps: {
              toggleSidebar: this.props.menuActions.toggle
            }
          });

        setTimeout(() => {
          this.props.menuActions.close();
        }, 1);
      });
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.username !== this.state.username
      || nextState.wpm !== this.state.wpm
      || nextState.activeThemeName !== this.state.activeThemeName;
  },

  render() {
    var colors = this.state.colors;

    return (
      <View style={styles.menu}>
        <View style={[styles.row, styles.rowProfile]}>
          <MyText numberOfLines={1}
                  style={[styles.rowProfileUsername]}>{this.state.username}</MyText>

          <TouchableOpacity onPress={this._handleLogout}>
            <Icon name="ion|log-out"
                  size={24}
                  color="#fff"
                  style={styles.rowProfileLogoutIcon} />
          </TouchableOpacity>
        </View>

        <View style={[styles.row, styles.rowWPM]}>
          <MyText style={[styles.rowWPMLabel]}>Words per minute: {this.state.wpm}</MyText>

          <SliderIOS style={styles.rowWPMSlider}
                     value={parseInt(spritz.get("wpm")) / 1000}
                     minimumValue={0.1}
                     maximumValue={1}
                     onValueChange={this._handleSliderChange}
                     onSlidingComplete={this._handleSlideComplete} />
        </View>

        <View style={[styles.row, styles.rowColor]}>
          <MyText style={[styles.rowColorLabel]}>Color Theme:</MyText>

          <View style={styles.rowColorChoicesWrapper}>
            { _.map(this.state.themes, (colors, themeName) => {
                return (
                  <TouchableOpacity onPress={this._handleSelectTheme.bind(this, themeName)}
                                            key={themeName}>
                    <View style={[styles.rowColorCircle, {
                      backgroundColor: colors.background
                    }, this.state.activeThemeName === themeName && styles.rowColorCircleActive]} />
                  </TouchableOpacity>
                );
            }) }
          </View>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  menu: {
    paddingTop: 20,
    flex: 1,
    height: window.height,
    backgroundColor: "#3E4046",
    flexDirection: "column",
  },

  row: {
    marginBottom: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },
  rowProfile: {
    height: 55,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  rowProfileUsername: {
    color: "#fff",
    fontSize: 22,
    flex:1
  },
  rowProfileLogoutIcon: {
    marginRight: -10,
    width: 40,
    height: 60,
    marginTop: 4,
    alignSelf: "flex-end"
  },

  rowWPM: {
  },

  rowWPMLabel: {
    color: "#fff",
    fontSize: 22
  },

  rowWPMSlider: {
  },

  rowColor: {
  },

  rowColorLabel: {
    color: "#fff",
    fontSize: 22
  },

  rowColorChoicesWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  rowColorCircle: {
    shadowColor: "#000",
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.6,

    width: 40,
    height: 40,
    borderRadius: 80,
    margin: 5,
    opacity: 0.8
  },
  rowColorCircleActive: {
    shadowOffset: {width: 3, height: 4},
    shadowOpacity: 0.8,
    opacity: 1
  }
});

module.exports = Menu;
