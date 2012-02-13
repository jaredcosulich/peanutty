var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
(function($) {
  var empty, remove, replaceWith, triggerRemoveEvent, view, views, _ref;
  views = provide('views', {});
  view = function(options) {
    return new views[options.name](options);
  };
  $.ender({
    view: view
  });
  $.ender({
    view: function(options) {
      return this.each(function() {
        options.el = this;
        return view(options);
      });
    }
  }, true);
  _ref = $(''), empty = _ref.empty, remove = _ref.remove, replaceWith = _ref.replaceWith;
  triggerRemoveEvent = function(els) {
    els.deepEach(function(el) {
      $(el).trigger('remove').unbind();
    });
  };
  $.ender({
    empty: function() {
      triggerRemoveEvent(this.children());
      return empty.apply(this, arguments);
    },
    remove: function() {
      triggerRemoveEvent(this);
      return remove.apply(this, arguments);
    },
    replaceWith: function() {
      triggerRemoveEvent(this);
      return replaceWith.apply(this, arguments);
    }
  }, true);
  return views.BaseView = (function() {
    BaseView.prototype.defaultElement = "<div></div>";
    function BaseView(options) {
      var event, _i, _len, _ref2;
      if (options == null) {
        options = {};
      }
      this.ready = __bind(this.ready, this);
      this._onremove = __bind(this._onremove, this);
      this.options = options;
      this.el = $(this.options.el || this.defaultElement);
      this.data = this.options.data || {};
      this.lazy = this.options.lazy;
      this.el.bind('remove', this._onremove);
      _ref2 = ['prepare', 'ready', 'render', 'loading', 'error', 'build', 'complete', 'destroy'];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        event = _ref2[_i];
        if (this.options[event]) {
          $(this).bind(event, this.options[event]);
        }
      }
      this.errors = [];
      this.loading = 0;
      this._loadingStarted();
      this.state('prepare');
      this.prepare(this.data);
      $.timeout(1, __bind(function() {
        return this._loadingFinished();
      }, this));
    }
    BaseView.prototype.$ = function(selector) {
      return $(selector, this.el);
    };
    BaseView.prototype._onremove = function(event) {
      if (event.target === this.el[0]) {
        this.el.unbind('remove', this._onremove);
        this.destroy();
      }
    };
    BaseView.prototype.state = function(status) {
      return $(this).trigger(this.status = status);
    };
    BaseView.prototype.destroy = function() {
      this.state('destroy');
      $(this).unbind();
      this.el.removeClass('view');
      return this.el.data('view', null);
    };
    BaseView.prototype.prepare = function() {};
    BaseView.prototype.renderView = function() {};
    BaseView.prototype.renderError = function() {
      return this.el.addClass('error');
    };
    BaseView.prototype.renderLoading = function() {
      return this.el.addClass('loading');
    };
    BaseView.prototype.ready = function(e) {
      if (this.status === 'waiting') {
        return;
      }
      this.state('ready');
      if (this.status === 'loading') {
        this.el.find('*').animate({
          opacity: 0,
          duration: 100,
          complete: __bind(function() {
            return this.render();
          }, this)
        });
      } else if (!this.lazy) {
        this.render();
      }
    };
    BaseView.prototype.render = function() {
      var curView, status;
      curView = this.el.data('view');
      if (curView && curView !== this) {
        curView.destroy();
      }
      status = this.status;
      this.state('render');
      this.el.data('view', this);
      this.el.addClass('view');
      this.el.empty();
      if (this.loading) {
        this.state(status !== 'complete' ? 'loading' : 'waiting');
        this.renderLoading();
      } else if (this.errors.length) {
        this.state('error');
        this.renderError(this.errors);
      } else {
        this.state('build');
        this.el.removeClass('loading');
        this.renderView();
        this.state('complete');
      }
      return this;
    };
    BaseView.prototype._loadingStarted = function() {
      if (!this.loading++ && this.status !== 'prepare') {
        if (!this.lazy) {
          return this.render();
        }
      }
    };
    BaseView.prototype._loadingFinished = function() {
      if (!--this.loading) {
        return this.ready();
      }
    };
    BaseView.prototype._requireElement = function(url, tag, type, rel) {
      var el, urlAttr;
      urlAttr = (tag === 'img' || tag === 'script' ? 'src' : 'href');
      el = $("" + tag + "[" + urlAttr + "=\"" + url + "\"], " + tag + "[data-" + urlAttr + "=\"" + url + "\"]");
      if (!el.length) {
        if (tag === "link") {
          tag = "style";
        }
        el = $(document.createElement(tag));
        el.attr("data-" + urlAttr, url);
        if (rel) {
          el.attr('rel', rel);
        }
        if (type) {
          el.attr('type', type);
          if (type === 'text/javascript') {
            el.attr({
              async: 'async',
              src: url
            });
            this._loadingStarted();
            el.bind('load', __bind(function() {
              return this._loadingFinished();
            }, this));
            el.bind('abort', __bind(function() {
              this.errors.push(['requireElement', url, tag, type, rel]);
              return this._loadingFinished();
            }, this));
            $('head').append(el);
          } else {
            this._loadingStarted();
            $.ajax({
              method: 'GET',
              url: "" + url + "?" + (Math.random()),
              type: 'html',
              success: __bind(function(text) {
                el.text(text);
                $('head').append(el);
                return this._loadingFinished();
              }, this),
              error: __bind(function(xhr, status, e, data) {
                this.errors.push(['requireElement', url, tag, type, rel]);
                return this._loadingFinished();
              }, this)
            });
          }
        } else {
          el.attr(urlAttr, url);
          if (url.substr(0, 5) !== 'data:') {
            this._loadingStarted();
            el.bind('load', __bind(function() {
              return this._loadingFinished();
            }, this));
            el.bind('error', __bind(function() {
              this.errors.push(['requireElement', url, tag, type, rel]);
              return this._loadingFinished();
            }, this));
          }
        }
      } else if ((type != null) && el.attr('type') === 'text/plain') {
        el.detach().attr('type', type).appendTo($('head'));
      }
      return el;
    };
    BaseView.prototype._requireScript = function(url) {
      return this._requireElement(url, 'script', 'text/javascript');
    };
    BaseView.prototype._requireStyle = function(url) {
      return this._requireElement(url, 'link', 'text/css', 'stylesheet');
    };
    BaseView.prototype._requireTemplate = function(url) {
      return this._requireElement(url, 'script', 'text/html');
    };
    BaseView.prototype._requireImage = function(url) {
      return this._requireElement(url, 'img');
    };
    BaseView.prototype._requireData = function(options) {
      var result, _error, _ref2, _ref3, _ref4, _success;
      result = {};
      this._loadingStarted();
      if ((_ref2 = options.method) == null) {
        options.method = 'POST';
      }
      if ((_ref3 = options.type) == null) {
        options.type = 'json';
      }
      if ((_ref4 = options.headers) == null) {
        options.headers = {};
      }
      if (options.data && typeof options.data !== 'string') {
        options.headers['Content-Type'] = 'application/json';
        options.data = JSON.stringify(options.data);
      }
      _success = options.success;
      _error = options.error;
      options.success = __bind(function(data) {
        var key, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          key = data[_i];
          result[key] = data[key];
        }
        if (_success) {
          _success(data);
        }
        return this._loadingFinished();
      }, this);
      options.error = __bind(function(xhr, status, e, data) {
        this.errors.push(['requireData', status, e, data, options]);
        if (_error) {
          _error(xhr, status, e, data);
        }
        return this._loadingFinished();
      }, this);
      $.ajax(options);
      return result;
    };
    return BaseView;
  })();
})(ender);