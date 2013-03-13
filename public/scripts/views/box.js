define(['jquery', 'backbone', 'underscore', 'jsplumb', 'hgn!staches/box', 'jquery-ui'], function($, Backbone, _, jsPlumb, Template) {
  return Backbone.View.extend({
    className: 'box-wrapper',

    inputStyle : {
      fillStyle: 'pink'
    },

    outputStyle : {
      fillStyle: 'purple'
    },

    initialize: function() {
      
      console.log(this.model);

      if (!window.latestID) {
        window.latestID = 0;
      }

      var id = window.latestID;
      window.latestID++;

      // add to the app's boxes
      this.model.set('id', id);
      window.appEvents.trigger('boxes:added', {id: id, view: this});
      this.bind('connections:added', this.addConnection, this);
      this.bind('connections:removed', this.removeConnection, this);
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
      this.$el.empty()
              .attr("id", this.getBoxID())
              .data("model", this.model.toJSON())
              .append(Template(this.model.toJSON()))
              .appendTo("#droppable-area");

      console.log(this.getBoxID());

      // Plumb it up
      jsPlumb.draggable(this.getBoxID());

      // Initialize Outputs
      if (this.model.get('outputs') >= 1) {
        jsPlumb.addEndpoint(this.getBoxID(), {
            endpoint: "Dot",
            anchor: "TopRight",
            maxConnections: 1,
            isSource: true,
            paintStyle: this.outputStyle
        });

        // Check if there are more than 2 outputs
        if (this.model.get('outputs') >= 2) {
          jsPlumb.addEndpoint(this.getBoxID(), {
            endpoint: "Dot",
            anchor: "BottomRight",
            isSource: true,
            maxConnections: 1,
            paintStyle: this.outputStyle
          });
        }
      }

      // Initialize Inputs
      if (this.model.get('inputs') >= 1) {
        var start1 = jsPlumb.addEndpoint(this.getBoxID(), {
            endpoint: "Dot",
            anchor: "TopLeft",
            maxConnections: 1,
            isTarget: true,
            paintStyle: this.inputStyle
        });

        // Check if there are more than 2 inputs
        if (this.model.get('inputs') >= 2) {
          var start2 = jsPlumb.addEndpoint(this.getBoxID(), {
            endpoint: "Dot",
            anchor: "BottomLeft",
            maxConnections: 1,
            isTarget: true,
            paintStyle: this.inputStyle
          });
        }
      }

      return this.$el;
    },

    addConnection: function(info) {
      if (info.from) {
        var prevs = this.model.get('prev');

        if (!_(prevs).contains(info.from)) {
          prevs.push(info.from);
          this.model.set('prev', prevs);
        }
      }

      if (info.to) {
        var nexts = this.model.get('next');

        if (!_(nexts).contains(info.to)) {
          nexts.push(info.to);
          this.model.set('next', nexts);
        }
      }
    },

    removeConnection: function(info) {
      if (info.from) {
        var prevs = this.model.get('prev');
        prevs = _(prevs).without(info.from);
        this.model.set('prev', prevs);
      }

      if (info.to) {
        var nexts = this.model.get('next');
        nexts = _(nexts).without(info.to);
        this.model.set('next', nexts);
      }
    }
  });
});