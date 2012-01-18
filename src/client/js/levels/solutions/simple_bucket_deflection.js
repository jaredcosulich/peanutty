
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

  level.fireCannon({
    angle: 70,
    force: 40
  });
