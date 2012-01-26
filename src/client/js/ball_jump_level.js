(function() {
  var header, instructions, note, scale;
  var _this = this;

  view.level = 'ball_jump';

  Peanutty.createEnvironment();

  view.level = 'stack_em';

  Peanutty.createEnvironment();

  scale = 30 * (peanutty.canvas.width() / 835);

  peanutty.screen.setScale(scale);

  peanutty.createGround({
    x: peanutty.world.dimensions.width / 2,
    y: 50,
    width: 600,
    height: 10
  });

  peanutty.createBall({
    x: peanutty.world.dimensions.width / 2,
    y: 75,
    radius: 20
  });

  peanutty.createBox({
    x: peanutty.world.dimensions.width / 2,
    y: 100,
    width: 150,
    height: 5
  });

  peanutty.createBox({
    x: peanutty.world.dimensions.width / 2,
    y: 140,
    width: 20,
    height: 20
  });

  peanutty.createBox({
    x: peanutty.world.dimensions.width / 2,
    y: 200,
    width: 20,
    height: 20
  });

  setInterval((function() {
    var body, _results;
    body = peanutty.world.GetBodyList();
    _results = [];
    while (body != null) {
      if (!body.IsAwake()) {
        body.GetPosition().Subtract(new b2d.Common.Math.b2Vec2(0.01, 0));
      }
      _results.push(body = body.GetNext());
    }
    return _results;
  }), 10);

  instructions = $(document.createElement("DIV"));

  instructions.css({
    width: "" + (peanutty.canvas.width()) + "px",
    textAlign: 'center',
    position: 'absolute',
    top: '20px',
    left: 0
  });

  header = view.levelElements.header = $(document.createElement("DIV"));

  header.css({
    height: '30px',
    fontSize: '20pt'
  });

  header.html("Build a stable tower that reaches the star.");

  instructions.append(header);

  note = view.levelElements.note = $(document.createElement("DIV"));

  note.html("The tower will turn gray when it is stable (not about to fall over).<br/>Hint: this is a lot easier if you write some code.");

  instructions.append(note);

  view.$('#canvas_container').append(instructions);

  view.$('#tools #box').click();

  peanutty.sign('@jaredcosulich', 'jaredcosulich');

}).call(this);
