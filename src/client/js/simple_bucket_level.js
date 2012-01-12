(function() {
  var ball, bucket, bucketBottom, cannon, cannonControl, title;
  var _this = this, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  view.level = 'simple_bucket';

  Peanutty.createEnvironment();

  peanutty.setScale(25);

  peanutty.createGround({
    x: 60,
    y: 20,
    width: 100,
    height: 10
  });

  peanutty.createBall({
    x: 80,
    y: 40,
    radius: 15,
    static: true
  });

  cannon = peanutty.createBox({
    x: 70,
    y: 80,
    width: 60,
    height: 20,
    static: true
  });

  cannon.SetPositionAndAngle(cannon.GetPosition(), Math.PI * 3 / 4);

  peanutty.createGround({
    x: 400,
    y: 400,
    width: 100,
    height: 10
  });

  ball = peanutty.createBall({
    x: 400,
    y: 440,
    radius: 20,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0.8),
      alpha: 0.8
    }
  });

  bucket = peanutty.createPoly({
    fixtureDefs: [
      peanutty.polyFixtureDef({
        path: [
          {
            x: 600,
            y: 280
          }, {
            x: 610,
            y: 280
          }, {
            x: 610,
            y: 180
          }, {
            x: 600,
            y: 180
          }
        ]
      }), peanutty.polyFixtureDef({
        path: [
          {
            x: 610,
            y: 190
          }, {
            x: 700,
            y: 190
          }, {
            x: 700,
            y: 180
          }, {
            x: 610,
            y: 180
          }
        ],
        userData: {
          bottom: true
        }
      }), peanutty.polyFixtureDef({
        path: [
          {
            x: 700,
            y: 280
          }, {
            x: 710,
            y: 280
          }, {
            x: 710,
            y: 180
          }, {
            x: 700,
            y: 180
          }
        ]
      })
    ],
    static: true
  });

  bucketBottom = peanutty.searchObjectList({
    object: bucket.GetFixtureList(),
    searchFunction: function(fixture) {
      return (fixture.GetUserData() != null) && fixture.GetUserData().bottom;
    },
    limit: 1
  })[0];

  peanutty.addContactListener({
    listener: function(contact) {
      var fixtures, success, _ref;
      if (view.level !== 'simple_bucket') return;
      fixtures = [contact.GetFixtureA(), contact.GetFixtureB()];
      if ((_ref = ball.GetFixtureList(), __indexOf.call(fixtures, _ref) >= 0) && __indexOf.call(fixtures, bucketBottom) >= 0) {
        success = $(document.createElement("DIV"));
        success.addClass('level_element');
        success.css({
          textAlign: 'center',
          position: 'absolute',
          top: '276px',
          left: '390px'
        });
        success.html("<h4>Success! Nice Job!</h4>\n<p>\n    Got a creative solution? \n    Let me know: \n    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>\n</p>\n<br/><br/><br/><br/><br/>\n<p>More levels coming soon...</p>\n<p>\n    ... or <a href='#create'>create your own level!<a> \n</p>");
        return view.$('#canvas_container').append(success);
      }
    }
  });

  title = view.levelElements.title = $(document.createElement("DIV"));

  title.css({
    width: '500px',
    textAlign: 'center',
    fontSize: '20pt',
    position: 'absolute',
    top: '20px',
    left: "" + ((peanutty.canvas.width() / 2) - 250) + "px"
  });

  title.html("Get the Blue Ball in to the Bucket");

  view.$('#canvas_container').append(title);

  cannonControl = view.levelElements.cannonControl = $(document.createElement("DIV"));

  cannonControl.css({
    fontSize: '12pt',
    position: 'absolute',
    top: '60px',
    left: "20px"
  });

  cannonControl.html("<h5>Cannon Controls</h5>\n<p>Angle: <input id='cannon_angle' type='text' style='width: 2em' value=45 />&deg;</p>\n<p>Force: <input id='cannon_force' type='text' style='width: 2em' value=10 /></p>\n<a id='fire_cannon' class=\"btn error\">\n    Fire Cannon!\n</a>\n<a id='try_again' class=\"btn primary\" style='display: none;'>\n    Try Again\n</a>    ");

  view.$('#canvas_container').append(cannonControl);

  view.$('#fire_cannon').bind('click', function() {
    peanutty.addToScript({
      command: "cannonball = peanutty.createBall\n    x: 125\n    y: 133\n    radius: 10\n    density: 50\n    drawData: {color: new b2d.Common.b2Color(0.1, 0.1, 0.1), alpha: 0.8}\n\nangle = " + (view.$('#cannon_angle').val()) + "\nforce = " + (view.$('#cannon_force').val()) + "\nx = Math.cos(Math.PI/(180 / angle)) * force\ny = -1 * Math.sin(Math.PI/(180 / angle)) * force\ncannonball.SetLinearVelocity(new b2d.Common.Math.b2Vec2(x,y))",
      time: 0
    });
    view.$('#fire_cannon').hide();
    return view.$('#try_again').show();
  });

  view.$('#try_again').bind('click', function() {
    var angleVal, forceVal;
    angleVal = view.$('#cannon_angle').val();
    forceVal = view.$('#cannon_force').val();
    view.resetLevel();
    view.$('#cannon_angle').val(angleVal);
    view.$('#cannon_force').val(forceVal);
    view.$('#try_again').hide();
    return view.$('#fire_cannon').show();
  });

  peanutty.sign('@jaredcosulich', 'jaredcosulich');

}).call(this);
