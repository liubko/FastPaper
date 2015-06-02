"use strict";

module.exports = {
  UI: {
    SPRITZ_SET_WPM: "UI:SPRITZ_SET_WPM",
    SPRITZ_PLAY: "UI:SPRITZ_PLAY",
    SPRITZ_PAUSE: "UI:SPRITZ_PAUSE",
    SPRITZ_NEXT_SENTENCE: "UI:SPRITZ_NEXT_SENTENCE",
    SPRITZ_PREV_SENTENCE: "UI:SPRITZ_PREV_SENTENCE",
    SPRITZ_DESTROY_READER: "UI:SPRITZ_DESTROY_READER",

    SET_PAGE: "UI:SET_PAGE",
    SET_COLOR_THEME: "UI:SET_COLOR_THEME",
    DELAY_ACTION: "UI:DELAY_ACTION",
    SELECT_TEXT: "UI:SELECT_TEXT",
  },

  SERVER: {
    LOGIN: "SERVER:LOGIN",
    LOGOUT: "SERVER:LOGOUT",

    ARTICLES_RECEIVE: "SERVER:ARTICLES_RECEIVE",
    TEXT_RECEIVE: "SERVER:TEXT_RECEIVE",

    ARCHIVE_ARTICLE: "SERVER:ARCHIVE_ARTICLE",
    DELETE_ARTICLE: "SERVER:DELETE_ARTICLE",
    FAVORITE_ARTICLE: "SERVER:FAVORITE_ARTICLE",
    UNFAVORITE_ARTICLE: "SERVER:UNFAVORITE_ARTICLE",

    REMOVE_DELAYED_ACTION: "SERVER:REMOVE_DELAYED_ACTION"
  },

  THEMES: {
    LIGHT: "LIGHT",
    MONOKAI: "MONOKAI"
  }
};
