(function() {
  var _this = this;

  Peanutty.loadLevel();

  peanutty.wait(1000);

  peanutty.world.SetGravity(new b2d.Common.Math.b2Vec2(0, -0.1));

  clearInterval(view.strikerInterval);

  view.strikerInterval = setInterval((function() {
    var changeVec;
    if (view.striker.GetPosition().x < -2.5) clearInterval(view.strikerInterval);
    changeVec = new b2d.Common.Math.b2Vec2((view.striker.GetPosition().x + 2.5) / 50, 0);
    return view.striker.GetPosition().Subtract(changeVec);
  }), 10);

  peanutty.wait(1000);

  clearInterval(view.strikerInterval);

  view.striker.SetAwake(true);

  view.striker.SetLinearVelocity(new b2d.Common.Math.b2Vec2(view.striker.GetPosition().x * -10, 0));

  view.strikerInterval = setInterval((function() {
    var changeVec;
    if (view.striker.GetPosition().x < 0 && !view.striker.IsAwake()) {
      clearInterval(view.strikerInterval);
    }
    if (view.striker.GetPosition().x > 1 || !view.striker.IsAwake()) {
      view.striker.SetAwake(false);
      changeVec = new b2d.Common.Math.b2Vec2(0.01, 0);
      return view.striker.GetPosition().Subtract(changeVec);
    }
  }), 10);

}).call(this);
