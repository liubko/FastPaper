'use strict';

var React = require('react-native');
var deviceScreen = require('Dimensions').get('window');
var styles = require('./styles');
var queueAnimation = require('./animations');
var deviceScreen = require('Dimensions').get('window');

var {
  PanResponder,
  View,
} = React;

/**
 * Default open menu offset. Describes a size of the amount you can
 * move content view from the left and release without opening it
 * @type {Number}
 */
var MENU_LEFT_OFFSET = 50;
var openMenuOffset = -1 * deviceScreen.width + MENU_LEFT_OFFSET;

/**
 * Content view offset in the `hidden` state
 * @type {Number}
 */
var hiddenMenuOffset = 0;

/**
 * Size of the amount you can move content view in the opened menu state and
 * release without menu closing
 * @type {Number}
 */
var barrierForward = deviceScreen.width / 4;

/**
 * Check if the current gesture offset bigger than allowed one
 * before opening menu
 * @param  {Number} dx Gesture offset from the left side of the window
 * @return {Boolean}
 */
function shouldOpenMenu(dx: Number) {
    return Math.abs(dx) > barrierForward;

}

var SideMenu = React.createClass({
  /**
   * Current state of the menu, whether it is open or not
   * @type {Boolean}
   */
  isOpen: false,

  /**
   * Current style `left` attribute
   * @todo Check if it's possible to avoid using `left`
   * @type {Number}
   */
  left: 0,

  /**
   * Default left offset for content view
   * @todo Check if it's possible to avoid using `prevLeft`
   * @type {Number}
   */
  prevLeft: 0,

  /**
   * Creates PanResponders and links to appropriate functions
   * @return {Void}
   */
  createResponders: function(disableGestures) {
    if (disableGestures || false) {
      this.responder = PanResponder.create({});
      return;
    }

    this.responder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderMove: this.handlePanResponderMove,
        onPanResponderRelease: this.handlePanResponderEnd,
    });
  },

  /**
   * Set the initial responders
   * @return {Void}
   */
  componentWillMount: function () {
    this.createResponders(this.props.disableGestures);
  },

  /**
   * Update responders on new props whenever possible
   * @return {Void}
   */
  componentWillReceiveProps: function (nextProps) {
    this.createResponders(nextProps.disableGestures);
  },

  /**
   * Change `left` style attribute
   * Works only if `sideMenu` is a ref to React.Component
   * @return {Void}
   */
  updatePosition: function() {
    this.sideMenu.setNativeProps({ left: this.left });

    var dif = Math.abs(openMenuOffset) - Math.abs(this.left);
    var percentage = 1 - Math.abs(dif) / Math.abs(openMenuOffset);
    percentage = Math.min(percentage, 0.75);

    this.statusBar.setNativeProps({
      backgroundColor: "rgba(0,0,0,"+ percentage+ ")"
    });
  },

  /**
   * Handler on responder move
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderMove: function(e: Object, gestureState: Object) {
    this.left = this.prevLeft + gestureState.dx;

    if (this.left < 0 && this.left > openMenuOffset) {
      this.updatePosition();
    }
  },

  /**
   * Open menu
   * @return {Void}
   */
  openMenu: function() {
    queueAnimation(this.props.animation);
    this.left = this.props.openMenuOffset || openMenuOffset;
    this.updatePosition();
    this.prevLeft = this.left;
    this.isOpen = true;
    this.forceUpdate();
  },

  /**
   * Close menu
   * @return {Void}
   */
  closeMenu: function() {
    queueAnimation(this.props.animation);
    this.left = this.props.hiddenMenuOffset || hiddenMenuOffset;
    this.updatePosition();
    this.prevLeft = this.left;
    this.isOpen = false;
    this.forceUpdate();
  },

  /**
   * Toggle menu
   * @return {Void}
   */
  toggleMenu: function() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  },

  /**
   * Handler on responder move ending
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderEnd: function(e: Object, gestureState: Object) {
    if (this.isOpen) {
      this.closeMenu();
      return;
    }

    if (shouldOpenMenu(this.left + gestureState.dx)) {
      this.openMenu();
    } else {
      this.closeMenu();
    }

    this.updatePosition();
    this.prevLeft = this.left;
  },

  /**
   * Get content view. This view will be rendered over menu
   * @return {React.Component}
   */
  getContentView: function() {
    var self = this;
    return (
      <View style={styles.frontView}
            ref={(sideMenu) => this.sideMenu = sideMenu}>

        {React.Children.map(this.props.children, function(child) {
          return React.cloneElement(child, {
            menuActions: self.getMenuActions
          });
        })}

        <View style={[styles.touchHandler, this.isOpen && styles.fullWidth]}
              accessible={true}
              ref={(sideMenu) => this.sideMenu = sideMenu}
              {...this.responder.panHandlers}/>
      </View>
    );
  },

  /**
   * Get menu actions to expose it to
   * menu and children components
   * @return {Object} Public API methods
   */
  getMenuActions: function() {
    return {
      close: this.closeMenu,
      toggle: this.toggleMenu,
      open: this.openMenu
    };
  },

  /**
   * Get menu view. This view will be rendered under
   * content view. Also, this function will decorate
   * passed `menu` component with side menu API
   * @return {React.Component}
   */
  getMenuView: function() {
    var menuActions = this.getMenuActions();

    return (
      <View style={[styles.menu, {left: MENU_LEFT_OFFSET}]}>
        {React.addons.cloneWithProps(this.props.menu, { menuActions })}
      </View>
    );
  },

  getStatusBar: function() {
    return (
      <View ref="statusBar"
            style={[styles.statusBarBase]}>
        <View ref={(statusBar) => this.statusBar = statusBar}
              style={[styles.statusBarOverlay]} />
      </View>
    );
  },

  /**
   * Compose and render menu and content view
   * @return {React.Component}
   */
  render: function() {
    return (
      <View style={styles.container}>
        {this.getMenuView()}
        {this.getContentView()}
        {this.getStatusBar()}
      </View>
    );
  }
});

SideMenu.propTypes = {
  toleranceX: React.PropTypes.number,
  toleranceY: React.PropTypes.number
}

SideMenu.defaultProps = {
  toleranceY: 10,
  toleranceX: 10
};

module.exports = SideMenu;
