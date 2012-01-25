(function() {
  var instructions, nameInput;
  var _this = this, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  level.name = 'hello_world';

  Peanutty.createEnvironment();

  peanutty.setScale(30 * (peanutty.canvas.width() / 835));

  peanutty.createGround({
    x: peanutty.world.dimensions.width / 2,
    y: 50,
    width: 600,
    height: 10
  });

  instructions = level.elements.instructions = $(document.createElement("DIV"));

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

  level.canvasContainer.append(instructions);

  nameInput = level.elements.nameInput = $(document.createElement('INPUT'));

  nameInput.css({
    width: '360px',
    height: '30px',
    fontSize: '20pt',
    position: 'absolute',
    top: '50px',
    left: "" + ((peanutty.canvas.width() / 2) - 180) + "px"
  });

  view.alreadyCollided = [];

  view.levelLetters = '';

  nameInput.bind('keyup', function(e) {
    var element, letters, name, _i, _len, _ref;
    var _this = this;
    letters = $(e.currentTarget).val().replace(/[^A-Za-z\s]/ig, '');
    if (letters === view.levelLetters) return;
    view.levelLetters = letters;
    view.loadScript();
    _ref = ['destroyInstructions', 'successInstructions'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      element = level.elements[name];
      if (element == null) continue;
      element.remove();
      level.elements[name] = null;
    }
    view.alreadyCollided = [];
    peanutty.destroyDynamicObjects();
    peanutty.addToScript({
      command: "peanutty.destroyDynamicObjects()\nlevel.elements.nameInput.val(\"" + letters + "\") if level.elements.nameInput.val() != \"" + letters + "\"\nlevel.createLetters\n    x: peanutty.world.dimensions.width / 2\n    y: 55\n    letters: \"" + letters + "\"",
      time: 0
    });
    view.lastNameInputKey = new Date();
    return $.timeout(1500, function() {
      var destroyInstructions;
      if (new Date() - view.lastNameInputKey < 1500) return;
      if (level.elements.destroyInstructions != null) return;
      destroyInstructions = level.elements.destroyInstructions = $(document.createElement("DIV"));
      destroyInstructions.css({
        height: '30px',
        width: '400px',
        textAlign: 'center',
        fontSize: '11pt',
        position: 'absolute',
        top: '100px',
        left: "" + ((peanutty.canvas.width() / 2) - 200) + "px"
      });
      destroyInstructions.html("Now destroy your name!<br/>(click a few times below this but above your name)");
      return view.$('#canvas_container').append(destroyInstructions);
    });
  });

  view.$('#canvas_container').append(nameInput);

  nameInput[0].focus();

  peanutty.addContactListener({
    listener: function(contact) {
      var body, contactedBodies, index, successInstructions, _len, _results;
      contactedBodies = [contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody()];
      _results = [];
      for (index = 0, _len = contactedBodies.length; index < _len; index++) {
        body = contactedBodies[index];
        if (body.m_I === 0) continue;
        if (((body.GetUserData() != null) && body.GetUserData().letter) || __indexOf.call(view.alreadyCollided, body) >= 0) {
          continue;
        }
        if (!((body.GetUserData() != null) && body.GetUserData().letter)) {
          view.alreadyCollided.push(body);
        }
        if (!((successInstructions = level.elements.successInstructions) != null)) {
          successInstructions = level.elements.successInstructions = $(document.createElement("DIV"));
          successInstructions.addClass('level_element');
          successInstructions.css({
            height: '30px',
            width: '400px',
            textAlign: 'center',
            fontSize: '11pt',
            position: 'absolute',
            top: '150px',
            left: "" + ((peanutty.canvas.width() / 2) - 200) + "px"
          });
          $('#canvas_container').append(successInstructions);
        }
        if (!(view.alreadyCollided.length > 2)) {
          successInstructions.html(successInstructions.html() + "Bamm! ");
        }
        if (view.alreadyCollided.length === 2) {
          successInstructions.html(successInstructions.html() + "<br/>Nice job :) When you're ready, head to the <a id='next_level'>next level ></a>");
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

  view.codeChangeMessageShown || (view.codeChangeMessageShown = false);

  view.$('#codes .code').bind('keypress', function() {
    if (view.codeChangeMessageShown) return;
    view.codeChangeMessageShown = true;
    return peanutty.sendCodeMessage({
      message: "You've changed the code.\nTo see your changes you'll need to rerun your script by clicking \"Run Script\" above."
    });
  });

  level.createLetters = function(_arg) {
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

  level.getLettersWidth = function(_arg) {
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

  level.createLetter = function(_arg) {
    var letter, x, y;
    x = _arg.x, y = _arg.y, letter = _arg.letter;
    switch (letter) {
      case "a":
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 45,
          y: y + 20,
          width: 5,
          height: 10,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 35,
          y: y + 35,
          width: 10,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 45,
          y: y + 50,
          width: 5,
          height: 10,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "B":
        peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 45,
          width: 10,
          height: 35,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 55,
          y: y + 25,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 40,
          y: y + 45,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 55,
          y: y + 65,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "c":
        peanutty.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 35,
          width: 10,
          height: 25,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 45,
          width: 10,
          height: 35,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 20,
          y: y + 5,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 35,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 20,
          y: y + 65,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "D":
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 55,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "e":
        peanutty.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 20,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 20,
          y: y + 35,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 50,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 25,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 20,
          y: y + 45,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 65,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 10,
          y: y + 15,
          width: 10,
          height: 15,
          userData: {
            letter: true
          },
          density: 10
        });
        peanutty.createBox({
          x: x + 20,
          y: y + 35,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 50,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 10,
          y: y + 20,
          width: 10,
          height: 20,
          userData: {
            letter: true
          },
          density: 10
        });
        peanutty.createBox({
          x: x + 20,
          y: y + 45,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 65,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 7,
          y: y + 35,
          width: 7,
          height: 25,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 45,
          y: y + 20,
          width: 5,
          height: 10,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 35,
          y: y + 35,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 45,
          y: y + 40,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
        peanutty.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 45,
          width: 10,
          height: 35,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 55,
          y: y + 25,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 45,
          y: y + 45,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 55,
          y: y + 52,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 10
        });
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 5,
          y: y + 15,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 35,
          y: y + 15,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 20,
          y: y + 35,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 55,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 35,
          y: y + 55,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
      case "H":
        peanutty.createBox({
          x: x + 10,
          y: y + 20,
          width: 10,
          height: 20,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 50,
          y: y + 20,
          width: 10,
          height: 20,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 30,
          y: y + 45,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 70,
          width: 10,
          height: 20,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 50,
          y: y + 70,
          width: 10,
          height: 20,
          userData: {
            letter: true
          }
        });
      case "i":
        peanutty.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 25,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "I":
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 30,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "j":
        peanutty.createBox({
          x: x + 15,
          y: y + 5,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 4,
          y: y + 18,
          width: 5,
          height: 8,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 25,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "J":
        peanutty.createBox({
          x: x + 17,
          y: y + 5,
          width: 18,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 4,
          y: y + 18,
          width: 5,
          height: 8,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 30,
          y: y + 40,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "k":
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
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
        peanutty.createBox({
          x: x + 20,
          y: y + 5,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
      case "L":
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 5,
          y: y + 50,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
      case "m":
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
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
        peanutty.createBox({
          x: x + 20,
          y: y + 5,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 35,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 20,
          y: y + 65,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "O":
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 55,
          y: y + 45,
          width: 5,
          height: 35,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "p":
        peanutty.createBox({
          x: x + 17,
          y: y + 30,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 17,
          y: y + 40,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 35,
          width: 5,
          height: 25,
          userData: {
            letter: true
          }
        });
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "Q":
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createBox({
          x: x + 30,
          y: y + 75,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "r":
        peanutty.createBox({
          x: x + 5,
          y: y + 20,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 28,
          y: y + 5,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 25,
          y: y + 25,
          width: 15,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 35,
          y: y + 40,
          width: 5,
          height: 10,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 20,
          y: y + 55,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "R":
        peanutty.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 35,
          y: y + 20,
          width: 5,
          height: 20,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 35,
          y: y + 45,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 55,
          y: y + 65,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "s":
        peanutty.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 40,
          y: y + 20,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 25,
          y: y + 35,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 47,
          y: y + 42,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 50
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 50,
          width: 10,
          height: 10,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 50,
          y: y + 25,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 30,
          y: y + 45,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 57,
          y: y + 52,
          width: 6,
          height: 2,
          userData: {
            letter: true
          },
          density: 80
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 65,
          width: 10,
          height: 15,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 30,
          y: y + 85,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createBox({
          x: x + 25,
          y: y + 30,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 25,
          y: y + 60,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "T":
        peanutty.createBox({
          x: x + 30,
          y: y + 40,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 30,
          y: y + 80,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
      case "u":
        peanutty.createBox({
          x: x + 20,
          y: y + 5,
          width: 20,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 35,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
      case "U":
        peanutty.createBox({
          x: x + 30,
          y: y + 5,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 50,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 55,
          y: y + 50,
          width: 5,
          height: 40,
          userData: {
            letter: true
          }
        });
      case "v":
        return peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        peanutty.createBox({
          x: x + 25,
          y: y + 5,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 5,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 45,
          y: y + 40,
          width: 5,
          height: 30,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 25,
          y: y + 25,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
      case "W":
        peanutty.createBox({
          x: x + 40,
          y: y + 5,
          width: 40,
          height: 5,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 10,
          y: y + 45,
          width: 10,
          height: 40,
          userData: {
            letter: true
          }
        });
        peanutty.createBox({
          x: x + 70,
          y: y + 45,
          width: 10,
          height: 40,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
          x: x + 40,
          y: y + 20,
          width: 5,
          height: 15,
          userData: {
            letter: true
          }
        });
      case "x":
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
        return peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createBox({
          x: x + 25,
          y: y + 17,
          width: 5,
          height: 17,
          userData: {
            letter: true
          }
        });
      case "Y":
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        return peanutty.createBox({
          x: x + 30,
          y: y + 22,
          width: 5,
          height: 22,
          userData: {
            letter: true
          }
        });
      case "z":
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        peanutty.createBox({
          x: x + 25,
          y: y + 65,
          width: 25,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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
        peanutty.createPoly({
          fixtureDefs: [
            peanutty.polyFixtureDef({
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
            }), peanutty.polyFixtureDef({
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
        peanutty.createBox({
          x: x + 30,
          y: y + 95,
          width: 30,
          height: 5,
          userData: {
            letter: true
          }
        });
        return peanutty.createBox({
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

  level.createLetters({
    x: peanutty.world.dimensions.width / 2,
    y: 55,
    letters: 'Hello World'
  });

  peanutty.sign('@jaredcosulich', 'jaredcosulich');

}).call(this);
