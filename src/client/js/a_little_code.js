(function() {
  var ball;

  view.level = 'a_little_code';

  Peanutty.createEnvironment();

  peanutty.setScale(25);

  peanutty.createGround({
    x: 200,
    y: 20,
    width: 300,
    height: 10
  });

  peanutty.createGround({
    x: 600,
    y: 20,
    width: 300,
    height: 10
  });

  ball = peanutty.createBall({
    x: 80,
    y: 40,
    radius: 20,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0.8),
      alpha: 0.8
    }
  });

}).call(this);
