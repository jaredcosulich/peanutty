(function() {
  var adjustScreen, ballForces, ballIsInContactWithGround, goal, groundInfo, header, input, instructions, note, scale, upCommand, _i, _len, _ref;
  var _this = this, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  view.level = 'ball_jump';

  Peanutty.createEnvironment();

  scale = 15 * (peanutty.canvas.width() / 835);

  peanutty.screen.setScale(scale);

  _ref = [
    {
      width: 600,
      x: 300,
      color: new b2d.Common.b2Color(0, 0.6, 0)
    }, {
      width: 900,
      x: 1600,
      color: new b2d.Common.b2Color(0, 0.6, 0.6)
    }, {
      width: 1200,
      x: 4200,
      color: new b2d.Common.b2Color(0, 0, 0.6)
    }, {
      width: 800,
      x: 7000,
      color: new b2d.Common.b2Color(0.6, 0, 0.6)
    }, {
      width: 2000,
      x: 10000,
      color: new b2d.Common.b2Color(0.6, 0.6, 0)
    }, {
      width: 100,
      x: 15000,
      color: new b2d.Common.b2Color(0.6, 0, 0)
    }
  ];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    groundInfo = _ref[_i];
    peanutty.createGround({
      x: groundInfo.x,
      y: 400,
      width: groundInfo.width,
      height: 100,
      drawData: {
        color: groundInfo.color
      }
    });
  }

  level.elements.ball = peanutty.createBall({
    x: 200,
    y: 450,
    radius: 20,
    density: 0.2,
    restitution: 0.2,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0.8)
    }
  });

  ballIsInContactWithGround = function() {
    var contactEdge;
    contactEdge = level.elements.ball.GetContactList();
    return (contactEdge != null) && contactEdge.contact.IsTouching();
  };

  level.applyForce = function(x, y) {
    if (x > 0 && level.elements.ball.GetLinearVelocity().x > 50) return;
    if (ballIsInContactWithGround()) {
      return level.elements.ball.ApplyForce(new b2d.Common.Math.b2Vec2(x, y), level.elements.ball.GetWorldCenter());
    }
  };

  upCommand = function() {
    return "level.applyForce(0, " + (level.elements.ball.GetLinearVelocity().x * -10) + ")";
  };

  $(window).bind('keydown', function(e) {
    switch (e.keyCode) {
      case 74:
        return peanutty.addToScript({
          command: "level.applyForce(-40, 0) ",
          time: level.getTimeDiff()
        });
      case 75:
        return peanutty.addToScript({
          command: "level.applyForce(40, 0) ",
          time: level.getTimeDiff()
        });
      case 76:
        return peanutty.addToScript({
          command: "" + (upCommand()),
          time: level.getTimeDiff()
        });
    }
  });

  ballForces = setInterval((function() {
    if (peanutty.screen.worldToScreen(level.elements.ball.GetPosition()).y < peanutty.screen.viewPort.bottom) {
      clearInterval(ballForces);
      if (!(level.elements.success != null) && confirm('Would you like to try again?')) {
        $(window).unbind('keydown');
        view.resetLevel();
        return;
      }
    }
    if (!(ballIsInContactWithGround() && level.elements.ball.GetLinearVelocity().x > 0)) {
      return;
    }
    return level.elements.ball.ApplyForce(new b2d.Common.Math.b2Vec2(-0.2, 0), level.elements.ball.GetWorldCenter());
  }), 20);

  goal = peanutty.createBox({
    x: 15040,
    y: 500,
    height: 50,
    width: 10,
    static: true,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0.8),
      alpha: 0.8
    }
  });

  peanutty.addContactListener({
    listener: function(contact) {
      var fixtures, success, _ref2, _ref3;
      if (level.elements.success != null) return;
      fixtures = [contact.GetFixtureA(), contact.GetFixtureB()];
      if ((_ref2 = level.elements.ball.GetFixtureList(), __indexOf.call(fixtures, _ref2) >= 0) && (_ref3 = goal.GetFixtureList(), __indexOf.call(fixtures, _ref3) >= 0)) {
        success = level.elements.success = $(document.createElement("DIV"));
        success.html("<h4>Excellent!</h4>\n<p>\n    Got a creative solution? \n    Let me know: \n    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>\n</p>\n<p>More levels coming soon...</p>\n<p>\n    ... or <a href='#create'>create your own level!<a> \n</p>");
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

  adjustScreen = function() {
    var ballX, maxLeft, maxRight;
    window.adjustScreenRunning = true;
    maxRight = peanutty.screen.viewPort.right - (peanutty.screen.dimensions.width * 0.8);
    maxLeft = peanutty.screen.viewPort.left + (peanutty.screen.dimensions.width * 0.1);
    ballX = peanutty.screen.worldToScreen(level.elements.ball.GetPosition()).x + (level.elements.ball.GetLinearVelocity().x * 10);
    if (ballX > maxRight) {
      return peanutty.screen.pan({
        x: ballX - maxRight,
        time: 50,
        callback: adjustScreen
      });
    } else if (ballX < maxLeft) {
      return peanutty.screen.pan({
        x: ballX - maxLeft,
        time: 50,
        callback: adjustScreen
      });
    } else {
      return $.timeout(50, adjustScreen);
    }
  };

  if (window.adjustScreenRunning == null) adjustScreen();

  instructions = $(document.createElement("DIV"));

  instructions.css({
    width: "" + (peanutty.canvas.width()) + "px",
    textAlign: 'center',
    position: 'absolute',
    top: '20px',
    left: 0
  });

  header = level.elements.header = $(document.createElement("DIV"));

  header.css({
    height: '30px',
    fontSize: '20pt'
  });

  header.html("Jump from platform to platform.");

  instructions.append(header);

  note = level.elements.note = $(document.createElement("DIV"));

  note.html("Use the 'k' key to move forward, 'j' to move back, and the 'l' key to jump.");

  instructions.append(note);

  level.canvasContainer.append(instructions);

  input = level.elements.input = $(document.createElement("input"));

  input.css({
    position: 'absolute',
    top: 490,
    left: 49,
    height: '1px',
    width: '1px',
    backgroundColor: '#E6E6E6',
    cursor: 'pointer'
  });

  view.el.append(input);

  input[0].focus();

  input[0].blur();

  level.magicPowers = function() {
    var secretNote;
    secretNote = level.elements.secretNote = $(document.createElement("P"));
    secretNote.css({
      color: 'red'
    });
    level.elements.ball.GetFixtureList().SetDrawData({
      color: new b2d.Common.b2Color(1, 0, 0)
    });
    secretNote.html("Magic powers! Now you can fly! When you're in the air hit 'l' to keep going up!");
    instructions.append(secretNote);
    ballIsInContactWithGround = function() {
      return true;
    };
    return upCommand = function() {
      return "level.applyForce(0, -50)";
    };
  };

  input.bind('click', function() {
    return peanutty.addToScript({
      command: "level.magicPowers()",
      time: 0
    });
  });

}).call(this);
