(function() {
  var instructions;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; }, _this = this;

  Peanutty.createEnvironment();

  peanutty.createGround({
    x: peanutty.world.dimensions.width / 2,
    y: 50,
    width: 600,
    height: 10
  });

  instructions = $(document.createElement("DIV"));

  instructions.addClass('level_element');

  instructions.css({
    height: '30px',
    width: '360px',
    textAlign: 'center',
    fontSize: '20pt',
    position: 'absolute',
    top: '20px',
    left: "" + ((peanutty.canvas.width() / 2) - 180) + "px"
  });

  instructions.html("Type your name:");

  view.$('#canvas_container').append(instructions);

  view.nameInput = $(document.createElement('INPUT'));

  view.nameInput.addClass('level_element');

  view.nameInput.css({
    width: '360px',
    height: '30px',
    fontSize: '20pt',
    position: 'absolute',
    top: '50px',
    left: "" + ((peanutty.canvas.width() / 2) - 180) + "px"
  });

  view.levelLetters = '';

  view.nameInput.bind('keyup', function(e) {
    var alreadyCollided, letters;
    var _this = this;
    letters = $(e.currentTarget).val().replace(/[^A-Za-z\s]/ig, '');
    if (letters === view.levelLetters) return;
    view.levelLetters = letters;
    view.loadScript();
    if (view.destroyInstructions != null) {
      view.destroyInstructions.remove();
      view.destroyInstructions = null;
    }
    peanutty.destroyDynamicObjects();
    peanutty.addToScript({
      command: "peanutty.destroyDynamicObjects()\nview.nameInput.val(\"" + letters + "\") if view.nameInput.val() != \"" + letters + "\"\npeanutty.createLetters\n    x: peanutty.world.dimensions.width / 2\n    y: 55\n    letters: \"" + letters + "\"",
      time: 0
    });
    view.lastNameInputKey = new Date();
    $.timeout(1500, function() {
      if (new Date() - view.lastNameInputKey < 1500) return;
      if (view.destroyInstructions != null) return;
      view.destroyInstructions = $(document.createElement("DIV"));
      view.destroyInstructions.addClass('level_element');
      view.destroyInstructions.css({
        height: '30px',
        width: '400px',
        textAlign: 'center',
        fontSize: '11pt',
        position: 'absolute',
        top: '100px',
        left: "" + ((peanutty.canvas.width() / 2) - 200) + "px"
      });
      view.destroyInstructions.html("Now destroy your name!<br/>(click a few times below this but above your name)<br/><br/>");
      return view.$('#canvas_container').append(view.destroyInstructions);
    });
    letters = peanutty.searchObjectList({
      object: peanutty.world.GetBodyList(),
      searchFunction: function(body) {
        return (body.GetUserData() != null) && body.GetUserData().letter;
      }
    });
    alreadyCollided = [];
    return peanutty.addContactListener({
      listener: function(contact) {
        var body, contactedBodies, index, _len, _ref, _results;
        contactedBodies = [contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody()];
        _results = [];
        for (index = 0, _len = contactedBodies.length; index < _len; index++) {
          body = contactedBodies[index];
          if (body.m_I === 0) continue;
          if (__indexOf.call(letters, body) >= 0 || __indexOf.call(alreadyCollided, body) >= 0) {
            continue;
          }
          if (_ref = contactedBodies[1 - index], __indexOf.call(letters, _ref) < 0) {
            continue;
          }
          alreadyCollided.push(body);
          if (!(alreadyCollided.length > 2)) {
            view.destroyInstructions.html(view.destroyInstructions.html() + "Bamm! ");
          }
          if (alreadyCollided.length === 2) {
            view.destroyInstructions.html(view.destroyInstructions.html() + "<br/>Nice job :) When you're ready, head to the <a id='next_level'>next level ></a>");
            _results.push($.timeout(10, function() {
              return view.$('#next_level').bind('click', function() {
                return view.loadNewLevel('simple_bucket');
              });
            }));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    });
  });

  view.$('#canvas_container').append(view.nameInput);

  view.nameInput[0].focus();

  view.codeChangeMessageShown || (view.codeChangeMessageShown = false);

  view.$('#codes .code').bind('keypress', function() {
    if (view.codeChangeMessageShown) return;
    view.codeChangeMessageShown = true;
    return peanutty.sendCodeMessage({
      message: "You've changed the code.\nTo see your changes you'll need to rerun your script by clicking \"Run Script\" above."
    });
  });

  Peanutty.prototype.createLetters = function(_arg) {
    var letter, letterWidth, letters, start, width, x, y, _i, _len, _results;
    x = _arg.x, y = _arg.y, letters = _arg.letters;
    width = this.getLettersWidth({
      letters: letters
    });
    start = x - (width / 2) - (4 * ((letters.length - 1) / 2));
    _results = [];
    for (_i = 0, _len = letters.length; _i < _len; _i++) {
      letter = letters[_i];
      letterWidth = this.getLettersWidth({
        letters: letter
      });
      this.createLetter({
        x: start,
        y: y,
        letter: letter
      });
      _results.push(start += letterWidth + 4);
    }
    return _results;
  };

  Peanutty.prototype.getLettersWidth = function(_arg) {
    var baseWidth, letter, letters, totalWidth, _i, _len;
    letters = _arg.letters;
    totalWidth = 0;
    for (_i = 0, _len = letters.length; _i < _len; _i++) {
      letter = letters[_i];
      if (letter === ' ') {
        totalWidth += 25;
      } else {
        baseWidth = letter.toLowerCase() === letter ? 50 : 60;
        totalWidth += (function() {
          switch (letter) {
            case 'a':
              return 70;
            case 'A':
              return 78;
            case 'd':
            case 'h':
            case 'l':
            case 'o':
            case 'r':
              return 40;
            case 'W':
              return 80;
            default:
              return baseWidth;
          }
        })();
      }
    }
    return totalWidth;
  };

  Peanutty.prototype.createLetter = function(_arg) {
    var letter, x, y;
    x = _arg.x, y = _arg.y, letter = _arg.letter;
    switch (letter) {
      case "a":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x + 28,
                  y: y + 70
                }, {
                  x: x + 40,
                  y: y + 70
                }, {
                  x: x + 13,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 26,
                  y: y + 32
                }, {
                  x: x + 21,
                  y: y + 20
                }, {
                  x: x + 34,
                  y: y + 20
                }, {
                  x: x + 34,
                  y: y + 32
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 40,
                  y: y + 70
                }, {
                  x: x + 34,
                  y: y + 54
                }, {
                  x: x + 56,
                  y: y
                }, {
                  x: x + 70,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 34,
                  y: y + 32
                }, {
                  x: x + 34,
                  y: y + 20
                }, {
                  x: x + 47,
                  y: y + 20
                }, {
                  x: x + 43,
                  y: y + 32
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
      case "A":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x + 33,
                  y: y + 90
                }, {
                  x: x + 48,
                  y: y + 90
                }, {
                  x: x + 13,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 26,
                  y: y + 32
                }, {
                  x: x + 22,
                  y: y + 20
                }, {
                  x: x + 42,
                  y: y + 20
                }, {
                  x: x + 42,
                  y: y + 32
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 48,
                  y: y + 90
                }, {
                  x: x + 42,
                  y: y + 73
                }, {
                  x: x + 64,
                  y: y
                }, {
                  x: x + 78,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 42,
                  y: y + 32
                }, {
                  x: x + 42,
                  y: y + 20
                }, {
                  x: x + 57,
                  y: y + 20
                }, {
                  x: x + 54,
                  y: y + 32
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
      case "b":
        this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 45,
          y: y + 20,
          width: 5,
          height: 10,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 35,
          y: y + 35,
          width: 10,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 45,
          y: y + 50,
          width: 5,
          height: 10,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "B":
        this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 45,
          width: 10,
          height: 35,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 55,
          y: y + 25,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 40,
          y: y + 45,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 55,
          y: y + 65,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "c":
        this.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 35,
          width: 10,
          height: 25,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 4,
          y: y + 74,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "C":
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 45,
          width: 10,
          height: 35,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 6,
          y: y + 92,
          width: 8,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "d":
        this.createBox({
          x: x + 20,
          y: y + 5,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 35,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 20,
          y: y + 65,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "D":
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 55,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "e":
        this.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 20,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 20,
          y: y + 35,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 50,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 4,
          y: y + 74,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "E":
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 25,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 20,
          y: y + 45,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 65,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 4,
          y: y + 91,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "f":
        this.createBox({
          x: x + 10,
          y: y + 15,
          width: 10,
          height: 15,
          userData: {
            letter: true
          },
          density: 10
        });
        this.createBox({
          x: x + 20,
          y: y + 35,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 50,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 4,
          y: y + 74,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "F":
        this.createBox({
          x: x + 10,
          y: y + 20,
          width: 10,
          height: 20,
          userData: {
            letter: true
          },
          density: 10
        });
        this.createBox({
          x: x + 20,
          y: y + 45,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 65,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 4,
          y: y + 91,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "g":
        this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 7,
          y: y + 35,
          width: 7,
          height: 25,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 45,
          y: y + 20,
          width: 5,
          height: 10,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 35,
          y: y + 35,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 45,
          y: y + 40,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
        this.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 5,
          y: y + 74,
          width: 8,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "G":
        this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 45,
          width: 10,
          height: 35,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 55,
          y: y + 25,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 45,
          y: y + 45,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 55,
          y: y + 52,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 5,
          y: y + 92,
          width: 8,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "h":
        this.createBox({
          x: x + 5,
          y: y + 15,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 35,
          y: y + 15,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 20,
          y: y + 35,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 55,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 35,
          y: y + 55,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
      case "H":
        this.createBox({
          x: x + 10,
          y: y + 20,
          width: 10,
          height: 20,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 50,
          y: y + 20,
          width: 10,
          height: 20,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 30,
          y: y + 45,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 70,
          width: 10,
          height: 20,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 50,
          y: y + 70,
          width: 10,
          height: 20,
          userData: {
            letter: true
          }
        });
      case "i":
        this.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 25,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "I":
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 30,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "j":
        this.createBox({
          x: x + 15,
          y: y + 5,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 4,
          y: y + 18,
          width: 5,
          height: 8,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 25,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "J":
        this.createBox({
          x: x + 17,
          y: y + 5,
          width: 18,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 4,
          y: y + 18,
          width: 5,
          height: 8,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 30,
          y: y + 40,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "k":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y + 30
                }, {
                  x: x + 10,
                  y: y + 40
                }, {
                  x: x + 40,
                  y: y + 70
                }, {
                  x: x + 50,
                  y: y + 70
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          path: [
            {
              x: x + 10,
              y: y + 30
            }, {
              x: x + 15,
              y: y + 35
            }, {
              x: x + 50,
              y: y
            }, {
              x: x + 40,
              y: y
            }
          ],
          userData: {
            letter: true
          }
        });
      case "K":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y + 40
                }, {
                  x: x + 10,
                  y: y + 50
                }, {
                  x: x + 50,
                  y: y + 90
                }, {
                  x: x + 60,
                  y: y + 90
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          path: [
            {
              x: x + 10,
              y: y + 40
            }, {
              x: x + 15,
              y: y + 45
            }, {
              x: x + 60,
              y: y
            }, {
              x: x + 50,
              y: y
            }
          ],
          userData: {
            letter: true
          }
        });
      case "l":
        this.createBox({
          x: x + 20,
          y: y + 5,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
      case "L":
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 5,
          y: y + 50,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
      case "m":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y + 55
                }, {
                  x: x + 10,
                  y: y + 70
                }, {
                  x: x + 25,
                  y: y + 40
                }, {
                  x: x + 25,
                  y: y + 25
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 40,
                  y: y
                }, {
                  x: x + 40,
                  y: y + 70
                }, {
                  x: x + 50,
                  y: y + 70
                }, {
                  x: x + 50,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 25,
                  y: y + 25
                }, {
                  x: x + 25,
                  y: y + 40
                }, {
                  x: x + 40,
                  y: y + 70
                }, {
                  x: x + 40,
                  y: y + 55
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
      case "M":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y + 75
                }, {
                  x: x + 10,
                  y: y + 90
                }, {
                  x: x + 30,
                  y: y + 60
                }, {
                  x: x + 30,
                  y: y + 45
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 50,
                  y: y
                }, {
                  x: x + 50,
                  y: y + 90
                }, {
                  x: x + 60,
                  y: y + 90
                }, {
                  x: x + 60,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y + 45
                }, {
                  x: x + 30,
                  y: y + 60
                }, {
                  x: x + 50,
                  y: y + 90
                }, {
                  x: x + 50,
                  y: y + 75
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
      case "n":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y + 55
                }, {
                  x: x + 40,
                  y: y
                }, {
                  x: x + 40,
                  y: y + 15
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          path: [
            {
              x: x + 40,
              y: y
            }, {
              x: x + 40,
              y: y + 70
            }, {
              x: x + 50,
              y: y + 70
            }, {
              x: x + 50,
              y: y
            }
          ],
          userData: {
            letter: true
          }
        });
      case "N":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y + 75
                }, {
                  x: x + 50,
                  y: y
                }, {
                  x: x + 50,
                  y: y + 15
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          path: [
            {
              x: x + 50,
              y: y
            }, {
              x: x + 50,
              y: y + 90
            }, {
              x: x + 60,
              y: y + 90
            }, {
              x: x + 60,
              y: y
            }
          ],
          userData: {
            letter: true
          }
        });
      case "o":
        this.createBox({
          x: x + 20,
          y: y + 5,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 35,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 20,
          y: y + 65,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "O":
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 55,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "p":
        this.createBox({
          x: x + 17,
          y: y + 30,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 60
                }, {
                  x: x,
                  y: y + 70
                }, {
                  x: x + 50,
                  y: y + 70
                }, {
                  x: x + 50,
                  y: y + 60
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 50,
                  y: y + 60
                }, {
                  x: x + 50,
                  y: y + 40
                }, {
                  x: x + 40,
                  y: y + 40
                }, {
                  x: x + 40,
                  y: y + 60
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 50,
                  y: y + 40
                }, {
                  x: x + 50,
                  y: y + 30
                }, {
                  x: x + 22,
                  y: y + 30
                }, {
                  x: x + 22,
                  y: y + 40
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 4,
          y: y + 72,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "P":
        this.createBox({
          x: x + 17,
          y: y + 40,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 80
                }, {
                  x: x,
                  y: y + 90
                }, {
                  x: x + 60,
                  y: y + 90
                }, {
                  x: x + 60,
                  y: y + 80
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 60,
                  y: y + 80
                }, {
                  x: x + 60,
                  y: y + 50
                }, {
                  x: x + 50,
                  y: y + 50
                }, {
                  x: x + 50,
                  y: y + 80
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 60,
                  y: y + 50
                }, {
                  x: x + 60,
                  y: y + 40
                }, {
                  x: x + 22,
                  y: y + 40
                }, {
                  x: x + 22,
                  y: y + 50
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 4,
          y: y + 92,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 30
        });
      case "q":
        this.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 40,
                  y: y + 10
                }, {
                  x: x + 40,
                  y: y + 60
                }, {
                  x: x + 50,
                  y: y + 60
                }, {
                  x: x + 50,
                  y: y + 10
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 20,
                  y: y + 40
                }, {
                  x: x + 30,
                  y: y + 40
                }, {
                  x: x + 40,
                  y: y + 20
                }, {
                  x: x + 40,
                  y: y + 10
                }, {
                  x: x + 35,
                  y: y + 10
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "Q":
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 50,
                  y: y + 10
                }, {
                  x: x + 50,
                  y: y + 70
                }, {
                  x: x + 60,
                  y: y + 70
                }, {
                  x: x + 60,
                  y: y + 10
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y + 40
                }, {
                  x: x + 40,
                  y: y + 40
                }, {
                  x: x + 50,
                  y: y + 20
                }, {
                  x: x + 50,
                  y: y + 10
                }, {
                  x: x + 45,
                  y: y + 10
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 30,
          y: y + 75,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "r":
        this.createBox({
          x: x + 5,
          y: y + 20,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 28,
          y: y + 5,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 25,
          y: y + 25,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 35,
          y: y + 40,
          width: 5,
          height: 10,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 20,
          y: y + 55,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "R":
        this.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 35,
          y: y + 20,
          width: 5,
          height: 20,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 35,
          y: y + 45,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 55,
          y: y + 65,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "s":
        this.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 40,
          y: y + 20,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 25,
          y: y + 35,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 47,
          y: y + 42,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 50
        });
        this.createBox({
          x: x + 10,
          y: y + 50,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 4,
          y: y + 72,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "S":
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 50,
          y: y + 25,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 30,
          y: y + 45,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 57,
          y: y + 52,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 80
        });
        this.createBox({
          x: x + 10,
          y: y + 65,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 4,
          y: y + 92,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
      case "t":
        this.createBox({
          x: x + 25,
          y: y + 30,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 25,
          y: y + 60,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "T":
        this.createBox({
          x: x + 30,
          y: y + 40,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 30,
          y: y + 80,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "u":
        this.createBox({
          x: x + 20,
          y: y + 5,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 35,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
      case "U":
        this.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 50,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 55,
          y: y + 50,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
      case "v":
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y + 70
                }, {
                  x: x + 25,
                  y: y + 20
                }, {
                  x: x + 25,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 25,
                  y: y
                }, {
                  x: x + 25,
                  y: y + 20
                }, {
                  x: x + 40,
                  y: y + 70
                }, {
                  x: x + 50,
                  y: y + 70
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
      case "V":
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y + 90
                }, {
                  x: x + 30,
                  y: y + 20
                }, {
                  x: x + 30,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y
                }, {
                  x: x + 30,
                  y: y + 20
                }, {
                  x: x + 50,
                  y: y + 90
                }, {
                  x: x + 60,
                  y: y + 90
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
      case "w":
        this.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 45,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 25,
          y: y + 25,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
      case "W":
        this.createBox({
          x: x + 40,
          y: y + 5,
          width: 40,
          height: 5,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 10,
          y: y + 45,
          width: 10,
          height: 40,
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 70,
          y: y + 45,
          width: 10,
          height: 40,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 40,
          y: y + 20,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
      case "x":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x + 20,
                  y: y + 35
                }, {
                  x: x + 30,
                  y: y + 35
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y + 35
                }, {
                  x: x + 50,
                  y: y
                }, {
                  x: x + 40,
                  y: y
                }, {
                  x: x + 25,
                  y: y + 25
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y + 70
                }, {
                  x: x + 30,
                  y: y + 35
                }, {
                  x: x + 20,
                  y: y + 35
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 25,
                  y: y + 45
                }, {
                  x: x + 40,
                  y: y + 70
                }, {
                  x: x + 50,
                  y: y + 70
                }, {
                  x: x + 30,
                  y: y + 35
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
      case "X":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x + 25,
                  y: y + 45
                }, {
                  x: x + 35,
                  y: y + 45
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 35,
                  y: y + 45
                }, {
                  x: x + 60,
                  y: y
                }, {
                  x: x + 50,
                  y: y
                }, {
                  x: x + 30,
                  y: y + 35
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y + 90
                }, {
                  x: x + 35,
                  y: y + 45
                }, {
                  x: x + 25,
                  y: y + 45
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y + 55
                }, {
                  x: x + 50,
                  y: y + 90
                }, {
                  x: x + 60,
                  y: y + 90
                }, {
                  x: x + 35,
                  y: y + 45
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
      case "y":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 70
                }, {
                  x: x + 10,
                  y: y + 70
                }, {
                  x: x + 30,
                  y: y + 35
                }, {
                  x: x + 20,
                  y: y + 35
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 25,
                  y: y + 45
                }, {
                  x: x + 40,
                  y: y + 70
                }, {
                  x: x + 50,
                  y: y + 70
                }, {
                  x: x + 30,
                  y: y + 35
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 25,
          y: y + 17,
          width: 5,
          height: 17,
          userData: {
            letter: true
          }
        });
      case "Y":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y + 90
                }, {
                  x: x + 35,
                  y: y + 45
                }, {
                  x: x + 25,
                  y: y + 45
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y + 55
                }, {
                  x: x + 50,
                  y: y + 90
                }, {
                  x: x + 60,
                  y: y + 90
                }, {
                  x: x + 35,
                  y: y + 45
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 30,
          y: y + 22,
          width: 5,
          height: 22,
          userData: {
            letter: true
          }
        });
      case "z":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x,
                  y: y + 10
                }, {
                  x: x + 50,
                  y: y + 10
                }, {
                  x: x + 50,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 10
                }, {
                  x: x + 40,
                  y: y + 60
                }, {
                  x: x + 50,
                  y: y + 60
                }, {
                  x: x + 10,
                  y: y + 10
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 47,
          y: y + 72,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 50
        });
      case "Z":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y
                }, {
                  x: x,
                  y: y + 10
                }, {
                  x: x + 60,
                  y: y + 10
                }, {
                  x: x + 60,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y + 10
                }, {
                  x: x + 50,
                  y: y + 90
                }, {
                  x: x + 60,
                  y: y + 90
                }, {
                  x: x + 10,
                  y: y + 10
                }
              ]
            })
          ],
          userData: {
            letter: true
          }
        });
        this.createBox({
          x: x + 30,
          y: y + 95,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return this.createBox({
          x: x + 57,
          y: y + 102,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 50
        });
    }
  };

  peanutty.createLetters({
    x: peanutty.world.dimensions.width / 2,
    y: 55,
    letters: 'Hello World'
  });

  peanutty.sign('@jaredcosulich', 'jaredcosulich');

}).call(this);
