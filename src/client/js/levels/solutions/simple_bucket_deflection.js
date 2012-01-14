(function() {
  var angle, cannonball, force, x, y;

  Peanutty.loadLevel();

  peanutty.wait(1000);

  peanutty.createPoly({
    path: [
      {
        x: 190,
        y: 540
      }, {
        x: 200,
        y: 500
      }, {
        x: 375,
        y: 520
      }, {
        x: 365,
        y: 560
      }
    ],
    static: true
  });

  peanutty.createPoly({
    path: [
      {
        x: 740,
        y: 420
      }, {
        x: 715,
        y: 295
      }, {
        x: 740,
        y: 285
      }, {
        x: 770,
        y: 410
      }
    ],
    static: true
  });

  cannonball = peanutty.createBall({
    x: 125,
    y: 133,
    radius: 10,
    density: 50,
    drawData: {
      color: new b2d.Common.b2Color(0.1, 0.1, 0.1),
      alpha: 0.8
    }
  });

  angle = 70;

  force = 40;

  x = Math.cos(Math.PI / (180 / angle)) * force;

  y = -1 * Math.sin(Math.PI / (180 / angle)) * force;

  cannonball.SetLinearVelocity(new b2d.Common.Math.b2Vec2(x, y));

}).call(this);
