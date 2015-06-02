var React = require("react-native");
var {
  StyleSheet,
  Text
} = React;

var MyText = React.createClass({
  propTypes: {
    subText: React.PropTypes.bool,
    mono: React.PropTypes.bool,
    style: React.PropTypes.array,
  },

  measure(callback) {
    this.refs.root.measure(callback);
  },

  handleLayout() {

  },

  render() {
    return (
      <Text {...this.props}
            ref="root"
            style={[styles.root,
                    this.props.style,
                    this.props.subText && styles.subText,
                    this.props.mono && styles.mono]}>
        {this.props.children}
      </Text>
    );
  }
});

var styles = StyleSheet.create({
  root: {
    fontFamily: "Roboto",
    fontWeight: "100",
    color: "#222",
  },
  subText: {
    color: "#929292",
  },
  mono: {
    fontFamily: "Roboto Mono"
  }
});


module.exports = MyText;

