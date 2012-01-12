(function() {
  var ball, goal, instructions, launchButton, launchButtonBackground, launchInstructions, pinball;
  var _this = this, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  view.level = 'a_little_code';

  Peanutty.createEnvironment();

  peanutty.setScale(25 * (peanutty.canvas.width() / 835));

  peanutty.createGround({
    x: 150,
    y: 20,
    width: 300,
    height: 10,
    friction: 0
  });

  peanutty.createGround({
    x: 850,
    y: 20,
    width: 300,
    height: 10
  });

  ball = peanutty.createBall({
    x: 240,
    y: 40,
    radius: 20,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0.8),
      alpha: 0.8
    }
  });

  pinball = peanutty.createBall({
    x: 120,
    y: 40,
    radius: 20,
    density: 20,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0),
      alpha: 0.8
    }
  });

  goal = peanutty.createBox({
    x: 980,
    y: 75,
    height: 50,
    width: 10,
    static: true,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0.8),
      alpha: 0.8
    }
  });

  view.striker = peanutty.createBox({
    x: 10,
    y: 40,
    width: 80,
    height: 20,
    density: 30,
    friction: 0,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0),
      alpha: 0.8
    }
  });

  launchButtonBackground = view.levelElements.launchButton = $(document.createElement("DIV"));

  launchButtonBackground.css({
    backgroundColor: '#666',
    position: 'absolute',
    top: '398px',
    left: '68px',
    width: '44px',
    height: '44px',
    borderRadius: '22px'
  });

  view.$('#canvas_container').append(launchButtonBackground);

  launchButton = view.levelElements.launchButton = $(document.createElement("A"));

  launchButton.css({
    backgroundColor: '#57A957',
    backgroundImage: '-webkit-radial-gradient(circle, #CAE6CA, #62C462)',
    position: 'absolute',
    top: '400px',
    left: '70px',
    width: '40px',
    height: '40px',
    borderRadius: '20px'
  });

  launchButton.bind('mousedown', function() {
    launchButton.css({
      backgroundImage: '-webkit-radial-gradient(circle, #158515, #62C462)'
    });
    return peanutty.addToScript({
      command: "clearInterval(view.strikerInterval)\nview.strikerInterval = setInterval((\n        () =>\n            clearInterval(view.strikerInterval) if view.striker.GetPosition().x < -2.5\n            changeVec = new b2d.Common.Math.b2Vec2((view.striker.GetPosition().x + 20) / 2000, 0) \n            view.striker.GetPosition().Subtract(changeVec)  \n    ),\n    10\n)",
      time: view.getTimeDiff()
    });
  });

  launchButton.bind('mouseup', function() {
    launchButton.css({
      backgroundImage: '-webkit-radial-gradient(circle, #CAE6CA, #62C462)'
    });
    return peanutty.addToScript({
      command: "clearInterval(view.strikerInterval)\nview.striker.SetAwake(true)\nview.striker.SetLinearVelocity(new b2d.Common.Math.b2Vec2(view.striker.GetPosition().x * -10,0))\nview.strikerInterval = setInterval((\n        () =>\n            clearInterval(view.strikerInterval) if view.striker.GetPosition().x < 0\n            if view.striker.GetPosition().x > 1 || !view.striker.IsAwake()\n                view.striker.SetAwake(false)\n                changeVec = new b2d.Common.Math.b2Vec2(0.01, 0) \n                view.striker.GetPosition().Subtract(changeVec)  \n    ),\n    10\n)",
      time: view.getTimeDiff()
    });
  });

  view.$('#canvas_container').append(launchButton);

  launchInstructions = view.levelElements.launchInstructions = $(document.createElement("DIV"));

  launchInstructions.html("<p>Press and hold the button to<br/>pull back the pinball striker.</p>");

  launchInstructions.css({
    position: 'absolute',
    top: '360px',
    left: "10px"
  });

  view.$('#canvas_container').append(launchInstructions);

  peanutty.addContactListener({
    listener: function(contact) {
      var fixtures, success, _ref, _ref2;
      if (view.level !== 'a_little_code') return;
      if (view.levelElements.success != null) return;
      fixtures = [contact.GetFixtureA(), contact.GetFixtureB()];
      if ((_ref = ball.GetFixtureList(), __indexOf.call(fixtures, _ref) >= 0) && (_ref2 = goal.GetFixtureList(), __indexOf.call(fixtures, _ref2) >= 0)) {
        success = view.levelElements.success = $(document.createElement("DIV"));
        success.html("<h4>Nicely done.</h4>\n<p>\n    Got a creative solution? \n    Let me know: \n    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>\n</p>\n<p>More levels coming soon...</p>\n<p>\n    ... or <a href='#create'>create your own level!<a> \n</p>");
        success.css({
          width: '400px',
          textAlign: 'center',
          position: 'absolute',
          top: '200px',
          left: "" + ((peanutty.canvas.width() / 2) - 200) + "px"
        });
        return view.$('#canvas_container').append(success);
      }
    }
  });

  instructions = view.levelElements.instructions = $(document.createElement("DIV"));

  instructions.html("<h1>Get the blue ball to hit the blue wall.</h1>\n<div>\n    The toolbar is gone, so it's going to take a little coding to do it.\n</div>\n<div>(hint: look at previous levels to get some ideas)</div>");

  instructions.css({
    width: '600px',
    textAlign: 'center',
    position: 'absolute',
    top: '20px',
    left: "" + ((peanutty.canvas.width() / 2) - 300) + "px"
  });

  view.$('#canvas_container').append(instructions);

  $('#tools').css({
    visibility: 'hidden'
  });

  peanutty.canvas.unbind('click');

  peanutty.canvas.css({
    cursor: 'default'
  });

}).call(this);
