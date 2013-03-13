define(['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
  return (new Backbone.Router.extend({
    initialize: function() {
      Backbone.history.start({pushState: true});
    },

    routes: {
      "" : ""
    }
  }));
});