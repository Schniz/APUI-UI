require.config({
  paths: {
    'hgn': 'vendor/requirejs-plugins/hgn',
    'text': 'vendor/requirejs-plugins/text',

    'xml-builder': 'vendor/xml-builder/lib/xml_builder',
    'jquery': 'vendor/jquery/jquery',
    'underscore': 'vendor/underscore-amd/underscore',
    'backbone': 'vendor/backbone-amd/backbone',
    'jquery-ui': 'http://code.jquery.com/ui/1.10.1/jquery-ui',
    'jsplumb': 'vendor/jsplumb/jsplumb.1.3.9',
    'hogan': 'http://twitter.github.com/hogan.js/builds/2.0.0/hogan-2.0.0'
  },
  shim: {
    'jquery-ui' : {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['jquery'],
      //Once loaded, use the global 'Backbone' as the
      //module value.
      exports: '$'
    },

    'hogan': {
      exports: 'Hogan'
    }
  }
});

require(['jquery', 'jsplumb', 'views/app', 'xml-builder', 'jquery-ui'], function($, jsPlumb, AppView, XmlBuilder) {
  window.appEvents = _.extend({}, Backbone.Events);

  this.xmlBuilder = XmlBuilder;
  this.app = new AppView;
});