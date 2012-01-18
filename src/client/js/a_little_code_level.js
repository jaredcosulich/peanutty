(function() {
  var ball, goal, instructions, launchButton, launchButtonBackground, launchInstructions, pinball;
  var _this = this, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  level.name = 'a_little_code';

  Peanutty.createEnvironment();

  peanutty.setScale(25 * (peanutty.canvas.width() / 835));

  peanutty.createGround({
    x: 150,
    y: 30,
    width: 400,
    height: 10,
    friction: 0
  });

  peanutty.createGround({
    x: 850,
    y: 30,
    width: 300,
    height: 10
  });

  ball = peanutty.createBall({
    x: 240,
    y: 50,
    radius: 20,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0.8),
      alpha: 0.8
    }
  });

  pinball = peanutty.createBall({
    x: 120,
    y: 50,
    radius: 20,
    density: 20,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0),
      alpha: 0.8
    }
  });

  goal = peanutty.createBox({
    x: 980,
    y: 85,
    height: 50,
    width: 10,
    static: true,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0.8),
      alpha: 0.8
    }
  });

  level.striker = peanutty.createBox({
    x: 10,
    y: 50,
    width: 80,
    height: 20,
    density: 30,
    friction: 0,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0),
      alpha: 0.8
    }
  });

  level.pullBackStriker = function() {
    clearInterval(level.strikerInterval);
    return level.strikerInterval = setInterval((function() {
      var changeVec;
      if (level.striker.GetPosition().x < -2.5) {
        clearInterval(level.strikerInterval);
      }
      changeVec = new b2d.Common.Math.b2Vec2((level.striker.GetPosition().x + 2.5) / 50, 0);
      return level.striker.GetPosition().Subtract(changeVec);
    }), 10);
  };

  level.releaseStriker = function() {
    clearInterval(level.strikerInterval);
    level.striker.SetAwake(true);
    level.striker.SetLinearVelocity(new b2d.Common.Math.b2Vec2(level.striker.GetPosition().x * -10, 0));
    return level.strikerInterval = setInterval((function() {
      var changeVec;
      if (level.striker.GetPosition().x < 0 && !level.striker.IsAwake()) {
        clearInterval(level.strikerInterval);
      }
      if (level.striker.GetPosition().x > 1 || !level.striker.IsAwake()) {
        level.striker.SetAwake(false);
        changeVec = new b2d.Common.Math.b2Vec2(0.01, 0);
        return level.striker.GetPosition().Subtract(changeVec);
      }
    }), 10);
  };

  launchButtonBackground = level.elements.launchButton = $(document.createElement("DIV"));

  launchButtonBackground.css({
    backgroundColor: '#666',
    position: 'absolute',
    top: '398px',
    left: '68px',
    width: '44px',
    height: '44px',
    borderRadius: '22px'
  });

  level.canvasContainer.append(launchButtonBackground);

  launchButton = level.elements.launchButton = $(document.createElement("A"));

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
      command: "level.pullBackStriker()",
      time: level.getTimeDiff()
    });
  });

  launchButton.bind('mouseup', function() {
    launchButton.css({
      backgroundImage: '-webkit-radial-gradient(circle, #CAE6CA, #62C462)'
    });
    return peanutty.addToScript({
      command: "level.releaseStriker()",
      time: level.getTimeDiff()
    });
  });

  level.canvasContainer.append(launchButton);

  launchInstructions = level.elements.launchInstructions = $(document.createElement("DIV"));

  launchInstructions.html("<p>Press and hold the button to<br/>pull back the pinball striker.</p>");

  launchInstructions.css({
    position: 'absolute',
    top: '360px',
    left: "10px"
  });

  level.canvasContainer.append(launchInstructions);

  peanutty.addContactListener({
    listener: function(contact) {
      var fixtures, success, _ref, _ref2;
      if (level.elements.success != null) return;
      fixtures = [contact.GetFixtureA(), contact.GetFixtureB()];
      if ((_ref = ball.GetFixtureList(), __indexOf.call(fixtures, _ref) >= 0) && (_ref2 = goal.GetFixtureList(), __indexOf.call(fixtures, _ref2) >= 0)) {
        success = level.elements.success = $(document.createElement("DIV"));
        success.html("<h4>Nicely done.</h4>\n<p>\n    Got a creative solution? \n    Let me know: \n    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>\n</p>\n<p>How about a <a href='#level/stack_em'>slightly harder level ></a></p>\n<p>\n    ... or <a href='#create'>create your own level!<a> \n</p>");
        success.css({
          width: '400px',
          textAlign: 'center',
          position: 'absolute',
          top: '200px',
          left: "" + ((peanutty.canvas.width() / 2) - 200) + "px"
        });
        return level.canvasContainer.append(success);
      }
    }
  });

  instructions = level.elements.instructions = $(document.createElement("DIV"));

  instructions.html("<h1>Get the blue ball to hit the blue wall.</h1>\n<div>\n    The toolbar is gone, so it's going to take a little coding to do it.\n</div>\n<div>(hint: look at previous levels to get some ideas)</div>");

  instructions.css({
    width: '600px',
    textAlign: 'center',
    position: 'absolute',
    top: '20px',
    left: "" + ((peanutty.canvas.width() / 2) - 300) + "px"
  });

  level.canvasContainer.append(instructions);

  $('#tools').css({
    visibility: 'hidden'
  });

  peanutty.canvas.unbind('click');

  peanutty.canvas.css({
    cursor: 'default'
  });

  peanutty.sign('@jaredcosulich', 'jaredcosulich');

}).call(this);
