"use strict";

var React = require("react-native");
var {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity
} = React;

var AnimationExperimental = require('AnimationExperimental');
var MyText = require("./MyText.js");
var Fluxxor = require("fluxxor");
var Icon = require("FAKIconImage");

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

  getInitialState: function() {
    return {
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

  hide(){
    AnimationExperimental.startAnimation({
      node: this.refs.root,
      duration: 200,
      easing: 'easeIn',
      property: 'opacity',
      toValue: 0,
    });
  },

  show(){
    AnimationExperimental.startAnimation({
      node: this.refs.root,
      duration: 200,
      easing: 'easeIn',
      property: 'opacity',
      toValue: 1,
    });
  },

  /*==========  render  ==========*/
  render() {
    return (
      <View ref="root"
            style={[styles.container]}>
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
      </View>
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
