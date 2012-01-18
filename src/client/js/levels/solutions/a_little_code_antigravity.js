
  Peanutty.loadLevel();

  peanutty.wait(1000);

  peanutty.world.SetGravity(new b2d.Common.Math.b2Vec2(0, -0.1));

  level.pullBackStriker();

  peanutty.wait(1000);

  level.releaseStriker();
