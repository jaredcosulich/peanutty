(function() {
  var canvas, environmentEditor, initiateBall, initiateBox, initiateFree, scale, scriptEditor, stageEditor, static, unbindMouseEvents;
  var _this = this;

  scale = 30;

  canvas = view.$('#canvas');

  scriptEditor = view.scriptEditor;

  stageEditor = view.stageEditor;

  environmentEditor = view.environmentEditor;

  window.peanutty = new Peanutty({
    canvas: canvas,
    scriptEditor: scriptEditor,
    stageEditor: stageEditor,
    environmentEditor: environmentEditor,
    scale: scale,
    gravity: new b2d.Common.Math.b2Vec2(0, 10)
  });

  peanutty.runSimulation();

  static = false;

  unbindMouseEvents = function(canvas) {
    canvas.unbind('mousedown');
    canvas.unbind('mouseup');
    canvas.unbind('mousemove');
    return canvas.unbind('click');
  };

  initiateFree = function(canvas) {
    unbindMouseEvents(canvas);
    canvas.bind('click', function(e) {
      var firstPoint, x, y;
      x = e.offsetX;
      y = peanutty.canvas.height() - e.offsetY;
      firstPoint = peanutty.currentShape != null ? peanutty.currentShape.path[0] : null;
      if ((firstPoint != null) && Math.abs(firstPoint.x - x) < 10 && Math.abs((peanutty.canvas.height() - firstPoint.y) - y) < 10) {
        peanutty.endFreeformShape({
          static: static,
          time: view.getTimeDiff()
        });
        return;
      }
      peanutty.addToFreeformShape({
        x: x,
        y: y
      });
    });
    return canvas.bind('mousemove', function(e) {
      peanutty.addTempToFreeformShape({
        x: e.offsetX,
        y: e.offsetY
      });
    });
  };

  initiateBox = function(canvas) {
    unbindMouseEvents(canvas);
    return canvas.bind('click', function(e) {
      return peanutty.addToScript({
        command: "peanutty.createBox\n    x: " + (e.offsetX * (peanutty.defaultScale / peanutty.scale)) + "\n    y: " + (peanutty.world.dimensions.height - (e.offsetY * (peanutty.defaultScale / peanutty.scale))) + "\n    width: 20\n    height: 20\n    static: " + static,
        time: view.getTimeDiff()
      });
    });
  };

  initiateBall = function(canvas) {
    unbindMouseEvents(canvas);
    return canvas.bind('click', function(e) {
      return peanutty.addToScript({
        command: "peanutty.createBall\n    x: " + (e.offsetX * (peanutty.defaultScale / peanutty.scale)) + "\n    y: " + (peanutty.world.dimensions.height - (e.offsetY * (peanutty.defaultScale / peanutty.scale))) + "\n    radius: 20\n    static: " + static,
        time: view.getTimeDiff()
      });
    });
  };

  view.getTimeDiff = function() {
    var timeDiff;
    timeDiff = view.time != null ? new Date() - view.time : 0;
    view.time = new Date();
    return timeDiff;
  };

  view.$('#tools #free').bind('click', function() {
    $('#tools .tool').removeClass('selected');
    $('#tools #free').addClass('selected');
    return initiateFree(canvas);
  });

  view.$('#tools #box').bind('click', function() {
    $('#tools .tool').removeClass('selected');
    $('#tools #box').addClass('selected');
    return initiateBox(canvas);
  });

  view.$('#tools #ball').bind('click', function() {
    $('#tools .tool').removeClass('selected');
    $('#tools #ball').addClass('selected');
    return initiateBall(canvas);
  });

  view.$('#tools #static').bind('click', function() {
    $('#tools .setting').removeClass('selected');
    $('#tools #static').addClass('selected');
    return static = true;
  });

  view.$('#tools #dynamic').bind('click', function() {
    $('#tools .setting').removeClass('selected');
    $('#tools #dynamic').addClass('selected');
    return static = false;
  });

  view.$('#tools #ball').click();

  view.$('#tools #dynamic').click();

}).call(this);
