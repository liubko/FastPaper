"use strict";

var React = require("react-native");
var {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} = React;

var Fluxxor = require("fluxxor");

var ArticlesPage = require("./ArticlesPage");
var MyText = require("../components/MyText.js");
var Loader = require("../components/Loader");

var LoginPage = React.createClass({
  propTypes: {
    toggleSidebar: React.PropTypes.func.isRequired,
  },

  mixins: [
    Fluxxor.FluxMixin(React),
  ],

  _handleLoginWithPocket() {
    this._showLoader();
    /**

      TODO:
      - if user close pocket webview before it has been loaded
      - need to fire event in order to hide spinner

    **/
    setTimeout(() => {
      this._hideLoader();
    }, 3000);


    this.getFlux().actions.user
      .login()
      .done(data => {
        this._hideLoader();

        if (data.isLoggedIn) {
          this.props.navigator.resetTo({
            title: "Articles Page",
            component: ArticlesPage,
            passProps: {
              toggleSidebar: this.props.toggleSidebar,
            }
          });
        }
      }, err => {
        this._hideLoader();
        console.log("[Error in LoginPage._handleLoginWithPocket]:", err);
      });
  },

  _hideLoader() {
    if (this.refs && this.refs.loader) {
      this.refs.loader.hide();
    }
  },

  _showLoader() {
    if (this.refs && this.refs.loader) {
      this.refs.loader.show();
    }
  },

  componentWillMount() {
    this.getFlux().actions.page.setPage("LOGIN_PAGE");
  },

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.logo}>
            <Image style={styles.logoIcon}
                   source={require('image!logo-white')} />

            <MyText style={[styles.logoText]}>Fast Paper</MyText>
          </View>
          <TouchableOpacity onPress={this._handleLoginWithPocket}>
            <View style={styles.loginButton}>
              <Image style={styles.loginIcon}
                     source={require('image!pocket')} />

              <MyText style={[styles.loginText]}>Log in with Pocket</MyText>
            </View>
          </TouchableOpacity>

        </View>
        <Loader ref="loader"
                spinnerStyle={{
                  marginBottom: 40
                }}
                overlayStyle={{
                }} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#009DDD",
    padding: 50,
    paddingTop: 100,
    paddingBottom: 100
  },
  logo: {
    flex: 1,
    // height: 300,
    alignItems: "center",
  },
  logoIcon: {
    width: 150,
    height: 100,
    marginBottom: 10
  },
  logoText: {
    fontWeight: "100",
    fontSize: 46,
    fontStyle: "italic",
    color: "#fff"
  },
  loginButton: {
    padding: 5,
    paddingRight: 15,
    alignSelf: "center",
    alignItems: "center",
    // backgroundColor: "#E84352",
    // borderRadius: 5,
    flexDirection: "row"
  },

  loginIcon: {
    width: 35,
    height: 33,
    marginRight: 5
  },

  loginText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "400"
  },
});

module.exports = LoginPage;
