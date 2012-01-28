(function() {
  var adjustScreen, ballIsInContactWithGround, ballResistance, groundInfo, header, input, instructions, note, scale, _i, _len, _ref;
  var _this = this;

  view.level = 'ball_jump';

  Peanutty.createEnvironment();

  scale = 15 * (peanutty.canvas.width() / 835);

  peanutty.screen.setScale(scale);

  _ref = [
    {
      width: 600,
      x: 300
    }, {
      width: 900,
      x: 1600
    }, {
      width: 1200,
      x: 4200
    }, {
      width: 800,
      x: 7000
    }, {
      width: 2000,
      x: 10000
    }, {
      width: 100,
      x: 15000
    }
  ];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    groundInfo = _ref[_i];
    peanutty.createGround({
      x: groundInfo.x,
      y: 400,
      width: groundInfo.width,
      height: 100
    });
  }

  level.elements.ball = peanutty.createBall({
    x: 200,
    y: 450,
    radius: 20,
    density: 0.2,
    restitution: 0.2
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

  $(window).bind('keydown', function(e) {
    switch (e.keyCode) {
      case 75:
        return peanutty.addToScript({
          command: "level.applyForce(40, 0) ",
          time: level.getTimeDiff()
        });
      case 76:
        return peanutty.addToScript({
          command: "level.applyForce(0, " + (level.elements.ball.GetLinearVelocity().x * -10) + ") ",
          time: level.getTimeDiff()
        });
    }
  });

  ballResistance = setInterval((function() {
    if (peanutty.screen.worldToScreen(level.elements.ball.GetPosition()).y < peanutty.screen.viewPort.bottom) {
      clearInterval(ballResistance);
      if (confirm('Would you like to try again?')) {
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

  adjustScreen = function() {
    var ballX, maxLeft, maxRight;
    window.adjustScreenRunning = true;
    maxRight = peanutty.screen.viewPort.right - (peanutty.screen.dimensions.width * 0.8);
    maxLeft = peanutty.screen.viewPort.left;
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

  input = level.elements.input = $(document.createElement("input"));

  input.css({
    position: 'absolute',
    top: 664,
    left: 49,
    height: '1px',
    width: '1px'
  });

  view.el.append(input);

  input[0].focus();

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

  note.html("Use the 'k' key to move forward and the 'l' key to jump.");

  instructions.append(note);

  level.canvasContainer.append(instructions);

}).call(this);
