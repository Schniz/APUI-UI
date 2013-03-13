define(['jquery', 'backbone', 'underscore', 'hgn!staches/command.palette', 'models/command', 'models/module', 'collections/modules'], function($, Backbone, _, Template, Command, Module, Modules) {
  return Backbone.View.extend({
    el: $("#command-palette"),
    modules: null,

    initialize: function() {
      this.initializeData();
      this.render();
    },

    events: {
      "click .tab-pane a" : 'addCommand'
    },

    addCommand : function(e) {
      e.preventDefault();
      var $me = $(e.currentTarget);
      var myTag = $me.data('tag');
      var command = this.findByTag(myTag);

      window.appEvents.trigger("addBlock:new", command);
    },

    initializeData: function() {
      window.cmd1 = new Command({
        attributes: [
          { name: 'bla', label: "Blabla", type: "text" },
          { name: 'mail', label: "Email", type: "email" },
          { name: 'ho', label: "Hohoho", type: "text", value: 'My Value' }
        ],
        outputs: 2,
        inputs: 2,
        label: "Nisso",
        tag: "Nisso",
        x: 321,
        y: 85
      });

      window.cmd2 = new Command({
        attributes: [
          { name: 'bla', label: "Blabla", type: "text" },
          { name: 'mail', label: "Email", type: "email" },
          { name: 'ho', label: "Hohoho", type: "text", value: 'My Value' }
        ],
        outputs: 2,
        inputs: 1,
        inputTypes: ['int'],
        label: "Int:Nisso",
        x: 603,
        y: 93
      });

      var command = new Command({
        outputs: 1,
        inputs: 1,
        x: 71,
        y: 86
      });


      var module = new Module({commands: [cmd1, cmd2], name: 'Example'});
      var module2 = new Module({commands: [command], name: 'Example2'});

      this.modules = new Modules([module, module2]);
    },

    findByTag: function(tagName) {
      return _.chain(window.app.commandPaletteView.modules.toJSON()).map(function(e) {
        return e.commands;
      }).flatten().filter(function(e) {
        return e.tag === tagName;
      }).value();
    },

    render : function() {
      var data = { modules : this.modules.toJSON(true) };
      this.$el.empty().append(Template(data));
      $(".nav-pills a").click(function(e) {
        alert('hey');
        e.preventDefault();
        $(this).tab('show');
      }).first().tab('show');
    }
  });
});