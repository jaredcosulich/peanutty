(function() {
  var createStar, header, instructions, note, scale, starInfo;
  var _this = this;

  level.name = 'stack_em';

  Peanutty.createEnvironment();

  scale = 20 * (peanutty.canvas.width() / 835);

  peanutty.screen.setScale(scale);

  createStar = function(_arg) {
    var i, path, points, radius, star, totalPoints, x, y;
    x = _arg.x, y = _arg.y, radius = _arg.radius, totalPoints = _arg.totalPoints;
    path = [];
    points = totalPoints / 4;
    for (i = 0; 0 <= points ? i <= points : i >= points; 0 <= points ? i++ : i--) {
      path.push({
        x: x,
        y: y
      });
      path.push({
        x: x + (radius * Math.pow(i / points, 0.6)),
        y: y - (radius * Math.pow((points - i) / points, 0.6))
      });
      path.push({
        x: x,
        y: y
      });
      path.push({
        x: x - (radius * Math.pow(i / points, 0.6)),
        y: y - (radius * Math.pow((points - i) / points, 0.6))
      });
      path.push({
        x: x,
        y: y
      });
      path.push({
        x: x - (radius * Math.pow(i / points, 0.6)),
        y: y + (radius * Math.pow((points - i) / points, 0.6))
      });
      path.push({
        x: x,
        y: y
      });
      path.push({
        x: x + (radius * Math.pow(i / points, 0.6)),
        y: y + (radius * Math.pow((points - i) / points, 0.6))
      });
    }
    star = {
      start: {
        x: x,
        y: y
      },
      path: path
    };
    return peanutty.addTempShape(star);
  };

  starInfo = {
    x: peanutty.screen.dimensions.width / 2,
    y: 600,
    radius: 12,
    totalPoints: 8
  };

  window.star = createStar(starInfo);

  peanutty.createGround({
    x: peanutty.screen.dimensions.width / 2,
    y: 50,
    width: 600,
    height: 10
  });

  peanutty.createBall({
    x: peanutty.screen.dimensions.width / 2,
    y: 75,
    radius: 20
  });

  peanutty.createBox({
    x: peanutty.screen.dimensions.width / 2,
    y: 100,
    width: 150,
    height: 5
  });

  peanutty.createBox({
    x: peanutty.screen.dimensions.width / 2,
    y: 140,
    width: 20,
    height: 20
  });

  peanutty.createBox({
    x: peanutty.screen.dimensions.width / 2,
    y: 200,
    width: 20,
    height: 20
  });

  setInterval((function() {
    var point, _i, _len, _ref, _results;
    if (level.elements.success) return;
    _ref = star.path;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      point = _ref[_i];
      _results.push(peanutty.world.QueryPoint((function(fixture) {
        var success;
        if (fixture.GetBody().IsAwake()) return true;
        if (level.elements.success) return false;
        success = level.elements.success = $(document.createElement("DIV"));
        success.html("<h4>Way to go!</h4>\n<p>\n    Got a creative solution? \n    Let me know: \n    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>\n</p>\n<p>More levels coming soon...</p>\n<p>\n    ... or <a href='#create'>create your own level!<a> \n</p>");
        success.css({
          textAlign: 'center',
          position: 'absolute',
          top: '100px',
          left: '10px'
        });
        return level.canvasContainer.append(success);
      }), point));
    }
    return _results;
  }), 100);

  instructions = $(document.createElement("DIV"));

  instructions.css({
    width: "" + (peanutty.canvas.width()) + "px",
    textAlign: 'center',
    position: 'absolute',
    top: '20px',
    left: 0
  });

  header = level.elements.header = $(document.createElement("DIV"));

  header.css({
    height: '30px',
    fontSize: '20pt'
  });

  header.html("Build a stable tower that reaches the star.");

  instructions.append(header);

  note = level.elements.note = $(document.createElement("DIV"));

  note.html("The tower will turn gray when it is stable (not about to fall over).<br/>Hint: this is a lot easier if you write some code.");

  instructions.append(note);

  level.canvasContainer.append(instructions);

  view.$('#tools #box').click();

  peanutty.sign('@jaredcosulich', 'jaredcosulich');

}).call(this);
