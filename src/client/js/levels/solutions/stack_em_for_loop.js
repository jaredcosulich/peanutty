(function() {
  var i;

  Peanutty.loadLevel();

  peanutty.wait(1000);

  for (i = 0; i <= 10; i++) {
    peanutty.createBox({
      x: peanutty.screen.dimensions.width / 2,
      y: 200 + (i * 42),
      width: 10 + (200 * Math.random()),
      height: 20,
      static: false
    });
  }

}).call(this);
