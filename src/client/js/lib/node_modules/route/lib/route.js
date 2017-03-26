(function(route) {
  var Route, _hash, _routes;
  _routes = [];
  _hash = null;
  route.init = function(run) {
    var onchange;
    onchange = function() {
      var hash;
      hash = $.hash();
      if (hash !== _hash) {
        _hash = hash;
        route.run(hash);
      }
    };
    $(window).bind('hashchange', onchange);
    if (run) {
      onchange();
    }
  };
  route.navigate = function(hash, run) {
    if (!run) {
      _hash = hash;
    }
    $.hash(hash);
  };
  route.run = function(hash) {
    var m, route, _i, _len;
    for (_i = 0, _len = _routes.length; _i < _len; _i++) {
      route = _routes[_i];
      if ((m = route.pattern.exec(hash))) {
        route.fn.apply(route, m.slice(1));
      }
    }
  };
  route.add = function(routes, fn) {
    var path;
    if (fn) {
      routes = {};
      routes[routes] = fn;
    }
    for (path in routes) {
      fn = routes[path];
      _routes.push(new Route(path, fn));
    }
  };
  return Route = (function() {
    Route.prototype._transformations = [[/:([\w\d]+)/g, '([^/]*)'], [/\*([\w\d]+)/g, '(.*?)']];
    function Route(path, fn) {
      var pattern, replacement, _i, _len, _ref, _ref2;
      this.path = path;
      this.fn = fn;
      _ref = this._transformations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref2 = _ref[_i], pattern = _ref2[0], replacement = _ref2[1];
        path = path.replace(pattern, replacement);
      }
      this.pattern = new RegExp("^" + path + "$");
    }
    return Route;
  })();
})(typeof exports !== "undefined" && exports !== null ? exports : (this['route'] = {}));