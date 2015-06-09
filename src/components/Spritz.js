"use strict";

var React = require("react-native");
var {
  StyleSheet,
  View,
  ListView,
  TouchableHighlight
} = React;

var MyText = require("./MyText.js");
var _ = require("lodash");
var Fluxxor = require("fluxxor");
var PubSub = require("pubsub-js");
window.PubSub = PubSub;

var Spritz = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin("text", "settings")
  ],

  propTypes: {
    onContextUpdate: React.PropTypes.func,
  },

  getStateFromFlux() {
    return {
      text: this.getFlux().stores.text.getText(),
      word: this.getFlux().stores.text.getWord(),
      colors: this.getFlux().stores.settings.getThemeColors()
    };
  },

  componentWillUnmount() {
    this.getFlux().actions.text.destroyReader();
  },

  /*==========  API  ==========*/
  render() {
    var word = this.state.word || [];
    var colors = this.state.colors;

    return (
      <View style={[styles.container, {
                      borderColor: colors.line
                    }]}>
        <View style={styles.pivotWrapper}>
          <View style={[styles.pivot, , {
                      backgroundColor: colors.line
                    }]} />
          <View style={[styles.pivot, , {
                      backgroundColor: colors.line
                    }]} />
        </View>

        <View style={styles.word}>
          <MyText mono={true}
                  style={[ styles.wordPart1,
                   this.state.pivotLetterWidth && {
                     width: LEFT_PIVOT_OFFSET - this.state.pivotLetterWidth/2
                   }, {
                    color: colors.text
                  }]}>
            {word[0]}
          </MyText>

          <MyText mono={true}
                  style={[styles.wordPart2, {
                    color: colors.pivot
                  }]}>
            {word[1]}
          </MyText>

          <MyText mono={true}
                  style={[styles.wordPart3, {
                    color: colors.text
                  }]}>
            {word[2]}
          </MyText>
        </View>
      </View>
    );
  }
});

var HEIGHT = 75;
var BORDER_WIDTH = 2;
var LEFT_PIVOT_OFFSET = 120;
var PIVOT_HEIGTH = 10;
var FONT_SIZE = 32;
var SPRITZ_MARGIN = 25;
var styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    borderBottomWidth: BORDER_WIDTH,
    borderTopWidth: BORDER_WIDTH,
    flex: 1,
    marginBottom: SPRITZ_MARGIN,
    marginTop: SPRITZ_MARGIN,
    justifyContent: "center",
  },
  pivotWrapper: {
    position: "absolute",
    top: 0,
    left: LEFT_PIVOT_OFFSET,
    width: BORDER_WIDTH,
    height: HEIGHT - BORDER_WIDTH*2,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  pivot: {
    width: BORDER_WIDTH,
    height: PIVOT_HEIGTH,
  },
  word: {
    marginTop: -5,
    padding: 0,
    flexDirection: "row",
  },
  wordPart1: {
    fontSize: FONT_SIZE,
    width: LEFT_PIVOT_OFFSET - 10,
    textAlign: "right",
  },
  wordPart2: {
    fontSize: FONT_SIZE,
  },
  wordPart3: {
    fontSize: FONT_SIZE,
  },
  hidden: {
    position: "absolute",
    opacity: 0
  }
});


module.exports = Spritz;
