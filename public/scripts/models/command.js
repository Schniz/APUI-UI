define(['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
  return Backbone.Model.extend({
    defaults: {
      outputs: 0,
      inputs: 0,
      label: 'Untitled',
      tag: 'UntitledTag',
      id: 999,
      attributes: [],
      next: [],
      prev: [],
      inputTypes: ['string'],
      outputType: 'string'
    },

    initialize: function(model) {
    }
  });
});