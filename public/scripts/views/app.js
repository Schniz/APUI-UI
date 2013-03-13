define(['jquery', 'backbone', 'underscore', 'jsplumb', 'models/command', 'views/box', 'jquery-ui'], function($, Backbone, _, jsPlumb, Command, BoxView) {
  return Backbone.View.extend({
    boxes: {},

    initialize: function() {
      this.on('changedConnections:added', this.addedConnection, this);
      this.on('changedConnections:removed', this.removedConnection, this);
      window.appEvents.on('boxes:added', this.addBox, this);

      $("#draggable-area").on('click', '.box-wrapper', function() {
        console.log('clicked!');
      })

      jsPlumb.bind('beforeDrop', function(info) {
        var src = $('#' + info.sourceId).data('model');
        var target = $('#' + info.targetId).data('model');

        // Check if the inputType is in the input types
        for (var inputTypeId in target.inputTypes) {
          if (target.inputTypes[inputTypeId] === src.outputType) {
            window.app.trigger('changedConnections:added', {target: target, src: src, endpoints: info.connection.endpoints});

            return true;
          }
        }

        return false;
      });

      jsPlumb.bind('beforeDetach', function(info) {
        var src = $('#' + info.sourceId).data('model');
        var target = $('#' + info.targetId).data('model');
        window.app.trigger('changedConnections:removed', {target: target, src: src, endpoints: info.endpoints});
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
      var endpoint = 0;

      for (var endpointId in properties.endpoints) {
        var endpointValue = properties.endpoints[endpointId];

        if (endpointValue.elementId === ('box-' + properties.src.id)) {
          endpoint = (endpointValue.anchor.type === 'BottomRight') ? 1 : 0;
        }
      }

      this.boxes[properties.src.id].trigger('connections:added', {from: properties.src, to: properties.target, endpoint: endpoint});
      this.boxes[properties.target.id].trigger('connections:added', {from: properties.src, to: properties.target, endpoint: endpoint});
    },

    removedConnection: function(properties) {
      var endpoint = 0;

      for (var endpointId in properties.endpoints) {
        var endpointValue = properties.endpoints[endpointId];

        if (endpointValue.elementId === ('box-' + properties.src.id)) {
          endpoint = (endpointValue.anchor.type === 'BottomRight') ? 1 : 0;
        }
      }

      this.boxes[properties.src.id].trigger('connections:removed', {from: properties.src, to: properties.target, endpoint: endpoint});
      this.boxes[properties.target.id].trigger('connections:removed', {from: properties.src, to: properties.target, endpoint: endpoint});
    },

    addBox: function(viewDetails) {
      this.boxes[viewDetails.id] = viewDetails.view;
    },

    createXml: function() {
      var generatedXml = xml("Flow", {}, function() {
        _(window.app.boxes).each(function(box) {
          var model = (box.model.toJSON());
          this.xml("Command", {type: model.tag, id: model.id, x: model.x, y: model.y}, function() {

            // Previous
            this.xml("Prev", {}, function() {
              _(model.prev).each(function(id) {
                this.xml("id", {}, function() {
                  this.text(id.id);
                });
              }, this);
            });

            // Nexts
            this.xml("Next", {}, function() {
              _(model.next).each(function(id, endpoint) {
                this.xml("id", {endpoint: endpoint}, function() {
                  this.text(id.id);
                });
              }, this);
            });      
          });
        }, this);
      });

      console.log(generatedXml);
    }
  });
});