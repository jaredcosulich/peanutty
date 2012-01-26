(function() {
  var ball, groundInfo, input, scale, _i, _len, _ref;
  var _this = this;

  view.level = 'ball_jump';

  Peanutty.createEnvironment();

  scale = 20 * (peanutty.canvas.width() / 835);

  peanutty.screen.setScale(scale);

  _ref = [
    {
      width: 600,
      x: 300
    }, {
      width: 800,
      x: 1300
    }, {
      width: 400,
      x: 2200
    }
  ];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    groundInfo = _ref[_i];
    peanutty.createGround({
      x: groundInfo.x,
      y: 150,
      width: groundInfo.width,
      height: 100
    });
  }

  ball = peanutty.createBall({
    x: 200,
    y: 200,
    radius: 20
  });

  $(window).bind('keydown', function(e) {
    switch (e.keyCode) {
      case 75:
        if (ball.GetContactList() != null) {
          return ball.ApplyForce(new b2d.Common.Math.b2Vec2(200, 0), ball.GetWorldCenter());
        }
        break;
      case 76:
        if (ball.GetContactList() != null) {
          return ball.ApplyForce(new b2d.Common.Math.b2Vec2(0, -300), ball.GetWorldCenter());
        }
        break;
    }
  });

  setInterval((function() {
    return console.log(peanutty.screen.screenToCanvas(ball.GetPosition()).x, peanutty.screen.dimensions.width);
  }), 2000);

  input = $(document.createElement("input"));

  input.css({
    position: 'absolute',
    top: -100,
    left: -100
  });

  view.el.append(input);

  input[0].focus();

}).call(this);
