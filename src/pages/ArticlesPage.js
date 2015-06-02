"use strict";

var React = require("react-native");
var {
  StyleSheet,
  View,
  ListView
} = React;
var Fluxxor = require("fluxxor");
var _ = require("lodash");
var RefreshableListView = require("react-native-refreshable-listview")

var ReaderPage = require("./ReaderPage");
var ArticleItem = require("../components/ArticleItem.js");
var MyText = require("../components/MyText.js");
var Header = require("../components/Header.js");
var Loader = require("../components/Loader");
var SettingsButton = require("../components/SettingsButton.js");

var ArticlesPage = React.createClass({
  propTypes: {
    toggleSidebar: React.PropTypes.func.isRequired,
  },

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin("articles")
  ],

  rows: [],

  getStateFromFlux() {
    /**

      TODO:
      - implement rowHasChanged

    **/

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    var articles = this.getFlux().stores.articles.getArticles();
    return {
      articlesDS: ds.cloneWithRows(articles),
      articles: articles
    };
  },

  componentWillMount() {
    this.getFlux().actions.page.setPage("ARTICLES_PAGE");
  },

  componentDidMount() {
    this.getFlux().actions.articles
      .fetch(true)  // isInitial === true
      .then(() => {
        console.log("then:", this.refs);

        if (this.refs && this.refs.loader) {
          this.refs.loader.hide();
        }
      });
  },

  /*==========  handlers  ==========*/
  _handleSelectArticle(article) {
    this.props.navigator.push({
      title: article.resolved_title,
      component: ReaderPage,
      passProps: {
        article: article,
        toggleSidebar: this.props.toggleSidebar,
      },
    });
  },

  _handleStartSwipe(article) {
    _.each(this.state.articles, a => {
      if (a.item_id !== article.item_id && this.rows["article_" + a.item_id]) {
        this.rows["article_" + a.item_id].swipeToInitialState();
      }
    });
  },

  _handleRefresh() {
    this.getFlux().actions.articles.fetch();
  },

  /*==========  render  ==========*/
  render() {
    return (
      <View style={styles.container}>
        <Header ref="header"
                title={"Fast Paper"}
                rightButton={<SettingsButton onPress={this.props.toggleSidebar} />}/>

        <View style={styles.container}>
          { this.state.articles.length <= 0
            ? <View style={styles.noArticlesMsgView}>
                <MyText style={styles.noArticlesMsgText}>Your list is empty</MyText>
              </View>
            : undefined }

          <RefreshableListView dataSource={this.state.articlesDS}
                               style={styles.listView}
                               loadData={this._handleRefresh}
                               automaticallyAdjustContentInsets={false}
                               refreshDescription="Refreshing articles"
                               renderRow={a => {
                                return (
                                   <ArticleItem ref={ row => this.rows["article_" + a.item_id]= row }
                                                article={a}
                                                onStartSwipe={this._handleStartSwipe.bind(this, a)}
                                                onSelect={this._handleSelectArticle.bind(this, a)} />
                                );
                               }} />
          { this.state.articles.length <= 0
              ? <Loader ref="loader"
                        isVisible={true}
                        overlayStyle={{backgroundColor: "transparent"}}
                        spinnerColor="#222" />
              : undefined }
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1, // listView won't scroll without this
    backgroundColor: "#f8f8f8"
  },
  listView: {
  },
  noArticlesMsgView: {
    // backgroundColor: "#f8f8f8",
    // flex: 1
  },
  noArticlesMsgText: {
    color: "#222",
    textAlign: "center",
    fontSize: 18,
    marginTop: 35
  }
});

module.exports = ArticlesPage;
