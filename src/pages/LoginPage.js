"use strict";

var React = require("react-native");
var {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} = React;

var Pocket = require("NativeModules").Pocket;
var Fluxxor = require("fluxxor");

var ArticlesPage = require("./ArticlesPage");
var MyText = require("../components/MyText.js");

var LoginPage = React.createClass({
  propTypes: {
    toggleSidebar: React.PropTypes.func.isRequired,
  },

  mixins: [
    Fluxxor.FluxMixin(React),
  ],

  _handleLoginWithPocket() {
    this.getFlux().actions.user
      .login()
      .done(data => {
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
        console.log("_handleLoginWithPocket:", err);
      });
  },

  componentWillMount() {
    this.getFlux().actions.page.setPage("LOGIN_PAGE");
  },

  render() {
    return (
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
    );
  }
});

var styles = StyleSheet.create({
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
