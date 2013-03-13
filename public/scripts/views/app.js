define(['jquery', 'backbone', 'underscore', 'models/command', 'views/box', 'jquery-ui'], function($, Backbone, _, Command, BoxView) {
  return Backbone.View.extend({

    initialize: function() {

      window.cmd1 = new Command({
        attributes: [
          { label: "Blabla", type: "text" },
          { label: "Email", type: "email" },
          { label: "Hohoho", type: "text", value: 'My Value' }
        ],
        outputs: 2,
        label: "Nisso"
      });

      var command = new Command({
        outputs: 1
      });

      window.boxView = new BoxView({ model: command });
      window.boxView2 = new BoxView({ model: cmd1 });

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
    }
  });
});