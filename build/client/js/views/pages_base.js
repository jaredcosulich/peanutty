
  require('views');

  views.BaseView.prototype._requireTemplate = function(url) {
    return this._requireElement("/src/client/" + url, 'script', 'text/html');
  };
