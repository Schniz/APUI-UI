define(['jquery', 'backbone', 'underscore', 'jsplumb', 'hgn!staches/box', 'jquery-ui'], function($, Backbone, _, jsPlumb, Template) {
  return Backbone.View.extend({
    className: 'box-wrapper',

    initialize: function() {

      className:
      
      console.log(this.model);

      if (!window.latestID) {
        window.latestID = 0;
      }

      this.model.set('id', window.latestID);
      window.latestID++;
      //
    },

    connectTo: function(anotherBoxView) {
      jsPlumb.connect({
        source: this.$el,
        target: anotherBoxView.$el
      });
    },

    initializeAsOutput: function() {
      jsPlumb.addEndpoint(this.getBoxID(), {
        endpoint:"Dot",
          anchor:"RightMiddle"
      });
    },

    getBoxID : function() {
      return "box-" + this.model.get('id');
    },

    render : function() {
      this.$el.empty().attr("id", this.getBoxID()).append(Template(this.model.toJSON())).appendTo("#droppable-area");

      console.log(this.getBoxID());

      // Plumb it up
      jsPlumb.draggable(this.getBoxID());

      // Initialize Outputs
      if (this.model.get('outputs') >= 1) {
        jsPlumb.addEndpoint(this.getBoxID(), {
            endpoint: "Dot",
            anchor: "TopRight",
            isSource: true
        });

        if (this.model.get('outputs') >= 2) {
          jsPlumb.addEndpoint(this.getBoxID(), {
            endpoint: "Dot",
            anchor: "BottomRight",
            isSource: true
          });
        }
      }

      // Initialize Inputs
      if (this.model.get('inputs') >= 1) {
        jsPlumb.addEndpoint(this.getBoxID(), {
            endpoint: "Dot",
            anchor: "TopLeft",
            isTarget: true
        });

        if (this.model.get('inputs') >= 2) {
          jsPlumb.addEndpoint(this.getBoxID(), {
            endpoint: "Dot",
            anchor: "BottomLeft",
            isTarget: true
          });
        }
      }

      return this.$el;
    }
  });
});