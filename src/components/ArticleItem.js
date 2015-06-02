"use strict";

var React = require("react-native");
var {
  StyleSheet,
  View,
  Image,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AlertIOS
} = React;

var Swiper = require("react-native-swiper")
var MyText = require("./MyText.js");
var parse = require("url-parse")
var Fluxxor = require("fluxxor");
var Icon = require("FAKIconImage");

var ArticleItem = React.createClass({
  propTypes: {
    article: React.PropTypes.object.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    onStartSwipe: React.PropTypes.func.isRequired,
  },

  mixins: [
    Fluxxor.FluxMixin(React)
  ],

  /*==========  API  ==========*/
  swipeToInitialState() {
    this.refs.swiper.scrollTo(this.refs.swiper.state.index * -1);
  },

  /*==========  handlers  ==========*/
  handleSelectArticle() {
    this.props.onSelect()
  },

  _handleFavorite() {
    if (this.props.article.favorite === "1") {
      this.getFlux().actions.articles.unfavorite(this.props.article.item_id)
    } else {
      this.getFlux().actions.articles.favorite(this.props.article.item_id)
    }
  },

  _handleArchive() {
    this.swipeToInitialState();
    this.getFlux().actions.articles.archive(this.props.article.item_id)
  },

  _handleDelete() {
    AlertIOS.alert(
      'Are you sure?',
      'Are you sure you want to delete this article? This cannot be undone.',
      [
        {text: 'Cancel'},
        {text: 'Delete', onPress: () => {
          this.swipeToInitialState();
          this.getFlux().actions.articles.delete(this.props.article.item_id)
        }},
      ]
    )

  },

  /*==========  render  ==========*/
  render() {
    var article = this.props.article || {};
    var host = parse(article.resolved_url, true).host.replace("www.", "");
    var image_src = article.image ? article.image.src : "";
    var title = article.resolved_title.replace(/\s+/g, " ");

    return (
      <Swiper ref="swiper"
              style={styles.container}
              height={HEIGHT}
              showsPagination={false}
              onTouchStart={this.props.onStartSwipe.bind(this, this.props.article.item_id)}
              loop={false}
              index={0}>
        <TouchableWithoutFeedback onPress={this.handleSelectArticle}>
          <View style={styles.swipeInfoPart}>
            <View style={styles.columnStar}>
              { article.favorite === "1"
                  && <Icon name="ion|android-star"
                           size={18}
                           color="#fc8"
                           style={styles.starIcon} /> }
            </View>

            <View style={styles.columnInfo}>
              <MyText style={[styles.title]}
                      numberOfLines={3}>
                {title}
              </MyText>

              <MyText style={[styles.host]} subText={true}>
                {host}
              </MyText>
            </View>

            { image_src
              ? ( <View style={styles.columnImage}>
                    <Image source={{uri: image_src}} style={styles.image} />
                  </View> )
              : undefined }
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.swipeActionsPart}>
          <TouchableOpacity onPress={this._handleArchive}>
            <Icon name="ion|checkmark-round"
                  size={32}
                  color="#000"
                  style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={this._handleFavorite}>
            <Icon name="ion|android-star"
                  size={32}
                  color={article.favorite === "1" ? "#fc8" : "#000"}
                  style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={this._handleDelete}>
            <Icon name="ion|trash-b"
                  size={32}
                  color="#000"
                  style={styles.icon} />
          </TouchableOpacity>
        </View>
      </Swiper>
    );
  }
});

var HEIGHT = 110;
var styles = StyleSheet.create({
  container: {
    height: 110,
  },
  swipeInfoPart: {
    padding: 10,
    paddingLeft: 8,
    paddingRight: 8,
    height: HEIGHT,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
    backgroundColor: "#fff"
  },
  columnStar: {
    width: 19,
  },
  starIcon: {
    height: 18,
    marginTop: 2
  },
  columnInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  host: {
    marginTop: 5,
    fontSize: 12,
  },
  columnImage: {
    width: 80,
    // justifyContent: "center",
    // paddingTop: 5,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    resizeMode: "cover",
    backgroundColor: "#333"
  },
  swipeActionsPart: {
    height: HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#f8f8f8"
  },
  icon: {
    height: 30,
    flex: 1,
  }
});

module.exports = ArticleItem;
