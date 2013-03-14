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
    'hogan': 'http://twitter.github.com/hogan.js/builds/2.0.0/hogan-2.0.0',

    'prettify' : 'vendor/google-code-prettify-lite/prettify',
    'bootstrap': 'vendor/bootstrap/js/bootstrap-affix',
    'zeroclipboard' : 'vendor/zeroclipboard/ZeroClipboard.min'
  },
  shim: {
    'prettify' : {
      exports: 'prettyPrint'
    },
    'jquery-ui' : {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['jquery'],
      //Once loaded, use the global 'Backbone' as the
      //module value.
      exports: '$'
    },

    'zeroclipboard': {
      exports: 'ZeroClipboard'
    },

    'bootstrap' : {
      deps: [
        'jquery',
        'vendor/bootstrap/js/bootstrap-alert',
        'vendor/bootstrap/js/bootstrap-tooltip',
        'vendor/bootstrap/js/bootstrap-button',
        'vendor/bootstrap/js/bootstrap-carousel',
        'vendor/bootstrap/js/bootstrap-collapse',
        'vendor/bootstrap/js/bootstrap-dropdown',
        'vendor/bootstrap/js/bootstrap-modal',
        'vendor/bootstrap/js/bootstrap-popover',
        'vendor/bootstrap/js/bootstrap-scrollspy',
        'vendor/bootstrap/js/bootstrap-tab',
        'vendor/bootstrap/js/bootstrap-transition',
        'vendor/bootstrap/js/bootstrap-typeahead'
        ],
      exports: '$'
    },

    'hogan': {
      exports: 'Hogan'
    }
  }
});

require(['jquery', 'jsplumb', 'views/app', 'xml-builder', 'zeroclipboard', 'prettify', 'jquery-ui', 'bootstrap'], function($, jsPlumb, AppView, XmlBuilder, ZeroClipboard, Prettify) {
  var clip = new ZeroClipboard( document.getElementById("copy-button"), {
  moviePath: "/scripts/vendor/zeroclipboard/ZeroClipboard.swf"
} );

  clip.on( 'complete', function(client, args) {
  this.style.display = 'none'; // "this" is the element that was clicked
  alert("Copied text to clipboard: " + args.text );
} );
  window.appEvents = _.extend({}, Backbone.Events);

  this.xmlBuilder = XmlBuilder;
  this.app = new AppView;
});