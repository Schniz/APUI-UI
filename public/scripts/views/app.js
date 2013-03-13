define(['jquery', 'backbone', 'underscore', 'jsplumb', 'views/box', 'views/command.palette', 'models/command', 'jquery-ui'], function($, Backbone, _, jsPlumb, BoxView, CommandPaletteView, Command) {
  return Backbone.View.extend({
    boxes: {},
    commandPaletteView: new CommandPaletteView,

    initialize: function() {
      this.on('changedConnections:added', this.addedConnection, this);
      this.on('changedConnections:removed', this.removedConnection, this);
      window.appEvents.on('addBlock:new', this.addBlock, this);
      window.appEvents.on('boxes:added', this.addBox, this);

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
    },

    addBlock : function(params) {
      var cmd = new Command(params[0]);
      window.latestBlock = new BoxView({model: cmd});
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

            // Attributes
            this.xml("Attributes", {}, function() {
              _(model.attributes).each(function(attribute) {
                var attributeObj = { name: attribute.name };

                // Check if we need to add a value
                if (attribute.value !== undefined) {
                  _(attributeObj).extend({value: attribute.value});
                }

                this.xml("attr", attributeObj);
              }, this);
            });      
          });
        }, this);
      });

      return generatedXml;
    }
  });
});