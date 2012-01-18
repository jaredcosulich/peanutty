
  Peanutty.loadLevel();

  peanutty.wait(1000);

  peanutty.createPoly({
    path: [
      {
        x: 452.3173431734317,
        y: 382.06642066420665
      }, {
        x: 605.1439114391144,
        y: 308.11808118081177
      }, {
        x: 454.78228782287823,
        y: 311.8154981549815
      }
    ],
    static: true
  });

  level.fireCannon({
    angle: 70,
    force: 15
  });
