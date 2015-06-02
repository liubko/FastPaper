'use strict';

var React = require('react-native');
var {
  NavigatorIOS,
  StyleSheet,
  StatusBarIOS
} = React;

StatusBarIOS.setStyle(StatusBarIOS.Style.lightContent)

var Fluxxor = require('fluxxor');
var Sidebar = require('./sidebar/');

var Menu = require("./components/Menu.js");
var LoginPage = require("./pages/LoginPage");
var ArticlesPage = require("./pages/ArticlesPage");

var App = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin("user")
  ],

  getStateFromFlux() {
    return {
      isLoggedIn: this.getFlux().stores.user.isLoggedIn()
    };
  },

  toggleSidebar() {
    this.refs.sidebar.toggleMenu();
  },

  componentDidMount() {
    this.getFlux().actions.user
      .restoreSession()
      .then(data => {
        if (data.isLoggedIn) {
          this.refs.nav.resetTo({
            title: "Articles Page",
            component: ArticlesPage,
            passProps: {
              toggleSidebar: this.toggleSidebar,
            }
          });
        }
      })
  },

  _handleGetNavigator() {
    return this.refs.nav;
  },

  render() {
    return (
      <Sidebar ref="sidebar"
                disableGestures={!this.state.isLoggedIn}
                menu={<Menu getNavigator={this._handleGetNavigator} />}>

        <NavigatorIOS ref="nav"
                      itemWrapperStyle={styles.navWrap}
                      style={styles.nav}
                      navigationBarHidden={true}
                      initialRoute={{
                        title: "Login Page",
                        component: LoginPage,
                        passProps: {
                          toggleSidebar: this.toggleSidebar,
                        }
                      }} />
      </Sidebar>
    )
  }
});

var styles = StyleSheet.create({
  navWrap: {
    flex: 1,
  },
  nav: {
    flex: 1,
  },
});

module.exports = App;
