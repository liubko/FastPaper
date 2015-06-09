"use strict";

var React = require("react-native");
var {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  PanResponder,
  StatusBarIOS
} = React;

var AnimationExperimental = require('AnimationExperimental');
var Fluxxor = require("fluxxor");
var Icon = require("FAKIconImage");
var deviceScreen = require('Dimensions').get('window');

var MyText = require("../components/MyText.js");
var Header = require("../components/Header.js");
var Spritz = require("../components/Spritz");
var Loader = require("../components/Loader");
var SettingsButton = require("../components/SettingsButton.js");

var ReaderPage = React.createClass({
  propTypes: {
    article: React.PropTypes.object,
    toggleSidebar: React.PropTypes.func.isRequired,
  },

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin("text", "settings"),
  ],

  getStateFromFlux() {
    return {
      isTextReady: this.getFlux().stores.text.isReady(),
      isPlaying: this.getFlux().stores.text.isPlaying(),
      context: this.getFlux().stores.text.getContext(),
      colors: this.getFlux().stores.settings.getThemeColors()
    };
  },

  componentWillMount() {
    this.getFlux().actions.page.setPage("ARTICLE_PAGE");

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.dy = gestureState.dy;

        if (this.state.isPlaying) {
          this._handlePause();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < this.dy) {
          this.getFlux().actions.text.toNextSentence();
        } else {
          this.getFlux().actions.text.toPrevSentence();
        }
        this.dy = gestureState.dy;
      },
    });
  },

  componentDidMount() {
    this.refs.loader.show();
    this.getFlux().actions.text
      .fetchText(this.props.article.item_id)
      .done(undefined, err => {
        console.log("[Error in ReaderPage.componentDidMount]:", err);
      });
  },

  componentDidUpdate() {
    if (this.state.isTextReady) {
      this.refs.loader.hide();
    }
  },

  /*==========  Subsection comment block  ==========*/
  _handlePlay() {
    if (!this.state.isTextReady) {
      return;
    }

    this.getFlux().actions.text.play();
    StatusBarIOS.setHidden(true, "fade");
    this.refs.header.hide();

    AnimationExperimental.startAnimation({
      node: this.refs.playButton,
      duration: 200,
      easing: 'easeInQuad',
      property: 'opacity',
      toValue: 0,
    });
  },

  _handlePause() {
    this.getFlux().actions.text.pause();
    this.refs.header.show();
    StatusBarIOS.setHidden(false, "fade");

    AnimationExperimental.startAnimation({
      node: this.refs.playButton,
      duration: 200,
      easing: 'easeInQuad',
      property: 'opacity',
      toValue: 1
    });
  },

  _handleList() {
    this.props.navigator.pop();
  },

  /*==========  render  ==========*/
  render() {
    var colors = this.state.colors;
    var context = this.state.context;

    return (
      <View style={[ styles.rootView, {
                    backgroundColor: colors.background
                  }]}>

        <Header ref="header"
                title={this.props.article.resolved_title}
                showBackButton={true}
                navigator={this.props.navigator}
                rightButton={<SettingsButton onPress={this.props.toggleSidebar} />} />

        <View style={{flex: 1}}>
          <View style={[styles.mainView, this.state.isPlaying && styles.mainViewPlaying]}
                {...this._panResponder.panHandlers}>
            <View style={[styles.contextViewShared, styles.contextBeforeView]}>
              {!this.state.isPlaying
                  &&  <MyText style={[styles.contextViewTextShared,
                                      styles.contextBeforeText, {
                                        color: colors.contextText
                                      }]}>
                        {context.before}
                      </MyText> }
            </View>

            <View style={styles.spritzWraperView}>
              <Spritz ref="spritz"
                      flux={this.props.flux} />
            </View>

            <View style={[styles.contextViewShared,
                          styles.contextAfterView]}>
              {!this.state.isPlaying
                &&  <MyText style={[ styles.contextViewTextShared, {
                                      color: colors.contextText
                                    }]}>
                      {context.after}
                    </MyText> }
            </View>
          </View>

          <TouchableWithoutFeedback onPress={this._handlePlay} >
            <View ref="playButton"
                  style={[styles.buttonPlay]}>
              <Icon name="ion|play"
                    size={28}
                    color='#fff'
                    style={styles.iconPlay} />
            </View>
          </TouchableWithoutFeedback>

          <Loader ref="loader" spinnerStyle={{marginBottom: 40}}/>
        </View>
      </View>
    );
  }
});

var TEXT_PADDING = 27;
var FOOTER_HEIGHT = 45;
var styles = StyleSheet.create({
  rootView: {
    flex: 1,
    justifyContent: "space-between",
    // overflow: "visible",
  },
  mainView: {
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  mainViewPlaying: {
    paddingBottom: FOOTER_HEIGHT
  },

  /*=====================================
  =            Shared styles            =
  =====================================*/
  contextViewShared: {
    paddingLeft: TEXT_PADDING,
    paddingRight: TEXT_PADDING,
  },
  contextViewTextShared: {
    fontSize: 20,
  },
  /*-----  End of Shared styles  ------*/
  contextBeforeView: {
    height: 140,
  },
  contextBeforeText: {
    position: "absolute",
    bottom: 0
  },
  spritzWraperView: {
    flexDirection: "row",
    alignItems: "center",
  },
  contextAfterView: {
    flex: 1
  },
  buttonPlay: {
    position: "absolute",
    bottom: 40,
    right: 30,
    backgroundColor: "#E91E63",

    width: 70,
    height: 70,
    borderRadius: 35,
    margin: 5,

    shadowColor: "#000",
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.6,
  },
  iconPlay: {
    marginLeft: 2,
    backgroundColor: "transparent",
    flex: 1,
  },
});

module.exports = ReaderPage;
