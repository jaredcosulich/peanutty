
  Peanutty.loadLevel();

  peanutty.wait(1000);

  peanutty.createPoly({
    path: [
      {
        x: 270,
        y: 35
      }, {
        x: 370,
        y: 70
      }, {
        x: 370,
        y: 35
      }
    ]
  });

  level.pullBackStriker();

  peanutty.wait(2000);

  level.releaseStriker();
