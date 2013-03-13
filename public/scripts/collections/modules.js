define(['jquery', 'backbone', 'underscore', 'models/module'], function($, Backbone, _, Module) {
  var Modules = Backbone.Collection.extend({
    model: Module
  });

  return Modules;
});