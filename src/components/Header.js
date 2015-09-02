"use strict";

var React = require("react-native");
var {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} = React;

var MyText = require("./MyText.js");
var Fluxxor = require("fluxxor");
var { Icon } = require("react-native-icons");

var Header = React.createClass({
  propTypes: {
    showBackButton: React.PropTypes.bool,
    navigator: React.PropTypes.object,
    rightButton: React.PropTypes.object,
    onRightButton: React.PropTypes.func,
    title: React.PropTypes.string,
  },

  mixins: [
    Fluxxor.FluxMixin(React)
  ],

  getInitialState() {
    return {
      headerOpacityValue: new Animated.Value(1),
      isHidden: false
    };
  },

  /*==========  handlers  ==========*/
  _handleBack() {
    this.props.navigator.pop();
  },

  _handleRightButton() {
    if(this.props.onRightButton) {
      this.props.onRightButton()
    }
  },

  show(){
    this.state.headerOpacityValue.setValue(0);
    Animated.timing(
      this.state.headerOpacityValue,
      {
        toValue: 1,
        duration: 150
      }
    ).start();  // Start the animation
  },

  hide(){
    this.state.headerOpacityValue.setValue(1);
    Animated.timing(
      this.state.headerOpacityValue,
      {
        toValue: 0,
        duration: 150
      }
    ).start();  // Start the animation
  },

  /*==========  render  ==========*/
  render() {
    return (
      <Animated.View ref="playButton"
        style={[ styles.container,
          {
            opacity: this.state.headerOpacityValue
            /*transform: [{
              scale: this.state.headerOpacityValue
            }]*/
          }
        ]}>
        {this.props.showBackButton
          ? (<TouchableOpacity onPress={this._handleBack}>
              <Icon name="ion|ios-arrow-back"
                    size={24}
                    color="#fff"
                    style={styles.button} />
            </TouchableOpacity>)
          : <View style={styles.button} />}

        <MyText style={[styles.title]}
                numberOfLines={1}>
          {this.props.title}
        </MyText>

        {this.props.rightButton
          ? (<TouchableWithoutFeedback onPress={this._handleRightButton}
                                       style={styles.button}>
              {this.props.rightButton}
            </TouchableWithoutFeedback>)
          : <View style={styles.button} />}
      </Animated.View>
    );
  }
});

var HEIGHT = 80;
var styles = StyleSheet.create({
  container: {
    paddingTop: 20,

    backgroundColor: "#009DDD",
    borderColor: "#999",
    borderBottomWidth: 0.5,
    height: HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: 50,
    height: 55,
    margin: 0,
  },
  title: {
    flex: 2,
    textAlign: "center",
    fontSize: 20,
    color: "#fff"
  },
  hidden: {
    opacity: 0,
  }
});

module.exports = Header;
