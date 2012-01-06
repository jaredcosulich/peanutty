(function() {
  var codeChangeMessageShown, instructions;
  var _this = this;

  Peanutty.loadEnvironment();

  peanutty.runSimulation();

  peanutty.sendMessage({
    message: "<strong>Welcome to Peanutty!</strong>\n<p>\n    To get started, type your name in and then destroy it with boxes, balls, or freeform shapes.\n</p>"
  });

  peanutty.createGround({
    x: peanutty.canvas.width() / 2,
    y: peanutty.canvas.height() - 50,
    width: 600,
    height: 10
  });

  instructions = $(document.createElement("DIV"));

  instructions.addClass('stage_element');

  instructions.css({
    height: '30px',
    width: '300px',
    textAlign: 'center',
    fontSize: '20pt',
    position: 'absolute',
    top: '20px',
    left: "" + ((peanutty.canvas.width() / 2) - 150) + "px"
  });

  instructions.html("Type your name:");

  view.$('#canvas_container').append(instructions);

  window.nameInput = $(document.createElement('INPUT'));

  nameInput.addClass('stage_element');

  nameInput.css({
    width: '300px',
    height: '30px',
    fontSize: '20pt',
    position: 'absolute',
    top: '50px',
    left: "" + ((peanutty.canvas.width() / 2) - 150) + "px"
  });

  nameInput.bind('keyup', function(e) {
    var letters;
    var _this = this;
    letters = $(e.currentTarget).val().replace(/[^A-Za-z\s]/ig, '');
    view.loadScript();
    peanutty.destroyDynamicObjects();
    peanutty.addToScript({
      command: "peanutty.destroyDynamicObjects()\nnameInput.val(\"" + letters + "\") if nameInput.val() != \"" + letters + "\"\npeanutty.createLetters\n    x: peanutty.canvas.width() / 2\n    y: peanutty.canvas.height() - 55\n    letters: \"" + letters + "\"",
      time: 0
    });
    window.lastNameInputKey = new Date();
    return $.timeout(1500, function() {
      var destroyInstructions;
      if (new Date() - window.lastNameInputKey < 1500) return;
      destroyInstructions = $(document.createElement("DIV"));
      destroyInstructions.addClass('stage_element');
      destroyInstructions.css({
        height: '30px',
        width: '300px',
        textAlign: 'center',
        fontSize: '12pt',
        position: 'absolute',
        top: '90px',
        left: "" + ((peanutty.canvas.width() / 2) - 150) + "px"
      });
      destroyInstructions.html("Now destroy your name!<br/>(click anywhere below this but above your name)");
      view.$('#canvas_container').append(destroyInstructions);
      peanutty.sendMessage({
        message: "<h3> \n    Ready for the next challenge? \n    <a id='next_challenge'>Load it up ></a>\n</h3>"
      });
      return view.$('#next_challenge').bind('click', function() {
        return view.loadNewStage('stack_em');
      });
    });
  });

  view.$('#canvas_container').append(nameInput);

  nameInput[0].focus();

  codeChangeMessageShown = false;

  view.$('#codes .code').bind('keypress', function() {
    if (codeChangeMessageShown) return;
    codeChangeMessageShown = true;
    peanutty.sendCodeMessage({
      message: "You've changed your script.\nTo see your changes you'll need to rerun your script by clicking \"Run Script\" above.\n(<a id='close_code_message'>close this</a>)       "
    });
    return view.$('#close_code_message').bind('click', function() {
      return view.$('#codes .message').removeClass('displayed');
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
                  y: y - 70
                }, {
                  x: x + 40,
                  y: y - 70
                }, {
                  x: x + 13,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 26,
                  y: y - 32
                }, {
                  x: x + 21,
                  y: y - 20
                }, {
                  x: x + 34,
                  y: y - 20
                }, {
                  x: x + 34,
                  y: y - 32
                }
              ]
            })
          ]
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 40,
                  y: y - 70
                }, {
                  x: x + 34,
                  y: y - 54
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
                  y: y - 32
                }, {
                  x: x + 34,
                  y: y - 20
                }, {
                  x: x + 47,
                  y: y - 20
                }, {
                  x: x + 43,
                  y: y - 32
                }
              ]
            })
          ]
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
                  y: y - 90
                }, {
                  x: x + 48,
                  y: y - 90
                }, {
                  x: x + 13,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 26,
                  y: y - 32
                }, {
                  x: x + 22,
                  y: y - 20
                }, {
                  x: x + 42,
                  y: y - 20
                }, {
                  x: x + 42,
                  y: y - 32
                }
              ]
            })
          ]
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 48,
                  y: y - 90
                }, {
                  x: x + 42,
                  y: y - 73
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
                  y: y - 32
                }, {
                  x: x + 42,
                  y: y - 20
                }, {
                  x: x + 57,
                  y: y - 20
                }, {
                  x: x + 54,
                  y: y - 32
                }
              ]
            })
          ]
        });
      case "b":
        this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 35,
          width: 5,
          height: 25
        });
        this.createBox({
          x: x + 45,
          y: y - 20,
          width: 5,
          height: 10
        });
        this.createBox({
          x: x + 35,
          y: y - 35,
          width: 10,
          height: 5
        });
        this.createBox({
          x: x + 45,
          y: y - 50,
          width: 5,
          height: 10
        });
        return this.createBox({
          x: x + 25,
          y: y - 5,
          width: 25,
          height: 5
        });
      case "B":
        this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 45,
          width: 10,
          height: 35
        });
        this.createBox({
          x: x + 55,
          y: y - 25,
          width: 5,
          height: 15
        });
        this.createBox({
          x: x + 40,
          y: y - 45,
          width: 15,
          height: 5
        });
        this.createBox({
          x: x + 55,
          y: y - 65,
          width: 5,
          height: 15
        });
        return this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
      case "c":
        this.createBox({
          x: x + 25,
          y: y - 5,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 35,
          width: 10,
          height: 25
        });
        this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
        return this.createBox({
          x: x + 4,
          y: y - 74,
          width: 6,
          height: 2,
          density: 10
        });
      case "C":
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 45,
          width: 10,
          height: 35
        });
        this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
        return this.createBox({
          x: x + 6,
          y: y - 92,
          width: 8,
          height: 2,
          density: 10
        });
      case "d":
        this.createBox({
          x: x + 20,
          y: y - 5,
          width: 20,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 35,
          width: 5,
          height: 25
        });
        this.createBox({
          x: x + 35,
          y: y - 35,
          width: 5,
          height: 25
        });
        return this.createBox({
          x: x + 20,
          y: y - 65,
          width: 20,
          height: 5
        });
      case "D":
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 45,
          width: 5,
          height: 35
        });
        this.createBox({
          x: x + 55,
          y: y - 45,
          width: 5,
          height: 35
        });
        return this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
      case "e":
        this.createBox({
          x: x + 25,
          y: y - 5,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 20,
          width: 10,
          height: 10
        });
        this.createBox({
          x: x + 20,
          y: y - 35,
          width: 20,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 50,
          width: 10,
          height: 10
        });
        this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
        return this.createBox({
          x: x + 4,
          y: y - 74,
          width: 6,
          height: 2,
          density: 10
        });
      case "E":
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 25,
          width: 10,
          height: 15
        });
        this.createBox({
          x: x + 20,
          y: y - 45,
          width: 20,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 65,
          width: 10,
          height: 15
        });
        this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
        return this.createBox({
          x: x + 4,
          y: y - 91,
          width: 6,
          height: 2,
          density: 10
        });
      case "f":
        this.createBox({
          x: x + 10,
          y: y - 15,
          width: 10,
          height: 15,
          density: 10
        });
        this.createBox({
          x: x + 20,
          y: y - 35,
          width: 20,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 50,
          width: 10,
          height: 10
        });
        this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
        return this.createBox({
          x: x + 4,
          y: y - 74,
          width: 6,
          height: 2,
          density: 10
        });
      case "F":
        this.createBox({
          x: x + 10,
          y: y - 20,
          width: 10,
          height: 20,
          density: 10
        });
        this.createBox({
          x: x + 20,
          y: y - 45,
          width: 20,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 65,
          width: 10,
          height: 15
        });
        this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
        return this.createBox({
          x: x + 4,
          y: y - 91,
          width: 6,
          height: 2,
          density: 10
        });
      case "g":
        this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 7,
          y: y - 35,
          width: 7,
          height: 25
        });
        this.createBox({
          x: x + 45,
          y: y - 20,
          width: 5,
          height: 10
        });
        this.createBox({
          x: x + 35,
          y: y - 35,
          width: 15,
          height: 5
        });
        this.createBox({
          x: x + 45,
          y: y - 40,
          width: 6,
          height: 2,
          density: 10
        });
        this.createBox({
          x: x + 25,
          y: y - 5,
          width: 25,
          height: 5
        });
        return this.createBox({
          x: x + 5,
          y: y - 74,
          width: 8,
          height: 2,
          density: 10
        });
      case "G":
        this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 45,
          width: 10,
          height: 35
        });
        this.createBox({
          x: x + 55,
          y: y - 25,
          width: 5,
          height: 15
        });
        this.createBox({
          x: x + 45,
          y: y - 45,
          width: 15,
          height: 5
        });
        this.createBox({
          x: x + 55,
          y: y - 52,
          width: 6,
          height: 2,
          density: 10
        });
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        return this.createBox({
          x: x + 5,
          y: y - 92,
          width: 8,
          height: 2,
          density: 10
        });
      case "h":
        this.createBox({
          x: x + 5,
          y: y - 15,
          width: 5,
          height: 15
        });
        this.createBox({
          x: x + 35,
          y: y - 15,
          width: 5,
          height: 15
        });
        this.createBox({
          x: x + 20,
          y: y - 35,
          width: 20,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 55,
          width: 5,
          height: 15
        });
        return this.createBox({
          x: x + 35,
          y: y - 55,
          width: 5,
          height: 15
        });
      case "H":
        this.createBox({
          x: x + 10,
          y: y - 20,
          width: 10,
          height: 20
        });
        this.createBox({
          x: x + 50,
          y: y - 20,
          width: 10,
          height: 20
        });
        this.createBox({
          x: x + 30,
          y: y - 45,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 70,
          width: 10,
          height: 20
        });
        return this.createBox({
          x: x + 50,
          y: y - 70,
          width: 10,
          height: 20
        });
      case "i":
        this.createBox({
          x: x + 25,
          y: y - 5,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 25,
          y: y - 35,
          width: 5,
          height: 25
        });
        return this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
      case "I":
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 30,
          y: y - 45,
          width: 5,
          height: 35
        });
        return this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
      case "j":
        this.createBox({
          x: x + 15,
          y: y - 5,
          width: 15,
          height: 5
        });
        this.createBox({
          x: x + 4,
          y: y - 18,
          width: 5,
          height: 8
        });
        this.createBox({
          x: x + 25,
          y: y - 35,
          width: 5,
          height: 25
        });
        return this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
      case "J":
        this.createBox({
          x: x + 17,
          y: y - 5,
          width: 18,
          height: 5
        });
        this.createBox({
          x: x + 4,
          y: y - 18,
          width: 5,
          height: 8
        });
        this.createBox({
          x: x + 30,
          y: y - 40,
          width: 5,
          height: 35
        });
        return this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
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
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y - 30
                }, {
                  x: x + 10,
                  y: y - 40
                }, {
                  x: x + 40,
                  y: y - 70
                }, {
                  x: x + 50,
                  y: y - 70
                }
              ]
            })
          ]
        });
        return this.createPoly({
          path: [
            {
              x: x + 10,
              y: y - 30
            }, {
              x: x + 15,
              y: y - 35
            }, {
              x: x + 50,
              y: y
            }, {
              x: x + 40,
              y: y
            }
          ]
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
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y - 40
                }, {
                  x: x + 10,
                  y: y - 50
                }, {
                  x: x + 50,
                  y: y - 90
                }, {
                  x: x + 60,
                  y: y - 90
                }
              ]
            })
          ]
        });
        return this.createPoly({
          path: [
            {
              x: x + 10,
              y: y - 40
            }, {
              x: x + 15,
              y: y - 45
            }, {
              x: x + 60,
              y: y
            }, {
              x: x + 50,
              y: y
            }
          ]
        });
      case "l":
        this.createBox({
          x: x + 20,
          y: y - 5,
          width: 20,
          height: 5
        });
        return this.createBox({
          x: x + 5,
          y: y - 40,
          width: 5,
          height: 30
        });
      case "L":
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        return this.createBox({
          x: x + 5,
          y: y - 50,
          width: 5,
          height: 40
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
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y - 55
                }, {
                  x: x + 10,
                  y: y - 70
                }, {
                  x: x + 25,
                  y: y - 40
                }, {
                  x: x + 25,
                  y: y - 25
                }
              ]
            })
          ]
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
                  y: y - 70
                }, {
                  x: x + 50,
                  y: y - 70
                }, {
                  x: x + 50,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 25,
                  y: y - 25
                }, {
                  x: x + 25,
                  y: y - 40
                }, {
                  x: x + 40,
                  y: y - 70
                }, {
                  x: x + 40,
                  y: y - 55
                }
              ]
            })
          ]
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
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y - 75
                }, {
                  x: x + 10,
                  y: y - 90
                }, {
                  x: x + 30,
                  y: y - 60
                }, {
                  x: x + 30,
                  y: y - 45
                }
              ]
            })
          ]
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
                  y: y - 90
                }, {
                  x: x + 60,
                  y: y - 90
                }, {
                  x: x + 60,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y - 45
                }, {
                  x: x + 30,
                  y: y - 60
                }, {
                  x: x + 50,
                  y: y - 90
                }, {
                  x: x + 50,
                  y: y - 75
                }
              ]
            })
          ]
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
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y - 55
                }, {
                  x: x + 40,
                  y: y
                }, {
                  x: x + 40,
                  y: y - 15
                }
              ]
            })
          ]
        });
        return this.createPoly({
          path: [
            {
              x: x + 40,
              y: y
            }, {
              x: x + 40,
              y: y - 70
            }, {
              x: x + 50,
              y: y - 70
            }, {
              x: x + 50,
              y: y
            }
          ]
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
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 10,
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y - 75
                }, {
                  x: x + 50,
                  y: y
                }, {
                  x: x + 50,
                  y: y - 15
                }
              ]
            })
          ]
        });
        return this.createPoly({
          path: [
            {
              x: x + 50,
              y: y
            }, {
              x: x + 50,
              y: y - 90
            }, {
              x: x + 60,
              y: y - 90
            }, {
              x: x + 60,
              y: y
            }
          ]
        });
      case "o":
        this.createBox({
          x: x + 20,
          y: y - 5,
          width: 20,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 35,
          width: 5,
          height: 25
        });
        this.createBox({
          x: x + 35,
          y: y - 35,
          width: 5,
          height: 25
        });
        return this.createBox({
          x: x + 20,
          y: y - 65,
          width: 20,
          height: 5
        });
      case "O":
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 45,
          width: 5,
          height: 35
        });
        this.createBox({
          x: x + 55,
          y: y - 45,
          width: 5,
          height: 35
        });
        return this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
      case "p":
        this.createBox({
          x: x + 17,
          y: y - 30,
          width: 5,
          height: 30
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 60
                }, {
                  x: x,
                  y: y - 70
                }, {
                  x: x + 50,
                  y: y - 70
                }, {
                  x: x + 50,
                  y: y - 60
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 50,
                  y: y - 60
                }, {
                  x: x + 50,
                  y: y - 40
                }, {
                  x: x + 40,
                  y: y - 40
                }, {
                  x: x + 40,
                  y: y - 60
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 50,
                  y: y - 40
                }, {
                  x: x + 50,
                  y: y - 30
                }, {
                  x: x + 22,
                  y: y - 30
                }, {
                  x: x + 22,
                  y: y - 40
                }
              ]
            })
          ]
        });
        return this.createBox({
          x: x + 4,
          y: y - 72,
          width: 6,
          height: 2,
          density: 10
        });
      case "P":
        this.createBox({
          x: x + 17,
          y: y - 40,
          width: 5,
          height: 40
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 80
                }, {
                  x: x,
                  y: y - 90
                }, {
                  x: x + 60,
                  y: y - 90
                }, {
                  x: x + 60,
                  y: y - 80
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 60,
                  y: y - 80
                }, {
                  x: x + 60,
                  y: y - 50
                }, {
                  x: x + 50,
                  y: y - 50
                }, {
                  x: x + 50,
                  y: y - 80
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 60,
                  y: y - 50
                }, {
                  x: x + 60,
                  y: y - 40
                }, {
                  x: x + 22,
                  y: y - 40
                }, {
                  x: x + 22,
                  y: y - 50
                }
              ]
            })
          ]
        });
        return this.createBox({
          x: x + 4,
          y: y - 92,
          width: 6,
          height: 2,
          density: 30
        });
      case "q":
        this.createBox({
          x: x + 25,
          y: y - 5,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 35,
          width: 5,
          height: 25
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 40,
                  y: y - 10
                }, {
                  x: x + 40,
                  y: y - 60
                }, {
                  x: x + 50,
                  y: y - 60
                }, {
                  x: x + 50,
                  y: y - 10
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 20,
                  y: y - 40
                }, {
                  x: x + 30,
                  y: y - 40
                }, {
                  x: x + 40,
                  y: y - 20
                }, {
                  x: x + 40,
                  y: y - 10
                }, {
                  x: x + 35,
                  y: y - 10
                }
              ]
            })
          ]
        });
        return this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
      case "Q":
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 40,
          width: 5,
          height: 30
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 50,
                  y: y - 10
                }, {
                  x: x + 50,
                  y: y - 70
                }, {
                  x: x + 60,
                  y: y - 70
                }, {
                  x: x + 60,
                  y: y - 10
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y - 40
                }, {
                  x: x + 40,
                  y: y - 40
                }, {
                  x: x + 50,
                  y: y - 20
                }, {
                  x: x + 50,
                  y: y - 10
                }, {
                  x: x + 45,
                  y: y - 10
                }
              ]
            })
          ]
        });
        return this.createBox({
          x: x + 30,
          y: y - 75,
          width: 30,
          height: 5
        });
      case "r":
        this.createBox({
          x: x + 5,
          y: y - 20,
          width: 5,
          height: 30
        });
        this.createBox({
          x: x + 28,
          y: y - 5,
          width: 5,
          height: 15
        });
        this.createBox({
          x: x + 25,
          y: y - 25,
          width: 15,
          height: 5
        });
        this.createBox({
          x: x + 35,
          y: y - 40,
          width: 5,
          height: 10
        });
        return this.createBox({
          x: x + 20,
          y: y - 55,
          width: 20,
          height: 5
        });
      case "R":
        this.createBox({
          x: x + 5,
          y: y - 40,
          width: 5,
          height: 40
        });
        this.createBox({
          x: x + 35,
          y: y - 20,
          width: 5,
          height: 20
        });
        this.createBox({
          x: x + 35,
          y: y - 45,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 55,
          y: y - 65,
          width: 5,
          height: 15
        });
        return this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
      case "s":
        this.createBox({
          x: x + 25,
          y: y - 5,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 40,
          y: y - 20,
          width: 10,
          height: 10
        });
        this.createBox({
          x: x + 25,
          y: y - 35,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 47,
          y: y - 42,
          width: 6,
          height: 2,
          density: 50
        });
        this.createBox({
          x: x + 10,
          y: y - 50,
          width: 10,
          height: 10
        });
        this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
        return this.createBox({
          x: x + 4,
          y: y - 72,
          width: 6,
          height: 2,
          density: 10
        });
      case "S":
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 50,
          y: y - 25,
          width: 10,
          height: 15
        });
        this.createBox({
          x: x + 30,
          y: y - 45,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 57,
          y: y - 52,
          width: 6,
          height: 2,
          density: 80
        });
        this.createBox({
          x: x + 10,
          y: y - 65,
          width: 10,
          height: 15
        });
        this.createBox({
          x: x + 30,
          y: y - 85,
          width: 30,
          height: 5
        });
        return this.createBox({
          x: x + 4,
          y: y - 92,
          width: 6,
          height: 2,
          density: 10
        });
      case "t":
        this.createBox({
          x: x + 25,
          y: y - 30,
          width: 5,
          height: 30
        });
        return this.createBox({
          x: x + 25,
          y: y - 60,
          width: 25,
          height: 5
        });
      case "T":
        this.createBox({
          x: x + 30,
          y: y - 40,
          width: 5,
          height: 40
        });
        return this.createBox({
          x: x + 30,
          y: y - 80,
          width: 30,
          height: 5
        });
      case "u":
        this.createBox({
          x: x + 20,
          y: y - 5,
          width: 20,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 40,
          width: 5,
          height: 30
        });
        return this.createBox({
          x: x + 35,
          y: y - 40,
          width: 5,
          height: 30
        });
      case "U":
        this.createBox({
          x: x + 30,
          y: y - 5,
          width: 30,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 50,
          width: 5,
          height: 40
        });
        return this.createBox({
          x: x + 55,
          y: y - 50,
          width: 5,
          height: 40
        });
      case "v":
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y - 70
                }, {
                  x: x + 25,
                  y: y - 20
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
                  y: y - 20
                }, {
                  x: x + 40,
                  y: y - 70
                }, {
                  x: x + 50,
                  y: y - 70
                }
              ]
            })
          ]
        });
      case "V":
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y - 90
                }, {
                  x: x + 30,
                  y: y - 20
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
                  y: y - 20
                }, {
                  x: x + 50,
                  y: y - 90
                }, {
                  x: x + 60,
                  y: y - 90
                }
              ]
            })
          ]
        });
      case "w":
        this.createBox({
          x: x + 25,
          y: y - 5,
          width: 25,
          height: 5
        });
        this.createBox({
          x: x + 5,
          y: y - 40,
          width: 5,
          height: 30
        });
        this.createBox({
          x: x + 45,
          y: y - 40,
          width: 5,
          height: 30
        });
        return this.createBox({
          x: x + 25,
          y: y - 25,
          width: 5,
          height: 15
        });
      case "W":
        this.createBox({
          x: x + 40,
          y: y - 5,
          width: 40,
          height: 5
        });
        this.createBox({
          x: x + 10,
          y: y - 45,
          width: 10,
          height: 40
        });
        this.createBox({
          x: x + 70,
          y: y - 45,
          width: 10,
          height: 40
        });
        return this.createBox({
          x: x + 40,
          y: y - 20,
          width: 5,
          height: 15
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
                  y: y - 35
                }, {
                  x: x + 30,
                  y: y - 35
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            })
          ]
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y - 35
                }, {
                  x: x + 50,
                  y: y
                }, {
                  x: x + 40,
                  y: y
                }, {
                  x: x + 25,
                  y: y - 25
                }
              ]
            })
          ]
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y - 70
                }, {
                  x: x + 30,
                  y: y - 35
                }, {
                  x: x + 20,
                  y: y - 35
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 25,
                  y: y - 45
                }, {
                  x: x + 40,
                  y: y - 70
                }, {
                  x: x + 50,
                  y: y - 70
                }, {
                  x: x + 30,
                  y: y - 35
                }
              ]
            })
          ]
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
                  y: y - 45
                }, {
                  x: x + 35,
                  y: y - 45
                }, {
                  x: x + 10,
                  y: y
                }
              ]
            })
          ]
        });
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x + 35,
                  y: y - 45
                }, {
                  x: x + 60,
                  y: y
                }, {
                  x: x + 50,
                  y: y
                }, {
                  x: x + 30,
                  y: y - 35
                }
              ]
            })
          ]
        });
        return this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y - 90
                }, {
                  x: x + 35,
                  y: y - 45
                }, {
                  x: x + 25,
                  y: y - 45
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y - 55
                }, {
                  x: x + 50,
                  y: y - 90
                }, {
                  x: x + 60,
                  y: y - 90
                }, {
                  x: x + 35,
                  y: y - 45
                }
              ]
            })
          ]
        });
      case "y":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 70
                }, {
                  x: x + 10,
                  y: y - 70
                }, {
                  x: x + 30,
                  y: y - 35
                }, {
                  x: x + 20,
                  y: y - 35
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 25,
                  y: y - 45
                }, {
                  x: x + 40,
                  y: y - 70
                }, {
                  x: x + 50,
                  y: y - 70
                }, {
                  x: x + 30,
                  y: y - 35
                }
              ]
            })
          ]
        });
        return this.createBox({
          x: x + 25,
          y: y - 17,
          width: 5,
          height: 17
        });
      case "Y":
        this.createPoly({
          fixtureDefs: [
            this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y - 90
                }, {
                  x: x + 35,
                  y: y - 45
                }, {
                  x: x + 25,
                  y: y - 45
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x + 30,
                  y: y - 55
                }, {
                  x: x + 50,
                  y: y - 90
                }, {
                  x: x + 60,
                  y: y - 90
                }, {
                  x: x + 35,
                  y: y - 45
                }
              ]
            })
          ]
        });
        return this.createBox({
          x: x + 30,
          y: y - 22,
          width: 5,
          height: 22
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
                  y: y - 10
                }, {
                  x: x + 50,
                  y: y - 10
                }, {
                  x: x + 50,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 10
                }, {
                  x: x + 40,
                  y: y - 60
                }, {
                  x: x + 50,
                  y: y - 60
                }, {
                  x: x + 10,
                  y: y - 10
                }
              ]
            })
          ]
        });
        this.createBox({
          x: x + 25,
          y: y - 65,
          width: 25,
          height: 5
        });
        return this.createBox({
          x: x + 47,
          y: y - 72,
          width: 6,
          height: 2,
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
                  y: y - 10
                }, {
                  x: x + 60,
                  y: y - 10
                }, {
                  x: x + 60,
                  y: y
                }
              ]
            }), this.polyFixtureDef({
              path: [
                {
                  x: x,
                  y: y - 10
                }, {
                  x: x + 50,
                  y: y - 90
                }, {
                  x: x + 60,
                  y: y - 90
                }, {
                  x: x + 10,
                  y: y - 10
                }
              ]
            })
          ]
        });
        this.createBox({
          x: x + 30,
          y: y - 95,
          width: 30,
          height: 5
        });
        return this.createBox({
          x: x + 57,
          y: y - 102,
          width: 6,
          height: 2,
          density: 50
        });
    }
  };

  peanutty.createLetters({
    x: peanutty.canvas.width() / 2,
    y: peanutty.canvas.height() - 55,
    letters: 'Hello World'
  });

}).call(this);
