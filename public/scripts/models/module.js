define(['jquery', 'backbone', 'underscore', 'models/command'], function($, Backbone, _, Command) {
  return Backbone.Model.extend({
    model: Command,
    defaults: {
      name: 'Untitled'
    }
  });
});