define(['jquery', 'backbone', 'underscore', 'jsplumb', 'hgn!staches/box', 'jquery-ui'], function($, Backbone, _, jsPlumb, Template) {
  return Backbone.View.extend({
    className: 'box-wrapper',

    inputStyle : {
      fillStyle: 'pink'
    },

    outputStyle : {
      fillStyle: 'purple'
    },

    events: {
      'change input' : 'updateAttributes'
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
      _(this).bind('updateAttributes');

      this.render();
    },

    connectTo: function(anotherBoxView) {
      jsPlumb.connect({
        source: this.$el,
        target: anotherBoxView.$el
      });
    },

    updateAttributes : function(e) {
      this.$el.find("input").each($.proxy(function(index, value) {
        var $value = $(value);
        var rel = $value.attr("data-name");
        console.log(rel);
        var attributes = {};

        attributes[rel] = $value.val();

        _(attributes).extend(this.model.get('attributes'));

        console.log(attributes);
      }, this));
    },

    getBoxID : function() {
      return "box-" + this.model.get('id');
    },

    render : function() {
      this.$el.empty()
              .attr("id", this.getBoxID())
              .data("model", this.model.toJSON())
              .append(Template(this.model.toJSON()))
              .css({top: this.model.get('y'), left: this.model.get('x')})
              .appendTo("#droppable-area");

      console.log(this.getBoxID());

      // Plumb it up
      jsPlumb.draggable(this.getBoxID(), {
        containment: "#droppable-area",
        stop: $.proxy(function() {
          var position = this.$el.position();
          this.model.set('y', position.top);
          this.model.set('x', position.left);
        }, this)
      });

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
      console.log('hey');

      var id = this.model.get('id');
      var to = info.to;
      var from = info.from;
      var endpoint = endpoint;

      // Check if this is the block that got the data [ ] => [X]
      if (id === to.id) {
        // Set this previous
        var prevs = this.model.get('prev');

        if (!_(prevs).contains(from)) {
          var prevNew = _([from]).union(prevs);
          this.model.set('prev', prevNew);
        }
      } else if (id === from.id) { // Check if this is the block that sent the data [X] => [ ]
        var nexts = this.model.get('next');

        this.model.set('awesome', 'very');

        if (!_(nexts).contains(to)) {
          var nextNew = {};
          nextNew[info.endpoint] = to;
          _(nextNew).extend(nexts);

          this.model.set('next', nextNew);
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

        console.log(this.model.get('next'));
      }
    }
  });
});