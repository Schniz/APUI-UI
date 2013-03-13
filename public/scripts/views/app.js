define(['jquery', 'backbone', 'underscore', 'jsplumb', 'models/command', 'views/box', 'jquery-ui'], function($, Backbone, _, jsPlumb, Command, BoxView) {
  return Backbone.View.extend({
    boxes: {},

    initialize: function() {
      this.on('changedConnections:added', this.addedConnection, this);
      this.on('changedConnections:removed', this.removedConnection, this);
      window.appEvents.on('boxes:added', this.addBox, this);

      jsPlumb.bind('beforeDrop', function(info) {
        var src = $('#' + info.sourceId).data('model');
        var target = $('#' + info.targetId).data('model');

        // Check if the inputType is in the input types
        for (var inputTypeId in target.inputTypes) {
          if (target.inputTypes[inputTypeId] === src.outputType) {
            window.app.trigger('changedConnections:added', {target: target, src: src});

            return true;
          }
        }

        return false;
      });

      jsPlumb.bind('beforeDetach', function(info) {
        var src = $('#' + info.sourceId).data('model');
        var target = $('#' + info.targetId).data('model');
        window.app.trigger('changedConnections:removed', {target: target, src: src});
        return true;
      });


      this.createFakeData();

      // Box

      // jsPlumb.draggable("box-1");
      // jsPlumb.draggable("box-2");

      // jsPlumb.addEndpoint("box-1", {
      //     endpoint:"Dot",
      //     anchor:"RightMiddle"
      // });

      // jsPlumb.addEndpoint("box-2", {
      //     endpoint:"Dot",
      //     anchor:"RightMiddle"
      // });
    },

    createFakeData: function() {
      window.cmd1 = new Command({
        attributes: [
          { label: "Blabla", type: "text" },
          { label: "Email", type: "email" },
          { label: "Hohoho", type: "text", value: 'My Value' }
        ],
        outputs: 2,
        inputs: 2,
        label: "Nisso"
      });

      window.cmd2 = new Command({
        attributes: [
          { label: "Blabla", type: "text" },
          { label: "Email", type: "email" },
          { label: "Hohoho", type: "text", value: 'My Value' }
        ],
        outputs: 2,
        inputs: 1,
        inputTypes: ['int'],
        label: "Int:Nisso"
      });

      var command = new Command({
        outputs: 1,
        inputs: 1
      });

      window.boxView = new BoxView({ model: command });
      window.boxView2 = new BoxView({ model: cmd1 });
      window.boxView3 = new BoxView({ model: cmd2 });
    },

    changedFlow: function(model) {
      var connections = _(jsPlumb.getConnections()).filter(function(connection) {
        var id = "box-" + model.id;
        console.log(id);
        return (connection.sourceId == id) || (connection.targetId == id);
      });

      console.log(model.id, connections);
    },

    addedConnection: function(properties) {
      this.boxes[properties.src.id].trigger('connections:added', {from: properties.src});
      this.boxes[properties.target.id].trigger('connections:added', {to: properties.target});
    },

    removedConnection: function(properties) {
      this.boxes[properties.src.id].trigger('connections:removed', {from: properties.src});
      this.boxes[properties.target.id].trigger('connections:removed', {to: properties.target});
    },

    addBox: function(viewDetails) {
      this.boxes[viewDetails.id] = viewDetails.view;
    }
  });
});