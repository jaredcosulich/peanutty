
  Peanutty.loadLevel();

  peanutty.wait(1000);

  peanutty.createPoly({
    path: [
      {
        x: 450,
        y: 380
      }, {
        x: 605,
        y: 310
      }, {
        x: 450,
        y: 310
      }
    ],
    static: true
  });

  level.fireCannon({
    angle: 70,
    force: 15
  });
