/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build es5-basic domready sel bonzo bean morpheus reqwest hashchange route /Users/jaredcosulich/Src/coffee-box2d timeout upload wings jar ender-json
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context.$

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules[identifier] || window[identifier]
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules[name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  function boosh(s, r, els) {
    // string || node || nodelist || window
    if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      els = ender._select(s, r)
      els.selector = s
    } else els = isFinite(s.length) ? s : [s]
    return aug(els, boosh)
  }

  function ender(s, r) {
    return boosh(s, r)
  }

  aug(ender, {
      _VERSION: '0.3.6'
    , fn: boosh // for easy compat to jQuery plugins
    , ender: function (o, chain) {
        aug(chain ? boosh : ender, o)
      }
    , _select: function (s, r) {
        return (r || document).querySelectorAll(s)
      }
  })

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
      // return self for chaining
      return this
    },
    $: ender // handy reference to self
  })

  ender.noConflict = function () {
    context.$ = old
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this);

!function () {

  var module = { exports: {} }, exports = module.exports;

  if (!Function.prototype.bind) {
    Function.prototype.bind = function(that) {
      var Bound, args, target;
      target = this;
      if (typeof target.apply !== "function" || typeof target.call !== "function") {
        return new TypeError();
      }
      args = Array.prototype.slice.call(arguments);
      Bound = (function() {
        function Bound() {
          var Type, self;
          if (this instanceof Bound) {
            self = new (Type = (function() {
              function Type() {}
              Type.prototype = target.prototype;
              return Type;
            })());
            target.apply(self, args.concat(Array.prototype.slice.call(arguments)));
            return self;
          } else {
            return target.call.apply(target, args.concat(Array.prototype.slice.call(arguments)));
          }
        }
        Bound.prototype.length = (typeof target === "function" ? Math.max(target.length - args.length, 0) : 0);
        return Bound;
      })();
      return Bound;
    };
  }
  if (!Array.isArray) {
    Array.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    };
  }
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, that) {
      var i, val, _len;
      for (i = 0, _len = this.length; i < _len; i++) {
        val = this[i];
        if (i in this) {
          fn.call(that, val, i, this);
        }
      }
    };
  }
  if (!Array.prototype.map) {
    Array.prototype.map = function(fn, that) {
      var i, val, _len, _results;
      _results = [];
      for (i = 0, _len = this.length; i < _len; i++) {
        val = this[i];
        if (i in this) {
          _results.push(fn.call(that, val, i, this));
        }
      }
      return _results;
    };
  }
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fn, that) {
      var i, val, _len, _results;
      _results = [];
      for (i = 0, _len = this.length; i < _len; i++) {
        val = this[i];
        if (i in this && fn.call(that, val, i, this)) {
          _results.push(val);
        }
      }
      return _results;
    };
  }
  if (!Array.prototype.some) {
    Array.prototype.some = function(fn, that) {
      var i, val, _len;
      for (i = 0, _len = this.length; i < _len; i++) {
        val = this[i];
        if (i in this) {
          if (fn.call(that, val, i, this)) {
            return true;
          }
        }
      }
      return false;
    };
  }
  if (!Array.prototype.every) {
    Array.prototype.every = function(fn, that) {
      var i, val, _len;
      for (i = 0, _len = this.length; i < _len; i++) {
        val = this[i];
        if (i in this) {
          if (!fn.call(that, val, i, this)) {
            return false;
          }
        }
      }
      return true;
    };
  }
  if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(fn) {
      var i, result;
      i = 0;
      if (arguments.length > 1) {
        result = arguments[1];
      } else if (this.length) {
        result = this[i++];
      } else {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      while (i < this.length) {
        if (i in this) {
          result = fn.call(null, result, this[i], i, this);
        }
        i++;
      }
      return result;
    };
  }
  if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function(fn) {
      var i, result;
      i = this.length - 1;
      if (arguments.length > 1) {
        result = arguments[1];
      } else if (this.length) {
        result = this[i--];
      } else {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      while (i >= 0) {
        if (i in this) {
          result = fn.call(null, result, this[i], i, this);
        }
        i--;
      }
      return result;
    };
  }
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(value) {
      var i, _ref;
      i = (_ref = arguments[1]) != null ? _ref : 0;
      if (i < 0) {
        i += length;
      }
      i = Math.max(i, 0);
      while (i < this.length) {
        if (i in this) {
          if (this[i] === value) {
            return i;
          }
        }
        i++;
      }
      return -1;
    };
  }
  if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(value) {
      var i;
      i = arguments[1] || this.length;
      if (i < 0) {
        i += length;
      }
      i = Math.min(i, this.length - 1);
      while (i >= 0) {
        if (i in this) {
          if (this[i] === value) {
            return i;
          }
        }
        i--;
      }
      return -1;
    };
  }
  if (!Object.keys) {
    Object.keys = function(obj) {
      var key, _results;
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        _results = [];
        for (key in obj) {
          _results.push(key);
        }
        return _results;
      }
    };
  }
  if (!Date.now) {
    Date.now = function() {
      return new Date().getTime();
    };
  }
  if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function() {
      return ("" + (this.getUTCFullYear()) + "-" + (this.getUTCMonth() + 1) + "-" + (this.getUTCDate()) + "T") + ("" + (this.getUTCHours()) + ":" + (this.getUTCMinutes()) + ":" + (this.getUTCSeconds()) + "Z");
    };
  }
  if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function() {
      return this.toISOString();
    };
  }
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
  }

  provide("es5-basic", module.exports);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  !function (name, definition) {
    if (typeof define == 'function') define(definition)
    else if (typeof module != 'undefined') module.exports = definition()
    else this[name] = this['domReady'] = definition()
  }('domready', function (ready) {
  
    var fns = [], fn, f = false
      , doc = document
      , testEl = doc.documentElement
      , hack = testEl.doScroll
      , domContentLoaded = 'DOMContentLoaded'
      , addEventListener = 'addEventListener'
      , onreadystatechange = 'onreadystatechange'
      , loaded = /^loade|c/.test(doc.readyState)
  
    function flush(f) {
      loaded = 1
      while (f = fns.shift()) f()
    }
  
    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
      doc.removeEventListener(domContentLoaded, fn, f)
      flush()
    }, f)
  
  
    hack && doc.attachEvent(onreadystatechange, (fn = function () {
      if (/^c/.test(doc.readyState)) {
        doc.detachEvent(onreadystatechange, fn)
        flush()
      }
    }))
  
    return (ready = hack ?
      function (fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function () {
            try {
              testEl.doScroll('left')
            } catch (e) {
              return setTimeout(function() { ready(fn) }, 50)
            }
            fn()
          }()
      } :
      function (fn) {
        loaded ? fn() : fns.push(fn)
      })
  })

  provide("domready", module.exports);

  !function ($) {
    var ready = require('domready')
    $.ender({domReady: ready})
    $.ender({
      ready: function (f) {
        ready(f)
        return this
      }
    }, true)
  }(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Bonzo: DOM Utility (c) Dustin Diaz 2011
    * https://github.com/ded/bonzo
    * License MIT
    */
  !function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(name, definition)
    else this[name] = definition()
  }('bonzo', function() {
    var context = this
      , old = context.bonzo
      , win = window
      , doc = win.document
      , html = doc.documentElement
      , parentNode = 'parentNode'
      , query = null
      , specialAttributes = /^checked|value|selected$/
      , specialTags = /select|fieldset|table|tbody|tfoot|td|tr|colgroup/i
      , table = [ '<table>', '</table>', 1 ]
      , td = [ '<table><tbody><tr>', '</tr></tbody></table>', 3 ]
      , option = [ '<select>', '</select>', 1 ]
      , tagMap = {
          thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
          , tr: [ '<table><tbody>', '</tbody></table>', 2 ]
          , th: td , td: td
          , col: [ '<table><colgroup>', '</colgroup></table>', 2 ]
          , fieldset: [ '<form>', '</form>', 1 ]
          , legend: [ '<form><fieldset>', '</fieldset></form>', 2 ]
          , option: option
          , optgroup: option }
      , stateAttributes = /^checked|selected$/
      , ie = /msie/i.test(navigator.userAgent)
      , uidMap = {}
      , uuids = 0
      , digit = /^-?[\d\.]+$/
      , dattr = /^data-(.+)$/
      , px = 'px'
      , setAttribute = 'setAttribute'
      , getAttribute = 'getAttribute'
      , byTag = 'getElementsByTagName'
      , features = function() {
          var e = doc.createElement('p')
          e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>'
          return {
            hrefExtended: e[byTag]('a')[0][getAttribute]('href') != '#x' // IE < 8
            , autoTbody: e[byTag]('tbody').length !== 0 // IE < 8
            , computedStyle: doc.defaultView && doc.defaultView.getComputedStyle
            , cssFloat: e[byTag]('table')[0].style.styleFloat ? 'styleFloat' : 'cssFloat'
            , transform: function () {
                var props = ['webkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'Transform'], i
                for (i = 0; i < props.length; i++) {
                  if (props[i] in e.style) return props[i]
                }
              }()
          }
        }()
      , trimReplace = /(^\s*|\s*$)/g
      , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1 }
      , trim = String.prototype.trim ?
          function (s) {
            return s.trim()
          } :
          function (s) {
            return s.replace(trimReplace, '')
          }
  
    function classReg(c) {
      return new RegExp("(^|\\s+)" + c + "(\\s+|$)")
    }
  
    function each(ar, fn, scope) {
      for (var i = 0, l = ar.length; i < l; i++) fn.call(scope || ar[i], ar[i], i, ar)
      return ar
    }
  
    function deepEach(ar, fn, scope) {
      for (var i = 0, l = ar.length; i < l; i++) {
        if (isNode(ar[i])) {
          deepEach(ar[i].childNodes, fn, scope);
          fn.call(scope || ar[i], ar[i], i, ar);
        }
      }
      return ar;
    }
  
    function camelize(s) {
      return s.replace(/-(.)/g, function (m, m1) {
        return m1.toUpperCase()
      })
    }
  
    function decamelize(s) {
      return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
    }
  
    function data(el) {
      el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
      uid = el[getAttribute]('data-node-uid')
      return uidMap[uid] || (uidMap[uid] = {})
    }
  
    function clearData(el) {
      uid = el[getAttribute]('data-node-uid')
      uid && (delete uidMap[uid])
    }
  
    function dataValue(d) {
      try {
        return d === 'true' ? true : d === 'false' ? false : d === 'null' ? null : !isNaN(d) ? parseFloat(d) : d;
      } catch(e) {}
      return undefined
    }
  
    function isNode(node) {
      return node && node.nodeName && node.nodeType == 1
    }
  
    function some(ar, fn, scope, i) {
      for (i = 0, j = ar.length; i < j; ++i) if (fn.call(scope, ar[i], i, ar)) return true
      return false
    }
  
    function styleProperty(p) {
        (p == 'transform' && (p = features.transform)) ||
          (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + "Origin")) ||
          (p == 'float' && (p = features.cssFloat))
        return p ? camelize(p) : null
    }
  
    var getStyle = features.computedStyle ?
      function (el, property) {
        var value = null
          , computed = doc.defaultView.getComputedStyle(el, '')
        computed && (value = computed[property])
        return el.style[property] || value
      } :
  
      (ie && html.currentStyle) ?
  
      function (el, property) {
        if (property == 'opacity') {
          var val = 100
          try {
            val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
          } catch (e1) {
            try {
              val = el.filters('alpha').opacity
            } catch (e2) {}
          }
          return val / 100
        }
        var value = el.currentStyle ? el.currentStyle[property] : null
        return el.style[property] || value
      } :
  
      function (el, property) {
        return el.style[property]
      }
  
    // this insert method is intense
    function insert(target, host, fn) {
      var i = 0, self = host || this, r = []
        // target nodes could be a css selector if it's a string and a selector engine is present
        // otherwise, just use target
        , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
      // normalize each node in case it's still a string and we need to create nodes on the fly
      each(normalize(nodes), function (t) {
        each(self, function (el) {
          var n = !el[parentNode] || (el[parentNode] && !el[parentNode][parentNode]) ?
            function () {
              var c = el.cloneNode(true)
              // check for existence of an event cloner
              // preferably https://github.com/fat/bean
              // otherwise Bonzo won't do this for you
              self.$ && self.cloneEvents && self.$(c).cloneEvents(el)
              return c
            }() : el
          fn(t, n)
          r[i] = n
          i++
        })
      }, this)
      each(r, function (e, i) {
        self[i] = e
      })
      self.length = i
      return self
    }
  
    function xy(el, x, y) {
      var $el = bonzo(el)
        , style = $el.css('position')
        , offset = $el.offset()
        , rel = 'relative'
        , isRel = style == rel
        , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]
  
      if (style == 'static') {
        $el.css('position', rel)
        style = rel
      }
  
      isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
      isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)
  
      x != null && (el.style.left = x - offset.left + delta[0] + px)
      y != null && (el.style.top = y - offset.top + delta[1] + px)
  
    }
  
    function hasClass(el, c) {
      return classReg(c).test(el.className)
    }
    function addClass(el, c) {
      el.className = trim(el.className + ' ' + c)
    }
    function removeClass(el, c) {
      el.className = trim(el.className.replace(classReg(c), ' '))
    }
  
    // this allows method calling for setting values
    // example:
  
    // bonzo(elements).css('color', function (el) {
    //   return el.getAttribute('data-original-color')
    // })
  
    function setter(el, v) {
      return typeof v == 'function' ? v(el) : v
    }
  
    function Bonzo(elements) {
      this.length = 0
      if (elements) {
        elements = typeof elements !== 'string' &&
          !elements.nodeType &&
          typeof elements.length !== 'undefined' ?
            elements :
            [elements]
        this.length = elements.length
        for (var i = 0; i < elements.length; i++) {
          this[i] = elements[i]
        }
      }
    }
  
    Bonzo.prototype = {
  
        get: function (index) {
          return this[index]
        }
  
      , each: function (fn, scope) {
          return each(this, fn, scope)
        }
  
      , deepEach: function (fn, scope) {
          return deepEach(this, fn, scope)
        }
  
      , map: function (fn, reject) {
          var m = [], n, i
          for (i = 0; i < this.length; i++) {
            n = fn.call(this, this[i], i)
            reject ? (reject(n) && m.push(n)) : m.push(n)
          }
          return m
        }
  
      , first: function () {
          return bonzo(this.length ? this[0] : [])
        }
  
      , last: function () {
          return bonzo(this.length ? this[this.length - 1] : [])
        }
  
      , html: function (h, text) {
          var method = text ?
            html.textContent === undefined ?
              'innerText' :
              'textContent' :
            'innerHTML', m;
          function append(el) {
            each(normalize(h), function (node) {
              el.appendChild(node)
            })
          }
          return typeof h !== 'undefined' ?
              this.empty().each(function (el) {
                !text && (m = el.tagName.match(specialTags)) ?
                  append(el, m[0]) :
                  (el[method] = h)
              }) :
            this[0] ? this[0][method] : ''
        }
  
      , text: function (text) {
          return this.html(text, 1)
        }
  
      , addClass: function (c) {
          return this.each(function (el) {
            hasClass(el, setter(el, c)) || addClass(el, setter(el, c))
          })
        }
  
      , removeClass: function (c) {
          return this.each(function (el) {
            hasClass(el, setter(el, c)) && removeClass(el, setter(el, c))
          })
        }
  
      , hasClass: function (c) {
          return some(this, function (el) {
            return hasClass(el, c)
          })
        }
  
      , toggleClass: function (c, condition) {
          return this.each(function (el) {
            typeof condition !== 'undefined' ?
              condition ? addClass(el, c) : removeClass(el, c) :
              hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
          })
        }
  
      , show: function (type) {
          return this.each(function (el) {
            el.style.display = type || ''
          })
        }
  
      , hide: function () {
          return this.each(function (el) {
            el.style.display = 'none'
          })
        }
  
      , append: function (node) {
          return this.each(function (el) {
            each(normalize(node), function (i) {
              el.appendChild(i)
            })
          })
        }
  
      , prepend: function (node) {
          return this.each(function (el) {
            var first = el.firstChild
            each(normalize(node), function (i) {
              el.insertBefore(i, first)
            })
          })
        }
  
      , appendTo: function (target, host) {
          return insert.call(this, target, host, function (t, el) {
            t.appendChild(el)
          })
        }
  
      , prependTo: function (target, host) {
          return insert.call(this, target, host, function (t, el) {
            t.insertBefore(el, t.firstChild)
          })
        }
  
      , next: function () {
          return this.related('nextSibling')
        }
  
      , previous: function () {
          return this.related('previousSibling')
        }
  
      , related: function (method) {
          return this.map(
            function (el) {
              el = el[method]
              while (el && el.nodeType !== 1) {
                el = el[method]
              }
              return el || 0
            },
            function (el) {
              return el
            }
          )
        }
  
      , before: function (node) {
          return this.each(function (el) {
            each(bonzo.create(node), function (i) {
              el[parentNode].insertBefore(i, el)
            })
          })
        }
  
      , after: function (node) {
          return this.each(function (el) {
            each(bonzo.create(node), function (i) {
              el[parentNode].insertBefore(i, el.nextSibling)
            })
          })
        }
  
      , insertBefore: function (target, host) {
          return insert.call(this, target, host, function (t, el) {
            t[parentNode].insertBefore(el, t)
          })
        }
  
      , insertAfter: function (target, host) {
          return insert.call(this, target, host, function (t, el) {
            var sibling = t.nextSibling
            if (sibling) {
              t[parentNode].insertBefore(el, sibling);
            }
            else {
              t[parentNode].appendChild(el)
            }
          })
        }
  
      , replaceWith: function(html) {
          this.deepEach(clearData)
  
          return this.each(function (el) {
            el.parentNode.replaceChild(bonzo.create(html)[0], el)
          })
        }
  
      , css: function (o, v, p) {
          // is this a request for just getting a style?
          if (v === undefined && typeof o == 'string') {
            // repurpose 'v'
            v = this[0]
            if (!v) {
              return null
            }
            if (v === doc || v === win) {
              p = (v === doc) ? bonzo.doc() : bonzo.viewport()
              return o == 'width' ? p.width : o == 'height' ? p.height : ''
            }
            return (o = styleProperty(o)) ? getStyle(v, o) : null
          }
          var iter = o
          if (typeof o == 'string') {
            iter = {}
            iter[o] = v
          }
  
          if (ie && iter.opacity) {
            // oh this 'ol gamut
            iter.filter = 'alpha(opacity=' + (iter.opacity * 100) + ')'
            // give it layout
            iter.zoom = o.zoom || 1;
            delete iter.opacity;
          }
  
          function fn(el, p, v) {
            for (var k in iter) {
              if (iter.hasOwnProperty(k)) {
                v = iter[k];
                // change "5" to "5px" - unless you're line-height, which is allowed
                (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
                el.style[p] = setter(el, v)
              }
            }
          }
          return this.each(fn)
        }
  
      , offset: function (x, y) {
          if (typeof x == 'number' || typeof y == 'number') {
            return this.each(function (el) {
              xy(el, x, y)
            })
          }
          if (!this[0]) return {
              top: 0
            , left: 0
            , height: 0
            , width: 0
          }
          var el = this[0]
            , width = el.offsetWidth
            , height = el.offsetHeight
            , top = el.offsetTop
            , left = el.offsetLeft
          while (el = el.offsetParent) {
            top = top + el.offsetTop
            left = left + el.offsetLeft
          }
  
          return {
              top: top
            , left: left
            , height: height
            , width: width
          }
        }
  
      , dim: function () {
          var el = this[0]
            , orig = !el.offsetWidth && !el.offsetHeight ?
               // el isn't visible, can't be measured properly, so fix that
               function (t, s) {
                  s = {
                      position: el.style.position || ''
                    , visibility: el.style.visibility || ''
                    , display: el.style.display || ''
                  }
                  t.first().css({
                      position: 'absolute'
                    , visibility: 'hidden'
                    , display: 'block'
                  })
                  return s
                }(this) : null
            , width = el.offsetWidth
            , height = el.offsetHeight
  
          orig && this.first().css(orig)
          return {
              height: height
            , width: width
          }
        }
  
      , attr: function (k, v) {
          var el = this[0]
          if (typeof k != 'string' && !(k instanceof String)) {
            for (var n in k) {
              k.hasOwnProperty(n) && this.attr(n, k[n])
            }
            return this
          }
          return typeof v == 'undefined' ?
            specialAttributes.test(k) ?
              stateAttributes.test(k) && typeof el[k] == 'string' ?
                true : el[k] : (k == 'href' || k =='src') && features.hrefExtended ?
                  el[getAttribute](k, 2) : el[getAttribute](k) :
            this.each(function (el) {
              specialAttributes.test(k) ? (el[k] = setter(el, v)) : el[setAttribute](k, setter(el, v))
            })
        }
  
      , val: function (s) {
          return (typeof s == 'string') ? this.attr('value', s) : this[0].value
        }
  
      , removeAttr: function (k) {
          return this.each(function (el) {
            stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
          })
        }
  
      , data: function (k, v) {
          var el = this[0], uid, o, m
          if (typeof v === 'undefined') {
            o = data(el)
            if (typeof k === 'undefined') {
              each(el.attributes, function(a) {
                (m = (''+a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
              })
              return o
            } else {
              return typeof o[k] === 'undefined' ?
                (o[k] = dataValue(this.attr('data-' + decamelize(k)))) : o[k]
            }
          } else {
            return this.each(function (el) { data(el)[k] = v })
          }
        }
  
      , remove: function () {
          this.deepEach(clearData)
  
          return this.each(function (el) {
            el[parentNode] && el[parentNode].removeChild(el)
          })
        }
  
      , empty: function () {
          return this.each(function (el) {
            deepEach(el.childNodes, clearData)
  
            while (el.firstChild) {
              el.removeChild(el.firstChild)
            }
          })
        }
  
      , detach: function () {
          return this.map(function (el) {
            return el[parentNode].removeChild(el)
          })
        }
  
      , scrollTop: function (y) {
          return scroll.call(this, null, y, 'y')
        }
  
      , scrollLeft: function (x) {
          return scroll.call(this, x, null, 'x')
        }
  
      , toggle: function (callback, type) {
          this.each(function (el) {
            el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : type || ''
          })
          callback && callback()
          return this
        }
    }
  
    function normalize(node) {
      return typeof node == 'string' ? bonzo.create(node) : isNode(node) ? [node] : node // assume [nodes]
    }
  
    function scroll(x, y, type) {
      var el = this[0]
      if (x == null && y == null) {
        return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
      }
      if (isBody(el)) {
        win.scrollTo(x, y)
      } else {
        x != null && (el.scrollLeft = x)
        y != null && (el.scrollTop = y)
      }
      return this
    }
  
    function isBody(element) {
      return element === win || (/^(?:body|html)$/i).test(element.tagName)
    }
  
    function getWindowScroll() {
      return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
    }
  
    function bonzo(els, host) {
      return new Bonzo(els, host)
    }
  
    bonzo.setQueryEngine = function (q) {
      query = q;
      delete bonzo.setQueryEngine
    }
  
    bonzo.aug = function (o, target) {
      for (var k in o) {
        o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
      }
    }
  
    bonzo.create = function (node) {
      return typeof node == 'string' && node !== '' ?
        function () {
          var tag = /^\s*<([^\s>]+)/.exec(node)
            , el = doc.createElement('div')
            , els = []
            , p = tag ? tagMap[tag[1].toLowerCase()] : null
            , dep = p ? p[2] + 1 : 1
            , pn = parentNode
            , tb = features.autoTbody && p && p[0] == '<table>' && !(/<tbody/i).test(node)
  
          el.innerHTML = p ? (p[0] + node + p[1]) : node
          while (dep--) el = el.firstChild
          do {
            // tbody special case for IE<8, creates tbody on any empty table
            // we don't want it if we're just after a <thead>, <caption>, etc.
            if ((!tag || el.nodeType == 1) && (!tb || el.tagName.toLowerCase() != 'tbody')) {
              els.push(el)
            }
          } while (el = el.nextSibling)
          // IE < 9 gives us a parentNode which messes up insert() check for cloning
          // `dep` > 1 can also cause problems with the insert() check (must do this last)
          each(els, function(el) { el[pn] && el[pn].removeChild(el) })
          return els
  
        }() : isNode(node) ? [node.cloneNode(true)] : []
    }
  
    bonzo.doc = function () {
      var vp = bonzo.viewport()
      return {
          width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
        , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
      }
    }
  
    bonzo.firstChild = function (el) {
      for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
        if (c[i].nodeType === 1) e = c[j = i]
      }
      return e
    }
  
    bonzo.viewport = function () {
      return {
          width: ie ? html.clientWidth : self.innerWidth
        , height: ie ? html.clientHeight : self.innerHeight
      }
    }
  
    bonzo.isAncestor = 'compareDocumentPosition' in html ?
      function (container, element) {
        return (container.compareDocumentPosition(element) & 16) == 16
      } : 'contains' in html ?
      function (container, element) {
        return container !== element && container.contains(element);
      } :
      function (container, element) {
        while (element = element[parentNode]) {
          if (element === container) {
            return true
          }
        }
        return false
      }
  
    bonzo.noConflict = function () {
      context.bonzo = old
      return this
    }
  
    return bonzo
  })
  

  provide("bonzo", module.exports);

  !function ($) {
  
    var b = require('bonzo')
    b.setQueryEngine($)
    $.ender(b)
    $.ender(b(), true)
    $.ender({
      create: function (node) {
        return $(b.create(node))
      }
    })
  
    $.id = function (id) {
      return $([document.getElementById(id)])
    }
  
    function indexOf(ar, val) {
      for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
      return -1
    }
  
    function uniq(ar) {
      var a = [], i, j
      label:
      for (i = 0; i < ar.length; i++) {
        for (j = 0; j < a.length; j++) {
          if (a[j] == ar[i]) {
            continue label
          }
        }
        a[a.length] = ar[i]
      }
      return a
    }
  
    $.ender({
      closest: function (selector) {
        return $(this.parents()).matching(selector).first()
      },
  
      first: function () {
        return $(this.length ? this[0] : this)
      },
  
      last: function () {
        return $(this.length ? this[this.length - 1] : [])
      },
  
      next: function () {
        return $(b(this).next())
      },
  
      previous: function () {
        return $(b(this).previous())
      },
  
      appendTo: function (t) {
        return b(this.selector).appendTo(t, this)
      },
  
      prependTo: function (t) {
        return b(this.selector).prependTo(t, this)
      },
  
      insertAfter: function (t) {
        return b(this.selector).insertAfter(t, this)
      },
  
      insertBefore: function (t) {
        return b(this.selector).insertBefore(t, this)
      },
  
      parents: function () {
        var i, l, p, r = []
        for (i = 0, l = this.length; i < l; i++) {
          p = this[i]
          while (p = p.parentNode) p.nodeType == 1 && r.push(p)
        }
        return $(uniq(r))
      },
  
      siblings: function () {
        var i, l, p, r = []
        for (i = 0, l = this.length; i < l; i++) {
          p = this[i]
          while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
          p = this[i]
          while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
        }
        return $(uniq(r))
      },
  
      children: function () {
        var i, el, r = []
        for (i = 0, l = this.length; i < l; i++) {
          if (!(el = b.firstChild(this[i]))) continue;
          r.push(el)
          while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
        }
        return $(uniq(r))
      },
  
      height: function (v) {
        return dimension(v, this, 'height')
      },
  
      width: function (v) {
        return dimension(v, this, 'width')
      }
    }, true)
  
    function dimension(v, self, which) {
      return v ?
        self.css(which, v) :
        function (r) {
          if (!self[0]) return 0
          r = parseInt(self.css(which), 10);
          return isNaN(r) ? self[0]['offset' + which.replace(/^\w/, function (m) {return m.toUpperCase()})] : r
        }()
    }
  
  }(ender);
  

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * bean.js - copyright Jacob Thornton 2011
    * https://github.com/fat/bean
    * MIT License
    * special thanks to:
    * dean edwards: http://dean.edwards.name/
    * dperini: https://github.com/dperini/nwevents
    * the entire mootools team: github.com/mootools/mootools-core
    */
  !function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd  == 'object') define(definition);
    else this[name] = definition();
  }('bean', function () {
    var win = window,
        __uid = 1,
        registry = {},
        collected = {},
        overOut = /over|out/,
        namespace = /[^\.]*(?=\..*)\.|.*/,
        stripName = /\..*/,
        addEvent = 'addEventListener',
        attachEvent = 'attachEvent',
        removeEvent = 'removeEventListener',
        detachEvent = 'detachEvent',
        doc = document || {},
        root = doc.documentElement || {},
        W3C_MODEL = root[addEvent],
        eventSupport = W3C_MODEL ? addEvent : attachEvent,
  
    isDescendant = function (parent, child) {
      var node = child.parentNode;
      while (node !== null) {
        if (node == parent) {
          return true;
        }
        node = node.parentNode;
      }
    },
  
    retrieveUid = function (obj, uid) {
      return (obj.__uid = uid && (uid + '::' + __uid++) || obj.__uid || __uid++);
    },
  
    retrieveEvents = function (element) {
      var uid = retrieveUid(element);
      return (registry[uid] = registry[uid] || {});
    },
  
    listener = W3C_MODEL ? function (element, type, fn, add) {
      element[add ? addEvent : removeEvent](type, fn, false);
    } : function (element, type, fn, add, custom) {
      if (custom && add && element['_on' + custom] === null) {
        element['_on' + custom] = 0;
      }
      element[add ? attachEvent : detachEvent]('on' + type, fn);
    },
  
    nativeHandler = function (element, fn, args) {
      return function (event) {
        event = fixEvent(event || ((this.ownerDocument || this.document || this).parentWindow || win).event);
        return fn.apply(element, [event].concat(args));
      };
    },
  
    customHandler = function (element, fn, type, condition, args) {
      return function (event) {
        if (condition ? condition.apply(this, arguments) : W3C_MODEL ? true : event && event.propertyName == '_on' + type || !event) {
          event = event ? fixEvent(event || ((this.ownerDocument || this.document || this).parentWindow || win).event) : null;
          fn.apply(element, Array.prototype.slice.call(arguments, event ? 0 : 1).concat(args));
        }
      };
    },
  
    addListener = function (element, orgType, fn, args) {
      var type = orgType.replace(stripName, ''),
          events = retrieveEvents(element),
          handlers = events[type] || (events[type] = {}),
          originalFn = fn,
          uid = retrieveUid(fn, orgType.replace(namespace, ''));
      if (handlers[uid]) {
        return element;
      }
      var custom = customEvents[type];
      if (custom) {
        fn = custom.condition ? customHandler(element, fn, type, custom.condition) : fn;
        type = custom.base || type;
      }
      var isNative = nativeEvents[type];
      fn = isNative ? nativeHandler(element, fn, args) : customHandler(element, fn, type, false, args);
      isNative = W3C_MODEL || isNative;
      if (type == 'unload') {
        var org = fn;
        fn = function () {
          removeListener(element, type, fn) && org();
        };
      }
      element[eventSupport] && listener(element, isNative ? type : 'propertychange', fn, true, !isNative && type);
      handlers[uid] = fn;
      fn.__uid = uid;
      fn.__originalFn = originalFn;
      return type == 'unload' ? element : (collected[retrieveUid(element)] = element);
    },
  
    removeListener = function (element, orgType, handler) {
      var uid, names, uids, i, events = retrieveEvents(element), type = orgType.replace(stripName, '');
      if (!events || !events[type]) {
        return element;
      }
      names = orgType.replace(namespace, '');
      uids = names ? names.split('.') : [handler.__uid];
  
      function destroyHandler(uid) {
        handler = events[type][uid];
        if (!handler) {
          return;
        }
        delete events[type][uid];
        if (element[eventSupport]) {
          type = customEvents[type] ? customEvents[type].base : type;
          var isNative = W3C_MODEL || nativeEvents[type];
          listener(element, isNative ? type : 'propertychange', handler, false, !isNative && type);
        }
      }
  
      destroyHandler(names); //get combos
      for (i = uids.length; i--; destroyHandler(uids[i])) {} //get singles
  
      return element;
    },
  
    del = function (selector, fn, $) {
      return function (e) {
        var array = typeof selector == 'string' ? $(selector, this) : selector;
        for (var target = e.target; target && target != this; target = target.parentNode) {
          for (var i = array.length; i--;) {
            if (array[i] == target) {
              return fn.apply(target, arguments);
            }
          }
        }
      };
    },
  
    add = function (element, events, fn, delfn, $) {
      if (typeof events == 'object' && !fn) {
        for (var type in events) {
          events.hasOwnProperty(type) && add(element, type, events[type]);
        }
      } else {
        var isDel = typeof fn == 'string', types = (isDel ? fn : events).split(' ');
        fn = isDel ? del(events, delfn, $) : fn;
        for (var i = types.length; i--;) {
          addListener(element, types[i], fn, Array.prototype.slice.call(arguments, isDel ? 4 : 3));
        }
      }
      return element;
    },
  
    remove = function (element, orgEvents, fn) {
      var k, m, type, events, i,
          isString = typeof(orgEvents) == 'string',
          names = isString && orgEvents.replace(namespace, ''),
          rm = removeListener,
          attached = retrieveEvents(element);
      names = names && names.split('.');
      if (isString && /\s/.test(orgEvents)) {
        orgEvents = orgEvents.split(' ');
        i = orgEvents.length - 1;
        while (remove(element, orgEvents[i]) && i--) {}
        return element;
      }
      events = isString ? orgEvents.replace(stripName, '') : orgEvents;
      if (!attached || names || (isString && !attached[events])) {
        for (k in attached) {
          if (attached.hasOwnProperty(k)) {
            for (i in attached[k]) {
              for (m = names.length; m--;) {
                attached[k].hasOwnProperty(i) && new RegExp('^' + names[m] + '::\\d*(\\..*)?$').test(i) && rm(element, [k, i].join('.'));
              }
            }
          }
        }
        return element;
      }
      if (typeof fn == 'function') {
        rm(element, events, fn);
      } else if (names) {
        rm(element, orgEvents);
      } else {
        rm = events ? rm : remove;
        type = isString && events;
        events = events ? (fn || attached[events] || events) : attached;
        for (k in events) {
          if (events.hasOwnProperty(k)) {
            rm(element, type || k, events[k]);
            delete events[k]; // remove unused leaf keys
          }
        }
      }
      return element;
    },
  
    fire = function (element, type, args) {
      var evt, k, i, m, types = type.split(' ');
      for (i = types.length; i--;) {
        type = types[i].replace(stripName, '');
        var isNative = nativeEvents[type],
            isNamespace = types[i].replace(namespace, ''),
            handlers = retrieveEvents(element)[type];
        if (isNamespace) {
          isNamespace = isNamespace.split('.');
          for (k = isNamespace.length; k--;) {
            for (m in handlers) {
              handlers.hasOwnProperty(m) && new RegExp('^' + isNamespace[k] + '::\\d*(\\..*)?$').test(m) && handlers[m].apply(element, [false].concat(args));
            }
          }
        } else if (!args && element[eventSupport]) {
          fireListener(isNative, type, element);
        } else {
          for (k in handlers) {
            handlers.hasOwnProperty(k) && handlers[k].apply(element, [false].concat(args));
          }
        }
      }
      return element;
    },
  
    fireListener = W3C_MODEL ? function (isNative, type, element) {
      evt = document.createEvent(isNative ? "HTMLEvents" : "UIEvents");
      evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1);
      element.dispatchEvent(evt);
    } : function (isNative, type, element) {
      isNative ? element.fireEvent('on' + type, document.createEventObject()) : element['_on' + type]++;
    },
  
    clone = function (element, from, type) {
      var events = retrieveEvents(from), obj, k;
      var uid = retrieveUid(element);
      obj = type ? events[type] : events;
      for (k in obj) {
        obj.hasOwnProperty(k) && (type ? add : clone)(element, type || from, type ? obj[k].__originalFn : k);
      }
      return element;
    },
  
    fixEvent = function (e) {
      var result = {};
      if (!e) {
        return result;
      }
      var type = e.type, target = e.target || e.srcElement;
      result.preventDefault = fixEvent.preventDefault(e);
      result.stopPropagation = fixEvent.stopPropagation(e);
      result.target = target && target.nodeType == 3 ? target.parentNode : target;
      if (~type.indexOf('key')) {
        result.keyCode = e.which || e.keyCode;
      } else if ((/click|mouse|menu/i).test(type)) {
        result.rightClick = e.which == 3 || e.button == 2;
        result.pos = { x: 0, y: 0 };
        if (e.pageX || e.pageY) {
          result.clientX = e.pageX;
          result.clientY = e.pageY;
        } else if (e.clientX || e.clientY) {
          result.clientX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          result.clientY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        overOut.test(type) && (result.relatedTarget = e.relatedTarget || e[(type == 'mouseover' ? 'from' : 'to') + 'Element']);
      }
      for (var k in e) {
        if (!(k in result)) {
          result[k] = e[k];
        }
      }
      return result;
    };
  
    fixEvent.preventDefault = function (e) {
      return function () {
        if (e.preventDefault) {
          e.preventDefault();
        }
        else {
          e.returnValue = false;
        }
      };
    };
  
    fixEvent.stopPropagation = function (e) {
      return function () {
        if (e.stopPropagation) {
          e.stopPropagation();
        } else {
          e.cancelBubble = true;
        }
      };
    };
  
    var nativeEvents = { click: 1, dblclick: 1, mouseup: 1, mousedown: 1, contextmenu: 1, //mouse buttons
      mousewheel: 1, DOMMouseScroll: 1, //mouse wheel
      mouseover: 1, mouseout: 1, mousemove: 1, selectstart: 1, selectend: 1, //mouse movement
      keydown: 1, keypress: 1, keyup: 1, //keyboard
      orientationchange: 1, // mobile
      touchstart: 1, touchmove: 1, touchend: 1, touchcancel: 1, // touch
      gesturestart: 1, gesturechange: 1, gestureend: 1, // gesture
      focus: 1, blur: 1, change: 1, reset: 1, select: 1, submit: 1, //form elements
      load: 1, unload: 1, beforeunload: 1, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
      error: 1, abort: 1, scroll: 1 }; //misc
  
    function check(event) {
      var related = event.relatedTarget;
      if (!related) {
        return related === null;
      }
      return (related != this && related.prefix != 'xul' && !/document/.test(this.toString()) && !isDescendant(this, related));
    }
  
    var customEvents = {
      mouseenter: { base: 'mouseover', condition: check },
      mouseleave: { base: 'mouseout', condition: check },
      mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
    };
  
    var bean = { add: add, remove: remove, clone: clone, fire: fire };
  
    var clean = function (el) {
      var uid = remove(el).__uid;
      if (uid) {
        delete collected[uid];
        delete registry[uid];
      }
    };
  
    if (win[attachEvent]) {
      add(win, 'unload', function () {
        for (var k in collected) {
          collected.hasOwnProperty(k) && clean(collected[k]);
        }
        win.CollectGarbage && CollectGarbage();
      });
    }
  
    bean.noConflict = function () {
      context.bean = old;
      return this;
    };
  
    return bean;
  });

  provide("bean", module.exports);

  !function ($) {
    var b = require('bean'),
        integrate = function (method, type, method2) {
          var _args = type ? [type] : [];
          return function () {
            for (var args, i = 0, l = this.length; i < l; i++) {
              args = [this[i]].concat(_args, Array.prototype.slice.call(arguments, 0));
              args.length == 4 && args.push($);
              !arguments.length && method == 'add' && type && (method = 'fire');
              b[method].apply(this, args);
            }
            return this;
          };
        };
  
    var add = integrate('add'),
        remove = integrate('remove'),
        fire = integrate('fire');
  
    var methods = {
  
      on: add,
      addListener: add,
      bind: add,
      listen: add,
      delegate: add,
  
      unbind: remove,
      unlisten: remove,
      removeListener: remove,
      undelegate: remove,
  
      emit: fire,
      trigger: fire,
  
      cloneEvents: integrate('clone'),
  
      hover: function (enter, leave, i) { // i for internal
        for (i = this.length; i--;) {
          b.add.call(this, this[i], 'mouseenter', enter);
          b.add.call(this, this[i], 'mouseleave', leave);
        }
        return this;
      }
    };
  
    var i, shortcuts = [
      'blur', 'change', 'click', 'dblclick', 'error', 'focus', 'focusin',
      'focusout', 'keydown', 'keypress', 'keyup', 'load', 'mousedown',
      'mouseenter', 'mouseleave', 'mouseout', 'mouseover', 'mouseup', 'mousemove',
      'resize', 'scroll', 'select', 'submit', 'unload'
    ];
  
    for (i = shortcuts.length; i--;) {
      methods[shortcuts[i]] = integrate('add', shortcuts[i]);
    }
  
    $.ender(methods, true);
  }(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Morpheus - A Brilliant Animator
    * https://github.com/ded/morpheus - (c) Dustin Diaz 2011
    * License MIT
    */
  !function (name, definition) {
    if (typeof define == 'function') define(definition)
    else if (typeof module != 'undefined') module.exports = definition()
    else this[name] = definition()
  }('morpheus', function () {
  
    var context = this
      , doc = document
      , win = window
      , html = doc.documentElement
      , rgbOhex = /^rgb\(|#/
      , relVal = /^([+\-])=([\d\.]+)/
      , numUnit = /^(?:[\+\-]=)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/
      , rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/
      , scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/
      , skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/
      , translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/
        // these elements do not require 'px'
      , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, transform: 1}
  
        // which property name does this browser use for transform
      , transform = function () {
          var styles = doc.createElement('a').style
            , props = ['webkitTransform','MozTransform','OTransform','msTransform','Transform'], i
          for (i = 0; i < props.length; i++) {
            if (props[i] in styles) return props[i]
          }
        }()
  
        // does this browser support the opacity property?
      , opasity = function () {
          return typeof doc.createElement('a').style.opacity !== 'undefined'
        }()
  
        // initial style is determined by the elements themselves
      , getStyle = doc.defaultView && doc.defaultView.getComputedStyle ?
          function (el, property) {
            property = property == 'transform' ? transform : property
            var value = null
              , computed = doc.defaultView.getComputedStyle(el, '')
            computed && (value = computed[camelize(property)])
            return el.style[property] || value
          } : html.currentStyle ?
  
          function (el, property) {
            property = camelize(property)
  
            if (property == 'opacity') {
              var val = 100
              try {
                val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
              } catch (e1) {
                try {
                  val = el.filters('alpha').opacity
                } catch (e2) {}
              }
              return val / 100
            }
            var value = el.currentStyle ? el.currentStyle[property] : null
            return el.style[property] || value
          } :
          function (el, property) {
            return el.style[camelize(property)]
          }
      , frame = function () {
          // native animation frames
          // http://webstuff.nfshost.com/anim-timing/Overview.html
          // http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
          return win.requestAnimationFrame  ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame    ||
            win.oRequestAnimationFrame      ||
            win.msRequestAnimationFrame     ||
            function (callback) {
              win.setTimeout(function () {
                callback(+new Date())
              }, 10)
            }
        }()
  
    function parseTransform(style, base) {
      var values = {}, m
      if (m = style.match(rotate)) values.rotate = by(m[1], base ? base.rotate : null)
      if (m = style.match(scale)) values.scale = by(m[1], base ? base.scale : null)
      if (m = style.match(skew)) {values.skewx = by(m[1], base ? base.skewx : null); values.skewy = by(m[3], base ? base.skewy : null)}
      if (m = style.match(translate)) {values.translatex = by(m[1], base ? base.translatex : null); values.translatey = by(m[3], base ? base.translatey : null)}
      return values
    }
  
    function formatTransform(v) {
      var s = ''
      if ('rotate' in v) s += 'rotate(' + v.rotate + 'deg) '
      if ('scale' in v) s += 'scale(' + v.scale + ') '
      if ('translatex' in v) s += 'translate(' + v.translatex + 'px,' + v.translatey + 'px) '
      if ('skewx' in v) s += 'skew(' + v.skewx + 'deg,' + v.skewy + 'deg)'
      return s
    }
  
    function rgb(r, g, b) {
      return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
    }
  
    // convert rgb and short hex to long hex
    function toHex(c) {
      var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c)
      return (m ? rgb(m[1], m[2], m[3]) : c)
        .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3') // short to long
    }
  
    // change font-size => fontSize etc.
    function camelize(s) {
      return s.replace(/-(.)/g, function (m, m1) {
        return m1.toUpperCase()
      })
    }
  
    function fun(f) {
      return typeof f == 'function'
    }
  
    /**
      * Core tween method that requests each frame
      * @param duration: time in milliseconds. defaults to 1000
      * @param fn: tween frame callback function receiving 'position'
      * @param done {optional}: complete callback function
      * @param ease {optional}: easing method. defaults to easeOut
      * @param from {optional}: integer to start from
      * @param to {optional}: integer to end at
      * @returns method to stop the animation
      */
    function tween(duration, fn, done, ease, from, to) {
      ease = fun(ease) ? ease : morpheus.easings[ease] || function (t) {
        // default to a pleasant-to-the-eye easeOut (like native animations)
        return Math.sin(t * Math.PI / 2)
      }
      var time = duration || 1000
        , diff = to - from
        , start = +new Date()
        , stop = 0
        , end = 0
      frame(run)
  
      function run(t) {
        var delta = t - start
        if (delta > time || stop) {
          to = isFinite(to) ? to : 1
          stop ? end && fn(to) : fn(to)
          return done && done()
        }
        // if you don't specify a 'to' you can use tween as a generic delta tweener
        // cool, eh?
        isFinite(to) ?
          fn((diff * ease(delta / time)) + from) :
          fn(ease(delta / time))
        frame(run)
      }
      return {
        stop: function (jump) {
          stop = 1
          end = jump // jump to end of animation?
          if (!jump) done = null // remove callback if not jumping to end
        }
      }
    }
  
    /**
      * generic bezier method for animating x|y coordinates
      * minimum of 2 points required (start and end).
      * first point start, last point end
      * additional control points are optional (but why else would you use this anyway ;)
      * @param points: array containing control points
         [[0, 0], [100, 200], [200, 100]]
      * @param pos: current be(tween) position represented as float  0 - 1
      * @return [x, y]
      */
    function bezier(points, pos) {
      var n = points.length, r = [], i, j
      for (i = 0; i < n; ++i) {
        r[i] = [points[i][0], points[i][1]]
      }
      for (j = 1; j < n; ++j) {
        for (i = 0; i < n - j; ++i) {
          r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
          r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
        }
      }
      return [r[0][0], r[0][1]]
    }
  
    // this gets you the next hex in line according to a 'position'
    function nextColor(pos, start, finish) {
      var r = [], i, e
      for (i = 0; i < 6; i++) {
        from = Math.min(15, parseInt(start.charAt(i),  16))
        to   = Math.min(15, parseInt(finish.charAt(i), 16))
        e = Math.floor((to - from) * pos + from)
        e = e > 15 ? 15 : e < 0 ? 0 : e
        r[i] = e.toString(16)
      }
      return '#' + r.join('')
    }
  
    // this retreives the frame value within a sequence
    function getTweenVal(pos, units, begin, end, k, i, v) {
      if (k == 'transform') {
        v = {}
        for(var t in begin[i][k]) {
          v[t] = (t in end[i][k]) ? Math.round(((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) * 1000) / 1000 : begin[i][k][t]
        }
        return v
      } else if (typeof begin[i][k] == 'string') {
        return nextColor(pos, begin[i][k], end[i][k])
      } else {
        // round so we don't get crazy long floats
        v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * 1000) / 1000
        // some css properties don't require a unit (like zIndex, lineHeight, opacity)
        if (!(k in unitless)) v += units[i][k] || 'px'
        return v
      }
    }
  
    // support for relative movement via '+=n' or '-=n'
    function by(val, start, m, r, i) {
      return (m = relVal.exec(val)) ?
        (i = parseFloat(m[2])) && (start + (m[1] == '+' ? 1 : -1) * i) :
        parseFloat(val)
    }
  
    /**
      * morpheus:
      * @param element(s): HTMLElement(s)
      * @param options: mixed bag between CSS Style properties & animation options
      *  - {n} CSS properties|values
      *     - value can be strings, integers,
      *     - or callback function that receives element to be animated. method must return value to be tweened
      *     - relative animations start with += or -= followed by integer
      *  - duration: time in ms - defaults to 1000(ms)
      *  - easing: a transition method - defaults to an 'easeOut' algorithm
      *  - complete: a callback method for when all elements have finished
      *  - bezier: array of arrays containing x|y coordinates that define the bezier points. defaults to none
      *     - this may also be a function that receives element to be animated. it must return a value
      */
    function morpheus(elements, options) {
      var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [], i
        , complete = options.complete
        , duration = options.duration
        , ease = options.easing
        , points = options.bezier
        , begin = []
        , end = []
        , units = []
        , bez = []
        , originalLeft
        , originalTop
  
      delete options.complete;
      delete options.duration;
      delete options.easing;
      delete options.bezier;
  
      if (points) {
        // remember the original values for top|left
        originalLeft = options.left;
        originalTop = options.top;
        delete options.right;
        delete options.bottom;
        delete options.left;
        delete options.top;
      }
  
      for (i = els.length; i--;) {
  
        // record beginning and end states to calculate positions
        begin[i] = {}
        end[i] = {}
        units[i] = {}
  
        // are we 'moving'?
        if (points) {
  
          var left = getStyle(els[i], 'left')
            , top = getStyle(els[i], 'top')
            , xy = [by(fun(originalLeft) ? originalLeft(els[i]) : originalLeft || 0, parseFloat(left)),
                    by(fun(originalTop) ? originalTop(els[i]) : originalTop || 0, parseFloat(top))]
  
          bez[i] = fun(points) ? points(els[i], xy) : points
          bez[i].push(xy)
          bez[i].unshift([
              parseInt(left, 10)
            , parseInt(top, 10)
          ])
        }
  
        for (var k in options) {
          var v = getStyle(els[i], k), unit
            , tmp = fun(options[k]) ? options[k](els[i]) : options[k]
          if (typeof tmp == 'string' &&
              rgbOhex.test(tmp) &&
              !rgbOhex.test(v)) {
            delete options[k]; // remove key :(
            continue; // cannot animate colors like 'orange' or 'transparent'
                      // only #xxx, #xxxxxx, rgb(n,n,n)
          }
  
          begin[i][k] = k == 'transform' ? parseTransform(v) :
            typeof tmp == 'string' && rgbOhex.test(tmp) ?
              toHex(v).slice(1) :
              parseFloat(v)
          end[i][k] = k == 'transform' ? parseTransform(tmp,begin[i][k]) :
            typeof tmp == 'string' && tmp.charAt(0) == '#' ?
              toHex(tmp).slice(1) :
              by(tmp, parseFloat(v));
          // record original unit
          (typeof tmp == 'string') && (unit = tmp.match(numUnit)) && (units[i][k] = unit[1])
        }
      }
      // ONE TWEEN TO RULE THEM ALL
      return tween(duration, function (pos, v, xy) {
        // normally not a fan of optimizing for() loops, but we want something
        // fast for animating
        for (i = els.length; i--;) {
          if (points) {
            xy = bezier(bez[i], pos)
            els[i].style.left = xy[0] + 'px'
            els[i].style.top = xy[1] + 'px'
          }
          for (var k in options) {
            v = getTweenVal(pos, units, begin, end, k, i)
            k == 'transform' ?
              els[i].style[transform] = formatTransform(v) :
              k == 'opacity' && !opasity ?
                (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') :
                (els[i].style[camelize(k)] = v)
          }
        }
      }, complete, ease)
    }
  
    // expose useful methods
    morpheus.tween = tween
    morpheus.getStyle = getStyle
    morpheus.bezier = bezier
    morpheus.transform = transform
    morpheus.parseTransform = parseTransform
    morpheus.formatTransform = formatTransform
    morpheus.easings = {}
  
    return morpheus
  
  })
  

  provide("morpheus", module.exports);

  var morpheus = require('morpheus')
  !function ($) {
    $.ender({
      animate: function (options) {
        return morpheus(this, options)
      }
    , fadeIn: function (d, fn) {
        return morpheus(this, {
            duration: d
          , opacity: 1
          , complete: fn
        })
      }
    , fadeOut: function (d, fn) {
        return morpheus(this, {
            duration: d
          , opacity: 0
          , complete: fn
        })
      }
    }, true)
    $.ender({
      tween: morpheus.tween
    })
  }(ender)

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Reqwest! A general purpose XHR connection manager
    * (c) Dustin Diaz 2011
    * https://github.com/ded/reqwest
    * license MIT
    */
  !function (name, definition) {
    if (typeof define == 'function') define(definition)
    else if (typeof module != 'undefined') module.exports = definition()
    else this[name] = definition()
  }('reqwest', function () {
  
    var context = this
      , win = window
      , doc = document
      , old = context.reqwest
      , twoHundo = /^20\d$/
      , byTag = 'getElementsByTagName'
      , readyState = 'readyState'
      , contentType = 'Content-Type'
      , head = doc[byTag]('head')[0]
      , uniqid = 0
      , lastValue // data stored by the most recent JSONP callback
      , xhr = ('XMLHttpRequest' in win) ?
          function () {
            return new XMLHttpRequest()
          } :
          function () {
            return new ActiveXObject('Microsoft.XMLHTTP')
          }
  
    function handleReadyState(o, success, error) {
      return function () {
        if (o && o[readyState] == 4) {
          if (twoHundo.test(o.status)) {
            success(o)
          } else {
            error(o)
          }
        }
      }
    }
  
    function setHeaders(http, o) {
      var headers = o.headers || {}
        , mimetypes= {
              xml: "application/xml, text/xml"
            , html: "text/html"
            , text: "text/plain"
            , json: "application/json, text/javascript"
            , js: 'application/javascript, text/javascript'
          }
        headers.Accept = headers.Accept || mimetypes[o.type] || 'text/javascript, text/html, application/xml, text/xml, */*'
  
      // breaks cross-origin requests with legacy browsers
      if (!o.crossOrigin) headers['X-Requested-With'] = headers['X-Requested-With'] || 'XMLHttpRequest'
      headers[contentType] = headers[contentType] || 'application/x-www-form-urlencoded'
      for (var h in headers) {
        headers.hasOwnProperty(h) && http.setRequestHeader(h, headers[h])
      }
    }
  
    function generalCallback(data) {
      lastValue = data
    }
  
    function urlappend(url, s) {
      return url + (/\?/.test(url) ? '&' : '?') + s
    }
  
    function handleJsonp(o, fn, err, url) {
      var reqId = uniqid++
        , cbkey = o.jsonpCallback || 'callback' // the 'callback' key
        , cbval = o.jsonpCallbackName || ('reqwest_' + reqId) // the 'callback' value
        , cbreg = new RegExp('(' + cbkey + ')=(.+)(&|$)')
        , match = url.match(cbreg)
        , script = doc.createElement('script')
        , loaded = 0
  
      if (match) {
        if (match[2] === '?') {
          url = url.replace(cbreg, '$1=' + cbval + '$3') // wildcard callback func name
        } else {
          cbval = match[2] // provided callback func name
        }
      } else {
        url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
      }
  
      win[cbval] = generalCallback
  
      script.type = 'text/javascript'
      script.src = url
      script.async = true
      if (typeof script.onreadystatechange !== 'undefined') {
          // need this for IE due to out-of-order onreadystatechange(), binding script
          // execution to an event listener gives us control over when the script
          // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
          script.event = 'onclick'
          script.htmlFor = script.id = '_reqwest_' + reqId
      }
  
      script.onload = script.onreadystatechange = function () {
        if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
          return false
        }
        script.onload = script.onreadystatechange = null
        script.onclick && script.onclick()
        // Call the user callback with the last value stored and clean up values and scripts.
        o.success && o.success(lastValue)
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
  
      // Add the script to the DOM head
      head.appendChild(script)
    }
  
    function getRequest(o, fn, err) {
      var method = (o.method || 'GET').toUpperCase()
        , url = typeof o === 'string' ? o : o.url
        // convert non-string objects to query-string form unless o.processData is false
        , data = (o.processData !== false && o.data && typeof o.data !== 'string')
          ? reqwest.toQueryString(o.data)
          : (o.data || null);
  
      // if we're working on a GET request and we have data then we should append
      // query string to end of URL and not post data
      (o.type == 'jsonp' || method == 'GET')
        && data
        && (url = urlappend(url, data))
        && (data = null)
  
      if (o.type == 'jsonp') return handleJsonp(o, fn, err, url)
  
      var http = xhr()
      http.open(method, url, true)
      setHeaders(http, o)
      http.onreadystatechange = handleReadyState(http, fn, err)
      o.before && o.before(http)
      http.send(data)
      return http
    }
  
    function Reqwest(o, fn) {
      this.o = o
      this.fn = fn
      init.apply(this, arguments)
    }
  
    function setType(url) {
      var m = url.match(/\.(json|jsonp|html|xml)(\?|$)/)
      return m ? m[1] : 'js'
    }
  
    function init(o, fn) {
      this.url = typeof o == 'string' ? o : o.url
      this.timeout = null
      var type = o.type || setType(this.url)
        , self = this
      fn = fn || function () {}
  
      if (o.timeout) {
        this.timeout = setTimeout(function () {
          self.abort()
        }, o.timeout)
      }
  
      function complete(resp) {
        o.timeout && clearTimeout(self.timeout)
        self.timeout = null
        o.complete && o.complete(resp)
      }
  
      function success(resp) {
        var r = resp.responseText
        if (r) {
          switch (type) {
          case 'json':
            try {
              resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
            } catch(err) {
              return error(resp, 'Could not parse JSON in response', err)
            }
            break;
          case 'js':
            resp = eval(r)
            break;
          case 'html':
            resp = r
            break;
          }
        }
  
        fn(resp)
        o.success && o.success(resp)
  
        complete(resp)
      }
  
      function error(resp, msg, t) {
        o.error && o.error(resp, msg, t)
        complete(resp)
      }
  
      this.request = getRequest(o, success, error)
    }
  
    Reqwest.prototype = {
      abort: function () {
        this.request.abort()
      }
  
    , retry: function () {
        init.call(this, this.o, this.fn)
      }
    }
  
    function reqwest(o, fn) {
      return new Reqwest(o, fn)
    }
  
    // normalize newline variants according to spec -> CRLF
    function normalize(s) {
      return s ? s.replace(/\r?\n/g, '\r\n') : ''
    }
  
    var isArray = typeof Array.isArray == 'function' ? Array.isArray : function(a) {
      return a instanceof Array
    }
  
    function serial(el, cb) {
      var n = el.name
        , t = el.tagName.toLowerCase()
        , optCb = function(o) {
            // IE gives value="" even where there is no value attribute
            // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
            if (o && !o.disabled)
              cb(n, normalize(o.attributes.value && o.attributes.value.specified ? o.value : o.text))
          }
  
  
      // don't serialize elements that are disabled or without a name
      if (el.disabled || !n) return;
  
      switch (t) {
      case 'input':
        if (!/reset|button|image|file/i.test(el.type)) {
          var ch = /checkbox/i.test(el.type)
            , ra = /radio/i.test(el.type)
            , val = el.value;
          // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
          (!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
        }
        break;
      case 'textarea':
        cb(n, normalize(el.value))
        break;
      case 'select':
        if (el.type.toLowerCase() === 'select-one') {
          optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
        } else {
          for (var i = 0; el.length && i < el.length; i++) {
            el.options[i].selected && optCb(el.options[i])
          }
        }
        break;
      }
    }
  
    // collect up all form elements found from the passed argument elements all
    // the way down to child elements; pass a '<form>' or form fields.
    // called with 'this'=callback to use for serial() on each element
    function eachFormElement() {
      var cb = this
        , e, i, j
        , serializeSubtags = function(e, tags) {
          for (var i = 0; i < tags.length; i++) {
            var fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }
  
      for (i = 0; i < arguments.length; i++) {
        e = arguments[i]
        if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
        serializeSubtags(e, [ 'input', 'select', 'textarea' ])
      }
    }
  
    // standard query string style serialization
    function serializeQueryString() {
      return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
    }
  
    // { 'name': 'value', ... } style serialization
    function serializeHash() {
      var hash = {}
      eachFormElement.apply(function (name, value) {
        if (name in hash) {
          hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
          hash[name].push(value)
        } else hash[name] = value
      }, arguments)
      return hash
    }
  
    // [ { name: 'name', value: 'value' }, ... ] style serialization
    reqwest.serializeArray = function () {
      var arr = []
      eachFormElement.apply(function(name, value) {
        arr.push({name: name, value: value})
      }, arguments)
      return arr
    }
  
    reqwest.serialize = function () {
      if (arguments.length === 0) return ''
      var opt, fn
        , args = Array.prototype.slice.call(arguments, 0)
  
      opt = args.pop()
      opt && opt.nodeType && args.push(opt) && (opt = null)
      opt && (opt = opt.type)
  
      if (opt == 'map') fn = serializeHash
      else if (opt == 'array') fn = reqwest.serializeArray
      else fn = serializeQueryString
  
      return fn.apply(null, args)
    }
  
    reqwest.toQueryString = function (o) {
      var qs = '', i
        , enc = encodeURIComponent
        , push = function (k, v) {
            qs += enc(k) + '=' + enc(v) + '&'
          }
  
      if (isArray(o)) {
        for (i = 0; o && i < o.length; i++) push(o[i].name, o[i].value)
      } else {
        for (var k in o) {
          if (!Object.hasOwnProperty.call(o, k)) continue;
          var v = o[k]
          if (isArray(v)) {
            for (i = 0; i < v.length; i++) push(k, v[i])
          } else push(k, o[k])
        }
      }
  
      // spaces should be + according to spec
      return qs.replace(/&$/, '').replace(/%20/g,'+')
    }
  
    reqwest.noConflict = function () {
      context.reqwest = old
      return this
    }
  
    return reqwest
  })
  

  provide("reqwest", module.exports);

  !function ($) {
    var r = require('reqwest')
      , integrate = function(method) {
        return function() {
          var args = (this && this.length > 0 ? this : []).concat(Array.prototype.slice.call(arguments, 0))
          return r[method].apply(null, args)
        }
      }
      , s = integrate('serialize')
      , sa = integrate('serializeArray')
  
    $.ender({
      ajax: r
      , serialize: s
      , serializeArray: sa
      , toQueryString: r.toQueryString
    })
  
    $.ender({
      serialize: s
      , serializeArray: sa
    }, true)
  }(ender);
  

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Settings;
  exports.b2Settings = b2Settings = b2Settings = (function() {
    function b2Settings() {}
    b2Settings.prototype.b2Assert = function(a) {
      if (!a) {
        vnullVec;
        return nullVec.x++;
      }
    };
    return b2Settings;
  })();
  b2Settings.USHRT_MAX = 0x0000ffff;
  b2Settings.b2_pi = Math.PI;
  b2Settings.b2_massUnitsPerKilogram = 1.0;
  b2Settings.b2_timeUnitsPerSecond = 1.0;
  b2Settings.b2_lengthUnitsPerMeter = 30.0;
  b2Settings.b2_maxManifoldPoints = 2;
  b2Settings.b2_maxShapesPerBody = 64;
  b2Settings.b2_maxPolyVertices = 8;
  b2Settings.b2_maxProxies = 1024;
  b2Settings.b2_maxPairs = 8 * b2Settings.b2_maxProxies;
  b2Settings.b2_linearSlop = 0.005 * b2Settings.b2_lengthUnitsPerMeter;
  b2Settings.b2_angularSlop = 2.0 / 180.0 * b2Settings.b2_pi;
  b2Settings.b2_velocityThreshold = 1.0 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
  b2Settings.b2_maxLinearCorrection = 0.2 * b2Settings.b2_lengthUnitsPerMeter;
  b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * b2Settings.b2_pi;
  b2Settings.b2_contactBaumgarte = 0.2;
  b2Settings.b2_timeToSleep = 0.5 * b2Settings.b2_timeUnitsPerSecond;
  b2Settings.b2_linearSleepTolerance = 0.01 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
  b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 / b2Settings.b2_timeUnitsPerSecond;
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Vec2;
  exports.b2Vec2 = b2Vec2 = b2Vec2 = (function() {
    b2Vec2.prototype.x = null;
    b2Vec2.prototype.y = null;
    function b2Vec2(x_, y_) {
      this.x = x_;
      this.y = y_;
    }
    b2Vec2.prototype.SetZero = function() {
      this.x = 0.0;
      return this.y = 0.0;
    };
    b2Vec2.prototype.Set = function(x_, y_) {
      this.x = x_;
      return this.y = y_;
    };
    b2Vec2.prototype.SetV = function(v) {
      this.x = v.x;
      return this.y = v.y;
    };
    b2Vec2.prototype.Negative = function() {
      return new b2Vec2(-this.x, -this.y);
    };
    b2Vec2.prototype.Copy = function() {
      return new b2Vec2(this.x, this.y);
    };
    b2Vec2.prototype.Add = function(v) {
      this.x += v.x;
      return this.y += v.y;
    };
    b2Vec2.prototype.Subtract = function(v) {
      this.x -= v.x;
      return this.y -= v.y;
    };
    b2Vec2.prototype.Multiply = function(a) {
      this.x *= a;
      return this.y *= a;
    };
    b2Vec2.prototype.MulM = function(A) {
      var tX;
      tX = this.x;
      this.x = A.col1.x * tX + A.col2.x * this.y;
      return this.y = A.col1.y * tX + A.col2.y * this.y;
    };
    b2Vec2.prototype.MulTM = function(A) {
      var tX;
      tX = b2Math.b2Dot(this, A.col1);
      this.y = b2Math.b2Dot(this, A.col2);
      return this.x = tX;
    };
    b2Vec2.prototype.CrossVF = function(s) {
      var tX;
      tX = this.x;
      this.x = s * this.y;
      return this.y = -s * tX;
    };
    b2Vec2.prototype.CrossFV = function(s) {
      var tX;
      tX = this.x;
      this.x = -s * this.y;
      return this.y = s * tX;
    };
    b2Vec2.prototype.MinV = function(b) {
      if (this.x = this.x < b.x) {
        this.x;
      } else {
        b.x;
      }
      if (this.y = this.y < b.y) {
        return this.y;
      } else {
        return b.y;
      }
    };
    b2Vec2.prototype.MaxV = function(b) {
      if (this.x = this.x > b.x) {
        this.x;
      } else {
        b.x;
      }
      if (this.y = this.y > b.y) {
        return this.y;
      } else {
        return b.y;
      }
    };
    b2Vec2.prototype.Abs = function() {
      this.x = Math.abs(this.x);
      return this.y = Math.abs(this.y);
    };
    b2Vec2.prototype.Length = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    b2Vec2.prototype.Normalize = function() {
      var invLength, length;
      length = this.Length();
      if (length < Number.MIN_VALUE) {
        return 0.0;
      }
      invLength = 1.0 / length;
      this.x *= invLength;
      this.y *= invLength;
      return length;
    };
    b2Vec2.prototype.IsValid = function() {
      return b2Math.b2IsValid(this.x) && b2Math.b2IsValid(this.y);
    };
    return b2Vec2;
  })();
  b2Vec2.Make = function(x_, y_) {
    return new b2Vec2(x_, y_);
  };
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Mat22;
  exports.b2Mat22 = b2Mat22 = b2Mat22 = (function() {
    function b2Mat22(angle, c1, c2) {
      var c, s;
      if (angle == null) {
        angle = 0;
      }
      this.col1 = new b2Vec2();
      this.col2 = new b2Vec2();
      if ((c1 != null) && (c2 != null)) {
        this.col1.SetV(c1);
        this.col2.SetV(c2);
      } else {
        c = Math.cos(angle);
        s = Math.sin(angle);
        this.col1.x = c;
        this.col2.x = -s;
        this.col1.y = s;
        this.col2.y = c;
      }
    }
    b2Mat22.prototype.Set = function(angle) {
      var c, s;
      c = Math.cos(angle);
      s = Math.sin(angle);
      this.col1.x = c;
      this.col2.x = -s;
      this.col1.y = s;
      return this.col2.y = c;
    };
    b2Mat22.prototype.SetVV = function(c1, c2) {
      this.col1.SetV(c1);
      return this.col2.SetV(c2);
    };
    b2Mat22.prototype.Copy = function() {
      return new b2Mat22(0, this.col1, this.col2);
    };
    b2Mat22.prototype.SetM = function(m) {
      this.col1.SetV(m.col1);
      return this.col2.SetV(m.col2);
    };
    b2Mat22.prototype.AddM = function(m) {
      this.col1.x += m.col1.x;
      this.col1.y += m.col1.y;
      this.col2.x += m.col2.x;
      return this.col2.y += m.col2.y;
    };
    b2Mat22.prototype.SetIdentity = function() {
      this.col1.x = 1.0;
      this.col2.x = 0.0;
      this.col1.y = 0.0;
      return this.col2.y = 1.0;
    };
    b2Mat22.prototype.SetZero = function() {
      this.col1.x = 0.0;
      this.col2.x = 0.0;
      this.col1.y = 0.0;
      return this.col2.y = 0.0;
    };
    b2Mat22.prototype.Invert = function(out) {
      var a, b, c, d, det;
      a = this.col1.x;
      b = this.col2.x;
      c = this.col1.y;
      d = this.col2.y;
      det = a * d - b * c;
      det = 1.0 / det;
      out.col1.x = det * d;
      out.col2.x = -det * b;
      out.col1.y = -det * c;
      out.col2.y = det * a;
      return out;
    };
    b2Mat22.prototype.Solve = function(out, bX, bY) {
      var a11, a12, a21, a22, det;
      a11 = this.col1.x;
      a12 = this.col2.x;
      a21 = this.col1.y;
      a22 = this.col2.y;
      det = a11 * a22 - a12 * a21;
      det = 1.0 / det;
      out.x = det * (a22 * bX - a12 * bY);
      out.y = det * (a11 * bY - a21 * bX);
      return out;
    };
    b2Mat22.prototype.Abs = function() {
      this.col1.Abs();
      return this.col2.Abs();
    };
    b2Mat22.prototype.col1 = new b2Vec2();
    b2Mat22.prototype.col2 = new b2Vec2();
    return b2Mat22;
  })();
  /*
  var b2Mat22 = Class.create()
  b2Mat22.prototype = 
  {
  	initialize: function(angle, c1, c2)
  	{
  		if (angle==null) angle = 0
  		// initialize instance variables for references
  		@col1 = new b2Vec2()
  		@col2 = new b2Vec2()
  		//
  
  		if (c1!=null && c2!=null){
  			@col1.SetV(c1)
  			@col2.SetV(c2)
  		}
  		else{
  			var c = Math.cos(angle)
  			var s = Math.sin(angle)
  			@col1.x = c @col2.x = -s
  			@col1.y = s @col2.y = c
  		}
  	},
  
  	Set: function(angle)
  	{
  		var c = Math.cos(angle)
  		var s = Math.sin(angle)
  		@col1.x = c @col2.x = -s
  		@col1.y = s @col2.y = c
  	},
  
  	SetVV: function(c1, c2)
  	{
  		@col1.SetV(c1)
  		@col2.SetV(c2)
  	},
  
  	Copy: function(){
  		return new b2Mat22(0, @col1, @col2)
  	},
  
  	SetM: function(m)
  	{
  		@col1.SetV(m.col1)
  		@col2.SetV(m.col2)
  	},
  
  	AddM: function(m)
  	{
  		@col1.x += m.col1.x
  		@col1.y += m.col1.y
  		@col2.x += m.col2.x
  		@col2.y += m.col2.y
  	},
  
  	SetIdentity: function()
  	{
  		@col1.x = 1.0 @col2.x = 0.0
  		@col1.y = 0.0 @col2.y = 1.0
  	},
  
  	SetZero: function()
  	{
  		@col1.x = 0.0 @col2.x = 0.0
  		@col1.y = 0.0 @col2.y = 0.0
  	},
  
  	Invert: function(out)
  	{
  		var a = @col1.x
  		var b = @col2.x
  		var c = @col1.y
  		var d = @col2.y
  		//var B = new b2Mat22()
  		var det = a * d - b * c
  		//b2Settings.b2Assert(det != 0.0)
  		det = 1.0 / det
  		out.col1.x =  det * d	out.col2.x = -det * b
  		out.col1.y = -det * c	out.col2.y =  det * a
  		return out
  	},
  
  	// @Solve A * x = b
  	Solve: function(out, bX, bY)
  	{
  		//float32 a11 = @col1.x, a12 = @col2.x, a21 = @col1.y, a22 = @col2.y
  		var a11 = @col1.x
  		var a12 = @col2.x
  		var a21 = @col1.y
  		var a22 = @col2.y
  		//float32 det = a11 * a22 - a12 * a21
  		var det = a11 * a22 - a12 * a21
  		//b2Settings.b2Assert(det != 0.0)
  		det = 1.0 / det
  		out.x = det * (a22 * bX - a12 * bY)
  		out.y = det * (a11 * bY - a21 * bX)
  
  		return out
  	},
  
  	Abs: function()
  	{
  		@col1.Abs()
  		@col2.Abs()
  	},
  
  	col1: new b2Vec2(),
  	col2: new b2Vec2()}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2TimeStep;
  exports.b2TimeStep = b2TimeStep = b2TimeStep = (function() {
    function b2TimeStep() {}
    b2TimeStep.prototype.dt = null;
    b2TimeStep.prototype.inv_dt = null;
    b2TimeStep.prototype.iterations = 0;
    return b2TimeStep;
  })();
  /*
  var b2TimeStep = Class.create();
  b2TimeStep.prototype = 
  {
  	dt: null,
  	inv_dt: null,
  	iterations: 0,
  	initialize: function() {}};*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Math;
  exports.b2Math = b2Math = b2Math = (function() {
    function b2Math() {}
    return b2Math;
  })();
  b2Math.b2IsValid = function(x) {
    return sFinite(x);
  };
  b2Math.b2Dot = function(a, b) {
    return a.x * b.x + a.y * b.y;
  };
  b2Math.b2CrossVV = function(a, b) {
    return a.x * b.y - a.y * b.x;
  };
  b2Math.b2CrossVF = function(a, s) {
    return new b2Vec2(s * a.y, -s * a.x);
  };
  b2Math.b2CrossFV = function(s, a) {
    return new b2Vec2(-s * a.y, s * a.x);
  };
  b2Math.b2MulMV = function(A, v) {
    return new b2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
  };
  b2Math.b2MulTMV = function(A, v) {
    return new b2Vec2(b2Math.b2Dot(v, A.col1), b2Math.b2Dot(v, A.col2));
  };
  b2Math.AddVV = function(a, b) {
    return new b2Vec2(a.x + b.x, a.y + b.y);
  };
  b2Math.SubtractVV = function(a, b) {
    return new b2Vec2(a.x - b.x, a.y - b.y);
  };
  b2Math.MulFV = function(s, a) {
    return new b2Vec2(s * a.x, s * a.y);
  };
  b2Math.AddMM = function(A, B) {
    return new b2Mat22(0, b2Math.AddVV(A.col1, B.col1), b2Math.AddVV(A.col2, B.col2));
  };
  b2Math.b2MulMM = function(A, B) {
    return new b2Mat22(0, b2Math.b2MulMV(A, B.col1), b2Math.b2MulMV(A, B.col2));
  };
  b2Math.b2MulTMM = function(A, B) {
    var c1, c2;
    c1 = new b2Vec2(b2Math.b2Dot(A.col1, B.col1), b2Math.b2Dot(A.col2, B.col1));
    c2 = new b2Vec2(b2Math.b2Dot(A.col1, B.col2), b2Math.b2Dot(A.col2, B.col2));
    return new b2Mat22(0, c1, c2);
  };
  b2Math.b2Abs = function(a) {
    if (a > 0.0) {
      return a;
    } else {
      return -a;
    }
  };
  b2Math.b2AbsV = function(a) {
    return new b2Vec2(b2Math.b2Abs(a.x), b2Math.b2Abs(a.y));
  };
  b2Math.b2AbsM = function(A) {
    return new b2Mat22(0, b2Math.b2AbsV(A.col1), b2Math.b2AbsV(A.col2));
  };
  b2Math.b2Min = function(a, b) {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  };
  b2Math.b2MinV = function(a, b) {
    return new b2Vec2(b2Math.b2Min(a.x, b.x), b2Math.b2Min(a.y, b.y));
  };
  b2Math.b2Max = function(a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };
  b2Math.b2MaxV = function(a, b) {
    return new b2Vec2(b2Math.b2Max(a.x, b.x), b2Math.b2Max(a.y, b.y));
  };
  b2Math.b2Clamp = function(a, low, high) {
    return b2Math.b2Max(low, b2Math.b2Min(a, high));
  };
  b2Math.b2ClampV = function(a, low, high) {
    return b2Math.b2MaxV(low, b2Math.b2MinV(a, high));
  };
  b2Math.b2Swap = function(a, b) {
    var tmp;
    tmp = a[0];
    a[0] = b[0];
    return b[0] = tmp;
  };
  b2Math.b2Random = function() {
    return Math.random() * 2 - 1;
  };
  b2Math.b2NextPowerOfTwo = function(x) {
    x |= (x >> 1) & 0x7FFFFFFF;
    x |= (x >> 2) & 0x3FFFFFFF;
    x |= (x >> 4) & 0x0FFFFFFF;
    x |= (x >> 8) & 0x00FFFFFF;
    x |= (x >> 16) & 0x0000FFFF;
    return x + 1;
  };
  b2Math.b2IsPowerOfTwo = function(x) {
    return x > 0 && (x & (x - 1)) === 0;
  };
  b2Math.tempVec2 = new b2Vec2();
  b2Math.tempVec3 = new b2Vec2();
  b2Math.tempVec4 = new b2Vec2();
  b2Math.tempVec5 = new b2Vec2();
  b2Math.tempMat = new b2Mat22();
  /*
  b2Math = Class.create();
  b2Math.prototype = {
  
  
  
  	// "Next Largest Power of 2
  	// Given a binary integer value x, the next largest power of 2 can be computed by a SWAR algorithm
  	// that recursively "folds" the upper bits into the lower bits. This process yields a bit vector with
  	// the same most significant 1, but all 1's below it. Adding 1 to that value yields the next
  	// largest power of 2. For a 32-bit value:"
  
  
  
  
  
  	initialize: function() {}}
  b2Math.b2IsValid = function(x)
  	{
  		return isFinite(x);
  	};
  b2Math.b2Dot = function(a, b)
  	{
  		return a.x * b.x + a.y * b.y;
  	};
  b2Math.b2CrossVV = function(a, b)
  	{
  		return a.x * b.y - a.y * b.x;
  	};
  b2Math.b2CrossVF = function(a, s)
  	{
  		var v = new b2Vec2(s * a.y, -s * a.x);
  		return v;
  	};
  b2Math.b2CrossFV = function(s, a)
  	{
  		var v = new b2Vec2(-s * a.y, s * a.x);
  		return v;
  	};
  b2Math.b2MulMV = function(A, v)
  	{
  		var u = new b2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
  		return u;
  	};
  b2Math.b2MulTMV = function(A, v)
  	{
  		var u = new b2Vec2(b2Math.b2Dot(v, A.col1), b2Math.b2Dot(v, A.col2));
  		return u;
  	};
  b2Math.AddVV = function(a, b)
  	{
  		var v = new b2Vec2(a.x + b.x, a.y + b.y);
  		return v;
  	};
  b2Math.SubtractVV = function(a, b)
  	{
  		var v = new b2Vec2(a.x - b.x, a.y - b.y);
  		return v;
  	};
  b2Math.MulFV = function(s, a)
  	{
  		var v = new b2Vec2(s * a.x, s * a.y);
  		return v;
  	};
  b2Math.AddMM = function(A, B)
  	{
  		var C = new b2Mat22(0, b2Math.AddVV(A.col1, B.col1), b2Math.AddVV(A.col2, B.col2));
  		return C;
  	};
  b2Math.b2MulMM = function(A, B)
  	{
  		var C = new b2Mat22(0, b2Math.b2MulMV(A, B.col1), b2Math.b2MulMV(A, B.col2));
  		return C;
  	};
  b2Math.b2MulTMM = function(A, B)
  	{
  		var c1 = new b2Vec2(b2Math.b2Dot(A.col1, B.col1), b2Math.b2Dot(A.col2, B.col1));
  		var c2 = new b2Vec2(b2Math.b2Dot(A.col1, B.col2), b2Math.b2Dot(A.col2, B.col2));
  		var C = new b2Mat22(0, c1, c2);
  		return C;
  	};
  b2Math.b2Abs = function(a)
  	{
  		return a > 0.0 ? a : -a;
  	};
  b2Math.b2AbsV = function(a)
  	{
  		var b = new b2Vec2(b2Math.b2Abs(a.x), b2Math.b2Abs(a.y));
  		return b;
  	};
  b2Math.b2AbsM = function(A)
  	{
  		var B = new b2Mat22(0, b2Math.b2AbsV(A.col1), b2Math.b2AbsV(A.col2));
  		return B;
  	};
  b2Math.b2Min = function(a, b)
  	{
  		return a < b ? a : b;
  	};
  b2Math.b2MinV = function(a, b)
  	{
  		var c = new b2Vec2(b2Math.b2Min(a.x, b.x), b2Math.b2Min(a.y, b.y));
  		return c;
  	};
  b2Math.b2Max = function(a, b)
  	{
  		return a > b ? a : b;
  	};
  b2Math.b2MaxV = function(a, b)
  	{
  		var c = new b2Vec2(b2Math.b2Max(a.x, b.x), b2Math.b2Max(a.y, b.y));
  		return c;
  	};
  b2Math.b2Clamp = function(a, low, high)
  	{
  		return b2Math.b2Max(low, b2Math.b2Min(a, high));
  	};
  b2Math.b2ClampV = function(a, low, high)
  	{
  		return b2Math.b2MaxV(low, b2Math.b2MinV(a, high));
  	};
  b2Math.b2Swap = function(a, b)
  	{
  		var tmp = a[0];
  		a[0] = b[0];
  		b[0] = tmp;
  	};
  b2Math.b2Random = function()
  	{
  		return Math.random() * 2 - 1;
  	};
  b2Math.b2NextPowerOfTwo = function(x)
  	{
  		x |= (x >> 1) & 0x7FFFFFFF;
  		x |= (x >> 2) & 0x3FFFFFFF;
  		x |= (x >> 4) & 0x0FFFFFFF;
  		x |= (x >> 8) & 0x00FFFFFF;
  		x |= (x >> 16)& 0x0000FFFF;
  		return x + 1;
  	};
  b2Math.b2IsPowerOfTwo = function(x)
  	{
  		var result = x > 0 && (x & (x - 1)) == 0;
  		return result;
  	};
  b2Math.tempVec2 = new b2Vec2();
  b2Math.tempVec3 = new b2Vec2();
  b2Math.tempVec4 = new b2Vec2();
  b2Math.tempVec5 = new b2Vec2();
  b2Math.tempMat = new b2Mat22();*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2MassData;
  exports.b2MassData = b2MassData = b2MassData = (function() {
    b2MassData.prototype.mass = 0.0;
    b2MassData.prototype.center = new b2Vec2(0, 0);
    b2MassData.prototype.I = 0.0;
    function b2MassData() {
      this.center = new b2Vec2(0, 0);
    }
    return b2MassData;
  })();
  /*
  var b2MassData = Class.create();
  b2MassData.prototype = 
  {
  	mass: 0.0,
  	center: new b2Vec2(0,0),
  	I: 0.0,
  
  	initialize: function() {
  		// initialize instance variables for references
  		this.center = new b2Vec2(0,0);
  		//
  }}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2CollisionFilter;
  exports.b2CollisionFilter = b2CollisionFilter = b2CollisionFilter = (function() {
    function b2CollisionFilter() {}
    b2CollisionFilter.prototype.ShouldCollide = function(shape1, shape2) {
      if (shape1.m_groupIndex === shape2.m_groupIndex && shape1.m_groupIndex !== 0) {
        return shape1.m_groupIndex > 0;
      }
      return (shape1.m_maskBits & shape2.m_categoryBits) !== 0 && (shape1.m_categoryBits & shape2.m_maskBits) !== 0;
    };
    return b2CollisionFilter;
  })();
  b2CollisionFilter.b2_defaultFilter = new b2CollisionFilter;
  /*
  var b2CollisionFilter = Class.create()
  b2CollisionFilter.prototype = 
  {
  
  	// Return true if contact calculations should be performed between these two shapes.
  	ShouldCollide: function(shape1, shape2){
  		if (shape1.m_groupIndex == shape2.m_groupIndex && shape1.m_groupIndex != 0)
  		{
  			return shape1.m_groupIndex > 0
  		}
  
  		var collide = (shape1.m_maskBits & shape2.m_categoryBits) != 0 && (shape1.m_categoryBits & shape2.m_maskBits) != 0
  		return collide
  	},
  
  
  	initialize: function() {}}
  b2CollisionFilter.b2_defaultFilter = new b2CollisionFilter*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2AABB;
  exports.b2AABB = b2AABB = b2AABB = (function() {
    b2AABB.prototype.minVertex = new b2Vec2();
    b2AABB.prototype.maxVertex = new b2Vec2();
    function b2AABB() {
      this.minVertex = new b2Vec2();
      this.maxVertex = new b2Vec2();
    }
    b2AABB.prototype.IsValid = function() {
      var dX, dY, valid;
      dX = this.maxVertex.x;
      dY = this.maxVertex.y;
      dX = this.maxVertex.x;
      dY = this.maxVertex.y;
      dX -= this.minVertex.x;
      dY -= this.minVertex.y;
      valid = dX >= 0.0 && dY >= 0.0;
      valid = valid && this.minVertex.IsValid() && this.maxVertex.IsValid();
      return valid;
    };
    return b2AABB;
  })();
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2OBB;
  exports.b2OBB = b2OBB = b2OBB = (function() {
    b2OBB.prototype.R = new b2Mat22();
    b2OBB.prototype.center = new b2Vec2();
    b2OBB.prototype.extents = new b2Vec2();
    function b2OBB() {
      this.R = new b2Mat22();
      this.center = new b2Vec2();
      this.extents = new b2Vec2();
    }
    return b2OBB;
  })();
  /*
  var b2OBB = Class.create();
  b2OBB.prototype = 
  {
  	R: new b2Mat22(),
  	center: new b2Vec2(),
  	extents: new b2Vec2(),
  	initialize: function() {
  		// initialize instance variables for references
  		this.R = new b2Mat22();
  		this.center = new b2Vec2();
  		this.extents = new b2Vec2();
  		//
  }};*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2World;
  exports.b2World = b2World = b2World = (function() {
    function b2World(worldAABB, gravity, doSleep) {
      this.step = new b2TimeStep();
      this.m_contactManager = new b2ContactManager();
      this.m_listener = null;
      this.m_filter = b2CollisionFilter.b2_defaultFilter;
      this.m_bodyList = null;
      this.m_contactList = null;
      this.m_jointList = null;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_bodyDestroyList = null;
      this.m_allowSleep = doSleep;
      this.m_gravity = gravity;
      this.m_contactManager.m_world = this;
      this.m_broadPhase = new b2BroadPhase(worldAABB, this.m_contactManager);
      this.m_groundBody = this.CreateBody(new b2BodyDef());
    }
    b2World.prototype.SetListener = function(listener) {
      return this.m_listener = listener;
    };
    b2World.prototype.SetFilter = function(filter) {
      return this.m_filter = filter;
    };
    b2World.prototype.CreateBody = function(def) {
      var b;
      b = new b2Body(def, this);
      b.m_prev = null;
      b.m_next = this.m_bodyList;
      if (this.m_bodyList) {
        this.m_bodyList.m_prev = b;
      }
      this.m_bodyList = b;
      ++this.m_bodyCount;
      return b;
    };
    b2World.prototype.step = new b2TimeStep();
    b2World.prototype.Step = function(dt, iterations) {
      var b, c, cn, i, island, j, jn, k, other, response, seed, stack, stackCount, stackSize, _ref, _ref2;
      this.step.dt = dt;
      this.step.iterations = iterations;
      if (dt > 0.0) {
        this.step.inv_dt = 1.0 / dt;
      } else {
        this.step.inv_dt = 0.0;
      }
      this.m_positionIterationCount = 0;
      this.m_contactManager.CleanContactList();
      this.CleanBodyList();
      this.m_contactManager.Collide();
      island = new b2Island(this.m_bodyCount, this.m_contactCount, this.m_jointCount, this.m_stackAllocator);
      b = this.m_bodyList;
      while (b != null) {
        b.m_flags &= ~b2Body.e_islandFlag;
        b = b.m_next;
      }
      c = this.m_contactList;
      while (c != null) {
        c.m_flags &= ~b2Contact.e_islandFlag;
        c = c.m_next;
      }
      j = this.m_jointList;
      while (j != null) {
        j.m_islandFlag = false;
        j = j.m_next;
      }
      stackSize = this.m_bodyCount;
      stack = new Array(this.m_bodyCount);
      for (k = 0, _ref = this.m_bodyCount; 0 <= _ref ? k < _ref : k > _ref; 0 <= _ref ? k++ : k--) {
        stack[k] = null;
      }
      seed = this.m_bodyList;
      while (seed != null) {
        if (!(seed.m_flags & (b2Body.e_staticFlag | b2Body.e_islandFlag | b2Body.e_sleepFlag | b2Body.e_frozenFlag))) {
          island.Clear();
          stackCount = 0;
          stack[stackCount++] = seed;
          seed.m_flags |= b2Body.e_islandFlag;
          while (stackCount > 0) {
            b = stack[--stackCount];
            island.AddBody(b);
            b.m_flags &= ~b2Body.e_sleepFlag;
            if (!(b.m_flags & b2Body.e_staticFlag)) {
              cn = b.m_contactList;
              while (cn != null) {
                if (!(cn.contact.m_flags & b2Contact.e_islandFlag)) {
                  island.AddContact(cn.contact);
                  cn.contact.m_flags |= b2Contact.e_islandFlag;
                  other = cn.other;
                  if (!(other.m_flags & b2Body.e_islandFlag)) {
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                  }
                }
              }
              cn = cn.next;
              jn = b.m_jointList;
              while (jn != null) {
                if (jn.joint.m_islandFlag !== true) {
                  island.AddJoint(jn.joint);
                  jn.joint.m_islandFlag = true;
                  other = jn.other;
                  if (!(other.m_flags & b2Body.e_islandFlag)) {
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                  }
                  jn = jn.next;
                }
              }
            }
          }
          island.Solve(this.step, this.m_gravity);
          this.m_positionIterationCount = b2Math.b2Max(this.m_positionIterationCount, b2Island.m_positionIterationCount);
          if (this.m_allowSleep) {
            island.UpdateSleep(dt);
          }
          for (i = 0, _ref2 = island.m_bodyCount; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
            b = island.m_bodies[i];
            if (b.m_flags & b2Body.e_staticFlag) {
              b.m_flags &= ~b2Body.e_islandFlag;
            }
            if (b.IsFrozen() && this.m_listener) {
              response = this.m_listener.NotifyBoundaryViolated(b);
              if (response === b2WorldListener.b2_destroyBody) {
                this.DestroyBody(b);
                b = null;
                island.m_bodies[i] = null;
              }
            }
          }
        }
        seed = seed.m_next;
      }
      return this.m_broadPhase.Commit();
    };
    b2World.prototype.CleanBodyList = function() {
      var b, b0, jn, jn0;
      this.m_contactManager.m_destroyImmediate = true;
      b = this.m_bodyDestroyList;
      while ((b != null)) {
        b0 = b;
        b = b.m_next;
        jn = b0.m_jointList;
        while ((jn != null)) {
          jn0 = jn;
          jn = jn.next;
          if (this.m_listener) {
            this.m_listener.NotifyJointDestroyed(jn0.joint);
          }
          this.DestroyJoint(jn0.joint);
        }
        b0.Destroy();
      }
      this.m_bodyDestroyList = null;
      return this.m_contactManager.m_destroyImmediate = false;
    };
    return b2World;
  })();
  /*
  var b2World = Class.create()
  b2World.prototype = 
  {
  	initialize: function(worldAABB, gravity, doSleep){
  		// initialize instance variables for references
  		@step = new b2TimeStep()
  		@m_contactManager = new b2ContactManager()
  		//
  
  
  		@m_listener = null
  		@m_filter = b2CollisionFilter.b2_defaultFilter
  
  		@m_bodyList = null
  		@m_contactList = null
  		@m_jointList = null
  
  		@m_bodyCount = 0
  		@m_contactCount = 0
  		@m_jointCount = 0
  
  		@m_bodyDestroyList = null
  
  		@m_allowSleep = doSleep
  
  		@m_gravity = gravity
  
  		@m_contactManager.m_world = @
  		@m_broadPhase = new b2BroadPhase(worldAABB, @m_contactManager)
  
  		var bd = new b2BodyDef()
  		@m_groundBody = @CreateBody(bd)
  	},
  	//~b2World(){
  	//	@DestroyBody(@m_groundBody)
  	//	delete @m_broadPhase
  	//}
  
  	// Set a callback to notify you when a joint is implicitly destroyed
  	// when an attached body is destroyed.
  	SetListener: function(listener){
  		@m_listener = listener
  	},
  
  	// Register a collision filter to provide specific control over collision.
  	// Otherwise the default filter is used (b2CollisionFilter).
  	SetFilter: function(filter){
  		@m_filter = filter
  	},
  
  	// Create and destroy rigid bodies. Destruction is deferred until the
  	// the next call to @Step. @ is done so that bodies may be destroyed
  	// while you iterate through the contact list.
  	CreateBody: function(def){
  		//void* mem = @m_blockAllocator.Allocate(sizeof(b2Body))
  		var b = new b2Body(def, @)
  		b.m_prev = null
  
  		b.m_next = @m_bodyList
  		if (@m_bodyList)
  		{
  			@m_bodyList.m_prev = b
  		}
  		@m_bodyList = b
  		++@m_bodyCount
  
  		return b
  	},
  	// Body destruction is deferred to make contact processing more robust.
  	DestroyBody: function(b)
  	{
  
  		if (b.m_flags & b2Body.e_destroyFlag)
  		{
  			return
  		}
  
  		// Remove from normal body list.
  		if (b.m_prev)
  		{
  			b.m_prev.m_next = b.m_next
  		}
  
  		if (b.m_next)
  		{
  			b.m_next.m_prev = b.m_prev
  		}
  
  		if (b == @m_bodyList)
  		{
  			@m_bodyList = b.m_next
  		}
  
  		b.m_flags |= b2Body.e_destroyFlag
  		//b2Settings.b2Assert(@m_bodyCount > 0)
  		--@m_bodyCount
  
  		//b->~b2Body()
  		//b.Destroy()
  		// Add to the deferred destruction list.
  		b.m_prev = null
  		b.m_next = @m_bodyDestroyList
  		@m_bodyDestroyList = b
  	},
  
  	CleanBodyList: function()
  	{
  		@m_contactManager.m_destroyImmediate = true
  
  		var b = @m_bodyDestroyList
  		while (b)
  		{
  			//b2Settings.b2Assert((b.m_flags & b2Body.e_destroyFlag) != 0)
  
  			// Preserve the next pointer.
  			var b0 = b
  			b = b.m_next
  
  			// Delete the attached joints
  			var jn = b0.m_jointList
  			while (jn)
  			{
  				var jn0 = jn
  				jn = jn.next
  
  				if (@m_listener)
  				{
  					@m_listener.NotifyJointDestroyed(jn0.joint)
  				}
  
  				@DestroyJoint(jn0.joint)
  			}
  
  			b0.Destroy()
  			//@m_blockAllocator.Free(b0, sizeof(b2Body))
  		}
  
  		// Reset the list.
  		@m_bodyDestroyList = null
  
  		@m_contactManager.m_destroyImmediate = false
  	},
  
  	CreateJoint: function(def){
  		var j = b2Joint.Create(def, @m_blockAllocator)
  
  		// Connect to the world list.
  		j.m_prev = null
  		j.m_next = @m_jointList
  		if (@m_jointList)
  		{
  			@m_jointList.m_prev = j
  		}
  		@m_jointList = j
  		++@m_jointCount
  
  		// Connect to the bodies
  		j.m_node1.joint = j
  		j.m_node1.other = j.m_body2
  		j.m_node1.prev = null
  		j.m_node1.next = j.m_body1.m_jointList
  		if (j.m_body1.m_jointList) j.m_body1.m_jointList.prev = j.m_node1
  		j.m_body1.m_jointList = j.m_node1
  
  		j.m_node2.joint = j
  		j.m_node2.other = j.m_body1
  		j.m_node2.prev = null
  		j.m_node2.next = j.m_body2.m_jointList
  		if (j.m_body2.m_jointList) j.m_body2.m_jointList.prev = j.m_node2
  		j.m_body2.m_jointList = j.m_node2
  
  		// If the joint prevents collisions, then reset collision filtering.
  		if (def.collideConnected == false)
  		{
  			// Reset the proxies on the body with the minimum number of shapes.
  			var b = def.body1.m_shapeCount < def.body2.m_shapeCount ? def.body1 : def.body2
  			for (var s = b.m_shapeList s s = s.m_next)
  			{
  				s.ResetProxy(@m_broadPhase)
  			}
  		}
  
  		return j
  	},
  	DestroyJoint: function(j)
  	{
  
  		var collideConnected = j.m_collideConnected
  
  		// Remove from the world.
  		if (j.m_prev)
  		{
  			j.m_prev.m_next = j.m_next
  		}
  
  		if (j.m_next)
  		{
  			j.m_next.m_prev = j.m_prev
  		}
  
  		if (j == @m_jointList)
  		{
  			@m_jointList = j.m_next
  		}
  
  		// Disconnect from island graph.
  		var body1 = j.m_body1
  		var body2 = j.m_body2
  
  		// Wake up touching bodies.
  		body1.WakeUp()
  		body2.WakeUp()
  
  		// Remove from body 1
  		if (j.m_node1.prev)
  		{
  			j.m_node1.prev.next = j.m_node1.next
  		}
  
  		if (j.m_node1.next)
  		{
  			j.m_node1.next.prev = j.m_node1.prev
  		}
  
  		if (j.m_node1 == body1.m_jointList)
  		{
  			body1.m_jointList = j.m_node1.next
  		}
  
  		j.m_node1.prev = null
  		j.m_node1.next = null
  
  		// Remove from body 2
  		if (j.m_node2.prev)
  		{
  			j.m_node2.prev.next = j.m_node2.next
  		}
  
  		if (j.m_node2.next)
  		{
  			j.m_node2.next.prev = j.m_node2.prev
  		}
  
  		if (j.m_node2 == body2.m_jointList)
  		{
  			body2.m_jointList = j.m_node2.next
  		}
  
  		j.m_node2.prev = null
  		j.m_node2.next = null
  
  		b2Joint.Destroy(j, @m_blockAllocator)
  
  		//b2Settings.b2Assert(@m_jointCount > 0)
  		--@m_jointCount
  
  		// If the joint prevents collisions, then reset collision filtering.
  		if (collideConnected == false)
  		{
  			// Reset the proxies on the body with the minimum number of shapes.
  			var b = body1.m_shapeCount < body2.m_shapeCount ? body1 : body2
  			for (var s = b.m_shapeList s s = s.m_next)
  			{
  				s.ResetProxy(@m_broadPhase)
  			}
  		}
  	},
  
  	// The world provides a single ground body with no collision shapes. You
  	// can use @ to simplify the creation of joints.
  	GetGroundBody: function(){
  		return @m_groundBody
  	},
  
  
  	step: new b2TimeStep(),
  	// @Step
  	Step: function(dt, iterations){
  
  		var b
  		var other
  
  
  		@step.dt = dt
  		@step.iterations	= iterations
  		if (dt > 0.0)
  		{
  			@step.inv_dt = 1.0 / dt
  		}
  		else
  		{
  			@step.inv_dt = 0.0
  		}
  
  		@m_positionIterationCount = 0
  
  		// Handle deferred contact destruction.
  		@m_contactManager.CleanContactList()
  
  		// Handle deferred body destruction.
  		@CleanBodyList()
  
  		// Update contacts.
  		@m_contactManager.Collide()
  
  		// Size the island for the worst case.
  		var island = new b2Island(@m_bodyCount, @m_contactCount, @m_jointCount, @m_stackAllocator)
  
  		// Clear all the island flags.
  		for (b = @m_bodyList b != null b = b.m_next)
  		{
  			b.m_flags &= ~b2Body.e_islandFlag
  		}
  		for (var c = @m_contactList c != null c = c.m_next)
  		{
  			c.m_flags &= ~b2Contact.e_islandFlag
  		}
  		for (var j = @m_jointList j != null j = j.m_next)
  		{
  			j.m_islandFlag = false
  		}
  
  		// Build and simulate all awake islands.
  		var stackSize = @m_bodyCount
  		//var stack = (b2Body**)@m_stackAllocator.Allocate(stackSize * sizeof(b2Body*))
  		var stack = new Array(@m_bodyCount)
  		for (var k = 0 k < @m_bodyCount k++)
  			stack[k] = null
  
  		for (var seed = @m_bodyList seed != null seed = seed.m_next)
  		{
  			if (seed.m_flags & (b2Body.e_staticFlag | b2Body.e_islandFlag | b2Body.e_sleepFlag | b2Body.e_frozenFlag))
  			{
  				continue
  			}
  
  			// Reset island and stack.
  			island.Clear()
  			var stackCount = 0
  			stack[stackCount++] = seed
  			seed.m_flags |= b2Body.e_islandFlag
  
  			// Perform a depth first search (DFS) on the constraint graph.
  			while (stackCount > 0)
  			{
  				// Grab the next body off the stack and add it to the island.
  				b = stack[--stackCount]
  				island.AddBody(b)
  
  				// Make sure the body is awake.
  				b.m_flags &= ~b2Body.e_sleepFlag
  
  				// To keep islands, we don't
  				// propagate islands across static bodies.
  				if (b.m_flags & b2Body.e_staticFlag)
  				{
  					continue
  				}
  
  				// Search all contacts connected to @ body.
  				for (var cn = b.m_contactList cn != null cn = cn.next)
  				{
  					if (cn.contact.m_flags & b2Contact.e_islandFlag)
  					{
  						continue
  					}
  
  					island.AddContact(cn.contact)
  					cn.contact.m_flags |= b2Contact.e_islandFlag
  
  					other = cn.other
  					if (other.m_flags & b2Body.e_islandFlag)
  					{
  						continue
  					}
  
  					//b2Settings.b2Assert(stackCount < stackSize)
  					stack[stackCount++] = other
  					other.m_flags |= b2Body.e_islandFlag
  				}
  
  				// Search all joints connect to @ body.
  				for (var jn = b.m_jointList jn != null jn = jn.next)
  				{
  					if (jn.joint.m_islandFlag == true)
  					{
  						continue
  					}
  
  					island.AddJoint(jn.joint)
  					jn.joint.m_islandFlag = true
  
  					other = jn.other
  					if (other.m_flags & b2Body.e_islandFlag)
  					{
  						continue
  					}
  
  					//b2Settings.b2Assert(stackCount < stackSize)
  					stack[stackCount++] = other
  					other.m_flags |= b2Body.e_islandFlag
  				}
  			}
  
  			island.Solve(@step, @m_gravity)
  
  			@m_positionIterationCount = b2Math.b2Max(@m_positionIterationCount, b2Island.m_positionIterationCount)
  
  			if (@m_allowSleep)
  			{
  				island.UpdateSleep(dt)
  			}
  
  			// Post solve cleanup.
  			for (var i = 0 i < island.m_bodyCount ++i)
  			{
  				// Allow static bodies to participate in other islands.
  				b = island.m_bodies[i]
  				if (b.m_flags & b2Body.e_staticFlag)
  				{
  					b.m_flags &= ~b2Body.e_islandFlag
  				}
  
  				// Handle newly frozen bodies.
  				if (b.IsFrozen() && @m_listener)
  				{
  					var response = @m_listener.NotifyBoundaryViolated(b)
  					if (response == b2WorldListener.b2_destroyBody)
  					{
  						@DestroyBody(b)
  						b = null
  						island.m_bodies[i] = null
  					}
  				}
  			}
  		}
  
  		@m_broadPhase.Commit()
  
  		//@m_stackAllocator.Free(stack)
  	},
  
  	// @Query the world for all shapes that potentially overlap the
  	// provided AABB. You provide a shape pointer buffer of specified
  	// size. The number of shapes found is returned.
  	Query: function(aabb, shapes, maxCount){
  
  		//void** results = (void**)@m_stackAllocator.Allocate(maxCount * sizeof(void*))
  		var results = new Array()
  		var count = @m_broadPhase.QueryAABB(aabb, results, maxCount)
  
  		for (var i = 0 i < count ++i)
  		{
  			shapes[i] = results[i]
  		}
  
  		//@m_stackAllocator.Free(results)
  		return count
  	},
  
  	// You can use these to iterate over all the bodies, joints, and contacts.
  	GetBodyList: function(){
  		return @m_bodyList
  	},
  	GetJointList: function(){
  		return @m_jointList
  	},
  	GetContactList: function(){
  		return @m_contactList
  	},
  
  	//--------------- Internals Below -------------------
  
  	m_blockAllocator: null,
  	m_stackAllocator: null,
  
  	m_broadPhase: null,
  	m_contactManager: new b2ContactManager(),
  
  	m_bodyList: null,
  	m_contactList: null,
  	m_jointList: null,
  
  	m_bodyCount: 0,
  	m_contactCount: 0,
  	m_jointCount: 0,
  
  	// These bodies will be destroyed at the next time @step.
  	m_bodyDestroyList: null,
  
  	m_gravity: null,
  	m_allowSleep: null,
  
  	m_groundBody: null,
  
  	m_listener: null,
  	m_filter: null,
  
  	m_positionIterationCount: 0}
  b2World.s_enablePositionCorrection = 1
  b2World.s_enableWarmStarting = 1*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Island;
  exports.b2Island = b2Island = b2Island = (function() {
    function b2Island(bodyCapacity, contactCapacity, jointCapacity, allocator) {
      var i;
      this.m_bodyCapacity = bodyCapacity;
      this.m_contactCapacity = contactCapacity;
      this.m_jointCapacity = jointCapacity;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_bodies = new Array(bodyCapacity);
      for (i = 0; 0 <= bodyCapacity ? i < bodyCapacity : i > bodyCapacity; 0 <= bodyCapacity ? i++ : i--) {
        this.m_bodies[i] = null;
      }
      this.m_contacts = new Array(contactCapacity);
      for (i = 0; 0 <= contactCapacity ? i < contactCapacity : i > contactCapacity; 0 <= contactCapacity ? i++ : i--) {
        this.m_contacts[i] = null;
      }
      this.m_joints = new Array(jointCapacity);
      for (i = 0; 0 <= jointCapacity ? i < jointCapacity : i > jointCapacity; 0 <= jointCapacity ? i++ : i--) {
        this.m_joints[i] = null;
      }
      this.m_allocator = allocator;
    }
    return b2Island;
  })();
  /*
  var b2Island = Class.create()
  b2Island.prototype = 
  {
  	initialize: function(bodyCapacity, contactCapacity, jointCapacity, allocator)
  	{
  		var i = 0
  
  		@m_bodyCapacity = bodyCapacity
  		@m_contactCapacity = contactCapacity
  		@m_jointCapacity	 = jointCapacity
  		@m_bodyCount = 0
  		@m_contactCount = 0
  		@m_jointCount = 0
  
  
  		//@m_bodies = (b2Body**)allocator->Allocate(bodyCapacity * sizeof(b2Body*))
  		@m_bodies = new Array(bodyCapacity)
  		for (i = 0 i < bodyCapacity i++)
  			@m_bodies[i] = null
  
  		//@m_contacts = (b2Contact**)allocator->Allocate(contactCapacity	 * sizeof(b2Contact*))
  		@m_contacts = new Array(contactCapacity)
  		for (i = 0 i < contactCapacity i++)
  			@m_contacts[i] = null
  
  		//@m_joints = (b2Joint**)allocator->Allocate(jointCapacity * sizeof(b2Joint*))
  		@m_joints = new Array(jointCapacity)
  		for (i = 0 i < jointCapacity i++)
  			@m_joints[i] = null
  
  		@m_allocator = allocator
  	},
  	//~b2Island()
  
  	Clear: function()
  	{
  		@m_bodyCount = 0
  		@m_contactCount = 0
  		@m_jointCount = 0
  	},
  
  	Solve: function(step, gravity)
  	{
  		var i = 0
  		var b
  
  		for (i = 0 i < @m_bodyCount ++i)
  		{
  			b = @m_bodies[i]
  
  			if (b.m_invMass == 0.0)
  				continue
  
  			b.m_linearVelocity.Add( b2Math.MulFV (step.dt, b2Math.AddVV(gravity, b2Math.MulFV( b.m_invMass, b.m_force ) ) ) )
  			b.m_angularVelocity += step.dt * b.m_invI * b.m_torque
  
  			//b.m_linearVelocity *= b.m_linearDamping
  			b.m_linearVelocity.Multiply(b.m_linearDamping)
  			b.m_angularVelocity *= b.m_angularDamping
  
  			// Store positions for conservative advancement.
  			b.m_position0.SetV(b.m_position)
  			b.m_rotation0 = b.m_rotation
  		}
  
  		var contactSolver = new b2ContactSolver(@m_contacts, @m_contactCount, @m_allocator)
  
  		// Pre-solve
  		contactSolver.PreSolve()
  
  		for (i = 0 i < @m_jointCount ++i)
  		{
  			@m_joints[i].PrepareVelocitySolver()
  		}
  
  		// @Solve velocity constraints.
  		for (i = 0 i < step.iterations ++i)
  		{
  			contactSolver.SolveVelocityConstraints()
  
  			for (var j = 0 j < @m_jointCount ++j)
  			{
  				@m_joints[j].SolveVelocityConstraints(step)
  			}
  		}
  
  		// Integrate positions.
  		for (i = 0 i < @m_bodyCount ++i)
  		{
  			b = @m_bodies[i]
  
  			if (b.m_invMass == 0.0)
  				continue
  
  			//b.m_position.Add( b2Math.MulFV (step.dt, b.m_linearVelocity) )
  			b.m_position.x += step.dt * b.m_linearVelocity.x
  			b.m_position.y += step.dt * b.m_linearVelocity.y
  			b.m_rotation += step.dt * b.m_angularVelocity
  
  			b.m_R.Set(b.m_rotation)
  		}
  
  		for (i = 0 i < @m_jointCount ++i)
  		{
  			@m_joints[i].PreparePositionSolver()
  		}
  
  		// @Solve position constraints.
  		if (b2World.s_enablePositionCorrection)
  		{
  			for (b2Island.m_positionIterationCount = 0 b2Island.m_positionIterationCount < step.iterations ++b2Island.m_positionIterationCount)
  			{
  				var contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte)
  
  				var jointsOkay = true
  				for (i = 0 i < @m_jointCount ++i)
  				{
  					var jointOkay = @m_joints[i].SolvePositionConstraints()
  					jointsOkay = jointsOkay && jointOkay
  				}
  
  				if (contactsOkay && jointsOkay)
  				{
  					break
  				}
  			}
  		}
  
  		// Post-solve.
  		contactSolver.PostSolve()
  
  		// Synchronize shapes and reset forces.
  		for (i = 0 i < @m_bodyCount ++i)
  		{
  			b = @m_bodies[i]
  
  			if (b.m_invMass == 0.0)
  				continue
  
  			b.m_R.Set(b.m_rotation)
  
  			b.SynchronizeShapes()
  			b.m_force.Set(0.0, 0.0)
  			b.m_torque = 0.0
  		}
  	},
  
  	UpdateSleep: function(dt)
  	{
  		var i = 0
  		var b
  
  		var minSleepTime = Number.MAX_VALUE
  
  		var linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance
  		var angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance
  
  		for (i = 0 i < @m_bodyCount ++i)
  		{
  			b = @m_bodies[i]
  			if (b.m_invMass == 0.0)
  			{
  				continue
  			}
  
  			if ((b.m_flags & b2Body.e_allowSleepFlag) == 0)
  			{
  				b.m_sleepTime = 0.0
  				minSleepTime = 0.0
  			}
  
  			if ((b.m_flags & b2Body.e_allowSleepFlag) == 0 ||
  				b.m_angularVelocity * b.m_angularVelocity > angTolSqr ||
  				b2Math.b2Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr)
  			{
  				b.m_sleepTime = 0.0
  				minSleepTime = 0.0
  			}
  			else
  			{
  				b.m_sleepTime += dt
  				minSleepTime = b2Math.b2Min(minSleepTime, b.m_sleepTime)
  			}
  		}
  
  		if (minSleepTime >= b2Settings.b2_timeToSleep)
  		{
  			for (i = 0 i < @m_bodyCount ++i)
  			{
  				b = @m_bodies[i]
  				b.m_flags |= b2Body.e_sleepFlag
  			}
  		}
  	},
  
  	AddBody: function(body)
  	{
  		//b2Settings.b2Assert(@m_bodyCount < @m_bodyCapacity)
  		@m_bodies[@m_bodyCount++] = body
  	},
  
  	AddContact: function(contact)
  	{
  		//b2Settings.b2Assert(@m_contactCount < @m_contactCapacity)
  		@m_contacts[@m_contactCount++] = contact
  	},
  
  	AddJoint: function(joint)
  	{
  		//b2Settings.b2Assert(@m_jointCount < @m_jointCapacity)
  		@m_joints[@m_jointCount++] = joint
  	},
  
  	m_allocator: null,
  
  	m_bodies: null,
  	m_contacts: null,
  	m_joints: null,
  
  	m_bodyCount: 0,
  	m_jointCount: 0,
  	m_contactCount: 0,
  
  	m_bodyCapacity: 0,
  	m_contactCapacity: 0,
  	m_jointCapacity: 0,
  
  	m_positionError: null}
  b2Island.m_positionIterationCount = 0*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2BroadPhase;
  exports.b2BroadPhase = b2BroadPhase = b2BroadPhase = (function() {
    function b2BroadPhase(worldAABB, callback) {
      var dX, dY, i, j, tProxy, _ref, _ref2, _ref3;
      this.m_pairManager = new b2PairManager();
      this.m_proxyPool = new Array(b2Settings.b2_maxPairs);
      this.m_bounds = new Array(2 * b2Settings.b2_maxProxies);
      this.m_queryResults = new Array(b2Settings.b2_maxProxies);
      this.m_quantizationFactor = new b2Vec2();
      this.m_pairManager.Initialize(this, callback);
      this.m_worldAABB = worldAABB;
      this.m_proxyCount = 0;
      for (i = 0, _ref = b2Settings.b2_maxProxies; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.m_queryResults[i] = 0;
      }
      this.m_bounds = new Array(2);
      for (i = 0; i < 2; i++) {
        this.m_bounds[i] = new Array(2 * b2Settings.b2_maxProxies);
        for (j = 0, _ref2 = 2 * b2Settings.b2_maxProxies; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
          this.m_bounds[i][j] = new b2Bound();
        }
      }
      dX = worldAABB.maxVertex.x;
      dY = worldAABB.maxVertex.y;
      dX -= worldAABB.minVertex.x;
      dY -= worldAABB.minVertex.y;
      this.m_quantizationFactor.x = b2Settings.USHRT_MAX / dX;
      this.m_quantizationFactor.y = b2Settings.USHRT_MAX / dY;
      for (i = 0, _ref3 = b2Settings.b2_maxProxies - 1; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
        tProxy = new b2Proxy();
        this.m_proxyPool[i] = tProxy;
        tProxy.SetNext(i + 1);
        tProxy.timeStamp = 0;
        tProxy.overlapCount = b2BroadPhase.b2_invalid;
        tProxy.userData = null;
      }
      tProxy = new b2Proxy();
      this.m_proxyPool[b2Settings.b2_maxProxies - 1] = tProxy;
      tProxy.SetNext(b2Pair.b2_nullProxy);
      tProxy.timeStamp = 0;
      tProxy.overlapCount = b2BroadPhase.b2_invalid;
      tProxy.userData = null;
      this.m_freeProxy = 0;
      this.m_timeStamp = 1;
      this.m_queryResultCount = 0;
    }
    b2BroadPhase.prototype.InRange = function(aabb) {
      var d2X, d2Y, dX, dY;
      dX = aabb.minVertex.x;
      dY = aabb.minVertex.y;
      dX -= this.m_worldAABB.maxVertex.x;
      dY -= this.m_worldAABB.maxVertex.y;
      d2X = this.m_worldAABB.minVertex.x;
      d2Y = this.m_worldAABB.minVertex.y;
      d2X -= aabb.maxVertex.x;
      d2Y -= aabb.maxVertex.y;
      dX = b2Math.b2Max(dX, d2X);
      dY = b2Math.b2Max(dY, d2Y);
      return b2Math.b2Max(dX, dY) < 0.0;
    };
    b2BroadPhase.prototype.Commit = function() {
      return this.m_pairManager.Commit();
    };
    return b2BroadPhase;
  })();
  /*
  var b2BroadPhase = Class.create()
  b2BroadPhase.prototype = 
  {
  //public:
  	initialize: function(worldAABB, callback){
  		// initialize instance variables for references
  		@m_pairManager = new b2PairManager()
  		@m_proxyPool = new Array(b2Settings.b2_maxPairs)
  		@m_bounds = new Array(2*b2Settings.b2_maxProxies)
  		@m_queryResults = new Array(b2Settings.b2_maxProxies)
  		@m_quantizationFactor = new b2Vec2()
  		//
  
  		//b2Settings.b2Assert(worldAABB.IsValid())
  		var i = 0
  
  		@m_pairManager.Initialize(@, callback)
  
  		@m_worldAABB = worldAABB
  
  		@m_proxyCount = 0
  
  		// query results
  		for (i = 0 i < b2Settings.b2_maxProxies i++){
  			@m_queryResults[i] = 0
  		}
  
  		// bounds array
  		@m_bounds = new Array(2)
  		for (i = 0 i < 2 i++){
  			@m_bounds[i] = new Array(2*b2Settings.b2_maxProxies)
  			for (var j = 0 j < 2*b2Settings.b2_maxProxies j++){
  				@m_bounds[i][j] = new b2Bound()
  			}
  		}
  
  		//var d = b2Math.SubtractVV(worldAABB.maxVertex, worldAABB.minVertex)
  		var dX = worldAABB.maxVertex.x
  		var dY = worldAABB.maxVertex.y
  		dX -= worldAABB.minVertex.x
  		dY -= worldAABB.minVertex.y
  
  		@m_quantizationFactor.x = b2Settings.USHRT_MAX / dX
  		@m_quantizationFactor.y = b2Settings.USHRT_MAX / dY
  
  		var tProxy
  		for (i = 0 i < b2Settings.b2_maxProxies - 1 ++i)
  		{
  			tProxy = new b2Proxy()
  			@m_proxyPool[i] = tProxy
  			tProxy.SetNext(i + 1)
  			tProxy.timeStamp = 0
  			tProxy.overlapCount = b2BroadPhase.b2_invalid
  			tProxy.userData = null
  		}
  		tProxy = new b2Proxy()
  		@m_proxyPool[b2Settings.b2_maxProxies-1] = tProxy
  		tProxy.SetNext(b2Pair.b2_nullProxy)
  		tProxy.timeStamp = 0
  		tProxy.overlapCount = b2BroadPhase.b2_invalid
  		tProxy.userData = null
  		@m_freeProxy = 0
  
  		@m_timeStamp = 1
  		@m_queryResultCount = 0
  	},
  	//~b2BroadPhase()
  
  	// Use @ to see if your proxy is in range. If it is not in range,
  	// it should be destroyed. Otherwise you may get O(m^2) pairs, where m
  	// is the number of proxies that are out of range.
  	InRange: function(aabb){
  		//var d = b2Math.b2MaxV(b2Math.SubtractVV(aabb.minVertex, @m_worldAABB.maxVertex), b2Math.SubtractVV(@m_worldAABB.minVertex, aabb.maxVertex))
  		var dX
  		var dY
  		var d2X
  		var d2Y
  
  		dX = aabb.minVertex.x
  		dY = aabb.minVertex.y
  		dX -= @m_worldAABB.maxVertex.x
  		dY -= @m_worldAABB.maxVertex.y
  
  		d2X = @m_worldAABB.minVertex.x
  		d2Y = @m_worldAABB.minVertex.y
  		d2X -= aabb.maxVertex.x
  		d2Y -= aabb.maxVertex.y
  
  		dX = b2Math.b2Max(dX, d2X)
  		dY = b2Math.b2Max(dY, d2Y)
  
  		return b2Math.b2Max(dX, dY) < 0.0
  	},
  
  	// Get a single proxy. Returns NULL if the id is invalid.
  	GetProxy: function(proxyId){
  		if (proxyId == b2Pair.b2_nullProxy || @m_proxyPool[proxyId].IsValid() == false)
  		{
  			return null
  		}
  
  		return @m_proxyPool[ proxyId ]
  	},
  
  	// Create and destroy proxies. These call Flush first.
  	CreateProxy: function(aabb, userData){
  		var index = 0
  		var proxy
  
  		//b2Settings.b2Assert(@m_proxyCount < b2_maxProxies)
  		//b2Settings.b2Assert(@m_freeProxy != b2Pair.b2_nullProxy)
  
  		var proxyId = @m_freeProxy
  		proxy = @m_proxyPool[ proxyId ]
  		@m_freeProxy = proxy.GetNext()
  
  		proxy.overlapCount = 0
  		proxy.userData = userData
  
  		var boundCount = 2 * @m_proxyCount
  
  		var lowerValues = new Array()
  		var upperValues = new Array()
  		@ComputeBounds(lowerValues, upperValues, aabb)
  
  		for (var axis = 0 axis < 2 ++axis)
  		{
  			var bounds = @m_bounds[axis]
  			var lowerIndex = 0
  			var upperIndex = 0
  			var lowerIndexOut = [lowerIndex]
  			var upperIndexOut = [upperIndex]
  			@Query(lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis)
  			lowerIndex = lowerIndexOut[0]
  			upperIndex = upperIndexOut[0]
  
  			// Replace memmove calls
  			//memmove(bounds + upperIndex + 2, bounds + upperIndex, (edgeCount - upperIndex) * sizeof(b2Bound))
  			var tArr = new Array()
  			var j = 0
  			var tEnd = boundCount - upperIndex
  			var tBound1
  			var tBound2
  			// make temp array
  			for (j = 0 j < tEnd j++){
  				tArr[j] = new b2Bound()
  				tBound1 = tArr[j]
  				tBound2 = bounds[upperIndex+j]
  				tBound1.value = tBound2.value
  				tBound1.proxyId = tBound2.proxyId
  				tBound1.stabbingCount = tBound2.stabbingCount
  			}
  			// move temp array back in to bounds
  			tEnd = tArr.length
  			var tIndex = upperIndex+2
  			for (j = 0 j < tEnd j++){
  				//bounds[tIndex+j] = tArr[j]
  				tBound2 = tArr[j]
  				tBound1 = bounds[tIndex+j]
  				tBound1.value = tBound2.value
  				tBound1.proxyId = tBound2.proxyId
  				tBound1.stabbingCount = tBound2.stabbingCount
  			}
  			//memmove(bounds + lowerIndex + 1, bounds + lowerIndex, (upperIndex - lowerIndex) * sizeof(b2Bound))
  			// make temp array
  			tArr = new Array()
  			tEnd = upperIndex - lowerIndex
  			for (j = 0 j < tEnd j++){
  				tArr[j] = new b2Bound()
  				tBound1 = tArr[j]
  				tBound2 = bounds[lowerIndex+j]
  				tBound1.value = tBound2.value
  				tBound1.proxyId = tBound2.proxyId
  				tBound1.stabbingCount = tBound2.stabbingCount
  			}
  			// move temp array back in to bounds
  			tEnd = tArr.length
  			tIndex = lowerIndex+1
  			for (j = 0 j < tEnd j++){
  				//bounds[tIndex+j] = tArr[j]
  				tBound2 = tArr[j]
  				tBound1 = bounds[tIndex+j]
  				tBound1.value = tBound2.value
  				tBound1.proxyId = tBound2.proxyId
  				tBound1.stabbingCount = tBound2.stabbingCount
  			}
  
  			// The upper index has increased because of the lower bound insertion.
  			++upperIndex
  
  			// Copy in the new bounds.
  			bounds[lowerIndex].value = lowerValues[axis]
  			bounds[lowerIndex].proxyId = proxyId
  			bounds[upperIndex].value = upperValues[axis]
  			bounds[upperIndex].proxyId = proxyId
  
  			bounds[lowerIndex].stabbingCount = lowerIndex == 0 ? 0 : bounds[lowerIndex-1].stabbingCount
  			bounds[upperIndex].stabbingCount = bounds[upperIndex-1].stabbingCount
  
  			// Adjust the stabbing count between the new bounds.
  			for (index = lowerIndex index < upperIndex ++index)
  			{
  				bounds[index].stabbingCount++
  			}
  
  			// Adjust the all the affected bound indices.
  			for (index = lowerIndex index < boundCount + 2 ++index)
  			{
  				var proxy2 = @m_proxyPool[ bounds[index].proxyId ]
  				if (bounds[index].IsLower())
  				{
  					proxy2.lowerBounds[axis] = index
  				}
  				else
  				{
  					proxy2.upperBounds[axis] = index
  				}
  			}
  		}
  
  		++@m_proxyCount
  
  		//b2Settings.b2Assert(@m_queryResultCount < b2Settings.b2_maxProxies)
  
  		for (var i = 0 i < @m_queryResultCount ++i)
  		{
  			//b2Settings.b2Assert(@m_queryResults[i] < b2_maxProxies)
  			//b2Settings.b2Assert(@m_proxyPool[@m_queryResults[i]].IsValid())
  
  			@m_pairManager.AddBufferedPair(proxyId, @m_queryResults[i])
  		}
  
  		@m_pairManager.Commit()
  
  		// Prepare for next query.
  		@m_queryResultCount = 0
  		@IncrementTimeStamp()
  
  		return proxyId
  	},
  
  	DestroyProxy: function(proxyId){
  
  		//b2Settings.b2Assert(0 < @m_proxyCount && @m_proxyCount <= b2_maxProxies)
  
  		var proxy = @m_proxyPool[ proxyId ]
  		//b2Settings.b2Assert(proxy.IsValid())
  
  		var boundCount = 2 * @m_proxyCount
  
  		for (var axis = 0 axis < 2 ++axis)
  		{
  			var bounds = @m_bounds[axis]
  
  			var lowerIndex = proxy.lowerBounds[axis]
  			var upperIndex = proxy.upperBounds[axis]
  			var lowerValue = bounds[lowerIndex].value
  			var upperValue = bounds[upperIndex].value
  
  			// replace memmove calls
  			//memmove(bounds + lowerIndex, bounds + lowerIndex + 1, (upperIndex - lowerIndex - 1) * sizeof(b2Bound))
  			var tArr = new Array()
  			var j = 0
  			var tEnd = upperIndex - lowerIndex - 1
  			var tBound1
  			var tBound2
  			// make temp array
  			for (j = 0 j < tEnd j++){
  				tArr[j] = new b2Bound()
  				tBound1 = tArr[j]
  				tBound2 = bounds[lowerIndex+1+j]
  				tBound1.value = tBound2.value
  				tBound1.proxyId = tBound2.proxyId
  				tBound1.stabbingCount = tBound2.stabbingCount
  			}
  			// move temp array back in to bounds
  			tEnd = tArr.length
  			var tIndex = lowerIndex
  			for (j = 0 j < tEnd j++){
  				//bounds[tIndex+j] = tArr[j]
  				tBound2 = tArr[j]
  				tBound1 = bounds[tIndex+j]
  				tBound1.value = tBound2.value
  				tBound1.proxyId = tBound2.proxyId
  				tBound1.stabbingCount = tBound2.stabbingCount
  			}
  			//memmove(bounds + upperIndex-1, bounds + upperIndex + 1, (edgeCount - upperIndex - 1) * sizeof(b2Bound))
  			// make temp array
  			tArr = new Array()
  			tEnd = boundCount - upperIndex - 1
  			for (j = 0 j < tEnd j++){
  				tArr[j] = new b2Bound()
  				tBound1 = tArr[j]
  				tBound2 = bounds[upperIndex+1+j]
  				tBound1.value = tBound2.value
  				tBound1.proxyId = tBound2.proxyId
  				tBound1.stabbingCount = tBound2.stabbingCount
  			}
  			// move temp array back in to bounds
  			tEnd = tArr.length
  			tIndex = upperIndex-1
  			for (j = 0 j < tEnd j++){
  				//bounds[tIndex+j] = tArr[j]
  				tBound2 = tArr[j]
  				tBound1 = bounds[tIndex+j]
  				tBound1.value = tBound2.value
  				tBound1.proxyId = tBound2.proxyId
  				tBound1.stabbingCount = tBound2.stabbingCount
  			}
  
  			// Fix bound indices.
  			tEnd = boundCount - 2
  			for (var index = lowerIndex index < tEnd ++index)
  			{
  				var proxy2 = @m_proxyPool[ bounds[index].proxyId ]
  				if (bounds[index].IsLower())
  				{
  					proxy2.lowerBounds[axis] = index
  				}
  				else
  				{
  					proxy2.upperBounds[axis] = index
  				}
  			}
  
  			// Fix stabbing count.
  			tEnd = upperIndex - 1
  			for (var index2 = lowerIndex index2 < tEnd ++index2)
  			{
  				bounds[index2].stabbingCount--
  			}
  
  			// @Query for pairs to be removed. lowerIndex and upperIndex are not needed.
  			// make lowerIndex and upper output using an array and do @ for others if compiler doesn't pick them up
  			@Query([0], [0], lowerValue, upperValue, bounds, boundCount - 2, axis)
  		}
  
  		//b2Settings.b2Assert(@m_queryResultCount < b2Settings.b2_maxProxies)
  
  		for (var i = 0 i < @m_queryResultCount ++i)
  		{
  			//b2Settings.b2Assert(@m_proxyPool[@m_queryResults[i]].IsValid())
  
  			@m_pairManager.RemoveBufferedPair(proxyId, @m_queryResults[i])
  		}
  
  		@m_pairManager.Commit()
  
  		// Prepare for next query.
  		@m_queryResultCount = 0
  		@IncrementTimeStamp()
  
  		// Return the proxy to the pool.
  		proxy.userData = null
  		proxy.overlapCount = b2BroadPhase.b2_invalid
  		proxy.lowerBounds[0] = b2BroadPhase.b2_invalid
  		proxy.lowerBounds[1] = b2BroadPhase.b2_invalid
  		proxy.upperBounds[0] = b2BroadPhase.b2_invalid
  		proxy.upperBounds[1] = b2BroadPhase.b2_invalid
  
  		proxy.SetNext(@m_freeProxy)
  		@m_freeProxy = proxyId
  		--@m_proxyCount
  	},
  
  
  	// Call @MoveProxy times like, then when you are done
  	// call @Commit to finalized the proxy pairs (for your time step).
  	MoveProxy: function(proxyId, aabb){
  		var axis = 0
  		var index = 0
  		var bound
  		var prevBound
  		var nextBound
  		var nextProxyId = 0
  		var nextProxy
  
  		if (proxyId == b2Pair.b2_nullProxy || b2Settings.b2_maxProxies <= proxyId)
  		{
  			//b2Settings.b2Assert(false)
  			return
  		}
  
  		if (aabb.IsValid() == false)
  		{
  			//b2Settings.b2Assert(false)
  			return
  		}
  
  		var boundCount = 2 * @m_proxyCount
  
  		var proxy = @m_proxyPool[ proxyId ]
  		// Get new bound values
  		var newValues = new b2BoundValues()
  		@ComputeBounds(newValues.lowerValues, newValues.upperValues, aabb)
  
  		// Get old bound values
  		var oldValues = new b2BoundValues()
  		for (axis = 0 axis < 2 ++axis)
  		{
  			oldValues.lowerValues[axis] = @m_bounds[axis][proxy.lowerBounds[axis]].value
  			oldValues.upperValues[axis] = @m_bounds[axis][proxy.upperBounds[axis]].value
  		}
  
  		for (axis = 0 axis < 2 ++axis)
  		{
  			var bounds = @m_bounds[axis]
  
  			var lowerIndex = proxy.lowerBounds[axis]
  			var upperIndex = proxy.upperBounds[axis]
  
  			var lowerValue = newValues.lowerValues[axis]
  			var upperValue = newValues.upperValues[axis]
  
  			var deltaLower = lowerValue - bounds[lowerIndex].value
  			var deltaUpper = upperValue - bounds[upperIndex].value
  
  			bounds[lowerIndex].value = lowerValue
  			bounds[upperIndex].value = upperValue
  
  			//
  			// Expanding adds overlaps
  			//
  
  			// Should we move the lower bound down?
  			if (deltaLower < 0)
  			{
  				index = lowerIndex
  				while (index > 0 && lowerValue < bounds[index-1].value)
  				{
  					bound = bounds[index]
  					prevBound = bounds[index - 1]
  
  					var prevProxyId = prevBound.proxyId
  					var prevProxy = @m_proxyPool[ prevBound.proxyId ]
  
  					prevBound.stabbingCount++
  
  					if (prevBound.IsUpper() == true)
  					{
  						if (@TestOverlap(newValues, prevProxy))
  						{
  							@m_pairManager.AddBufferedPair(proxyId, prevProxyId)
  						}
  
  						prevProxy.upperBounds[axis]++
  						bound.stabbingCount++
  					}
  					else
  					{
  						prevProxy.lowerBounds[axis]++
  						bound.stabbingCount--
  					}
  
  					proxy.lowerBounds[axis]--
  
  					// swap
  					//var temp = bound
  					//bound = prevEdge
  					//prevEdge = temp
  					bound.Swap(prevBound)
  					//b2Math.b2Swap(bound, prevEdge)
  					--index
  				}
  			}
  
  			// Should we move the upper bound up?
  			if (deltaUpper > 0)
  			{
  				index = upperIndex
  				while (index < boundCount-1 && bounds[index+1].value <= upperValue)
  				{
  					bound = bounds[ index ]
  					nextBound = bounds[ index + 1 ]
  					nextProxyId = nextBound.proxyId
  					nextProxy = @m_proxyPool[ nextProxyId ]
  
  					nextBound.stabbingCount++
  
  					if (nextBound.IsLower() == true)
  					{
  						if (@TestOverlap(newValues, nextProxy))
  						{
  							@m_pairManager.AddBufferedPair(proxyId, nextProxyId)
  						}
  
  						nextProxy.lowerBounds[axis]--
  						bound.stabbingCount++
  					}
  					else
  					{
  						nextProxy.upperBounds[axis]--
  						bound.stabbingCount--
  					}
  
  					proxy.upperBounds[axis]++
  					// swap
  					//var temp = bound
  					//bound = nextEdge
  					//nextEdge = temp
  					bound.Swap(nextBound)
  					//b2Math.b2Swap(bound, nextEdge)
  					index++
  				}
  			}
  
  			//
  			// Shrinking removes overlaps
  			//
  
  			// Should we move the lower bound up?
  			if (deltaLower > 0)
  			{
  				index = lowerIndex
  				while (index < boundCount-1 && bounds[index+1].value <= lowerValue)
  				{
  					bound = bounds[ index ]
  					nextBound = bounds[ index + 1 ]
  
  					nextProxyId = nextBound.proxyId
  					nextProxy = @m_proxyPool[ nextProxyId ]
  
  					nextBound.stabbingCount--
  
  					if (nextBound.IsUpper())
  					{
  						if (@TestOverlap(oldValues, nextProxy))
  						{
  							@m_pairManager.RemoveBufferedPair(proxyId, nextProxyId)
  						}
  
  						nextProxy.upperBounds[axis]--
  						bound.stabbingCount--
  					}
  					else
  					{
  						nextProxy.lowerBounds[axis]--
  						bound.stabbingCount++
  					}
  
  					proxy.lowerBounds[axis]++
  					// swap
  					//var temp = bound
  					//bound = nextEdge
  					//nextEdge = temp
  					bound.Swap(nextBound)
  					//b2Math.b2Swap(bound, nextEdge)
  					index++
  				}
  			}
  
  			// Should we move the upper bound down?
  			if (deltaUpper < 0)
  			{
  				index = upperIndex
  				while (index > 0 && upperValue < bounds[index-1].value)
  				{
  					bound = bounds[index]
  					prevBound = bounds[index - 1]
  
  					prevProxyId = prevBound.proxyId
  					prevProxy = @m_proxyPool[ prevProxyId ]
  
  					prevBound.stabbingCount--
  
  					if (prevBound.IsLower() == true)
  					{
  						if (@TestOverlap(oldValues, prevProxy))
  						{
  							@m_pairManager.RemoveBufferedPair(proxyId, prevProxyId)
  						}
  
  						prevProxy.lowerBounds[axis]++
  						bound.stabbingCount--
  					}
  					else
  					{
  						prevProxy.upperBounds[axis]++
  						bound.stabbingCount++
  					}
  
  					proxy.upperBounds[axis]--
  					// swap
  					//var temp = bound
  					//bound = prevEdge
  					//prevEdge = temp
  					bound.Swap(prevBound)
  					//b2Math.b2Swap(bound, prevEdge)
  					index--
  				}
  			}
  		}
  	},
  
  	Commit: function(){
  		@m_pairManager.Commit()
  	},
  
  	// @Query an AABB for overlapping proxies, returns the user data and
  	// the count, up to the supplied maximum count.
  	QueryAABB: function(aabb, userData, maxCount){
  		var lowerValues = new Array()
  		var upperValues = new Array()
  		@ComputeBounds(lowerValues, upperValues, aabb)
  
  		var lowerIndex = 0
  		var upperIndex = 0
  		var lowerIndexOut = [lowerIndex]
  		var upperIndexOut = [upperIndex]
  		@Query(lowerIndexOut, upperIndexOut, lowerValues[0], upperValues[0], @m_bounds[0], 2*@m_proxyCount, 0)
  		@Query(lowerIndexOut, upperIndexOut, lowerValues[1], upperValues[1], @m_bounds[1], 2*@m_proxyCount, 1)
  
  		//b2Settings.b2Assert(@m_queryResultCount < b2Settings.b2_maxProxies)
  
  		var count = 0
  		for (var i = 0 i < @m_queryResultCount && count < maxCount ++i, ++count)
  		{
  			//b2Settings.b2Assert(@m_queryResults[i] < b2Settings.b2_maxProxies)
  			var proxy = @m_proxyPool[ @m_queryResults[i] ]
  			//b2Settings.b2Assert(proxy.IsValid())
  			userData[i] = proxy.userData
  		}
  
  		// Prepare for next query.
  		@m_queryResultCount = 0
  		@IncrementTimeStamp()
  
  		return count
  	},
  
  	Validate: function(){
  		var pair
  		var proxy1
  		var proxy2
  		var overlap
  
  		for (var axis = 0 axis < 2 ++axis)
  		{
  			var bounds = @m_bounds[axis]
  
  			var boundCount = 2 * @m_proxyCount
  			var stabbingCount = 0
  
  			for (var i = 0 i < boundCount ++i)
  			{
  				var bound = bounds[i]
  				//b2Settings.b2Assert(i == 0 || bounds[i-1].value <= bound->value)
  				//b2Settings.b2Assert(bound->proxyId != b2_nullProxy)
  				//b2Settings.b2Assert(@m_proxyPool[bound->proxyId].IsValid())
  
  				if (bound.IsLower() == true)
  				{
  					//b2Settings.b2Assert(@m_proxyPool[bound.proxyId].lowerBounds[axis] == i)
  					stabbingCount++
  				}
  				else
  				{
  					//b2Settings.b2Assert(@m_proxyPool[bound.proxyId].upperBounds[axis] == i)
  					stabbingCount--
  				}
  
  				//b2Settings.b2Assert(bound.stabbingCount == stabbingCount)
  			}
  		}
  
  	},
  
  //private:
  	ComputeBounds: function(lowerValues, upperValues, aabb)
  	{
  		//b2Settings.b2Assert(aabb.maxVertex.x > aabb.minVertex.x)
  		//b2Settings.b2Assert(aabb.maxVertex.y > aabb.minVertex.y)
  
  		//var minVertex = b2Math.b2ClampV(aabb.minVertex, @m_worldAABB.minVertex, @m_worldAABB.maxVertex)
  		var minVertexX = aabb.minVertex.x
  		var minVertexY = aabb.minVertex.y
  		minVertexX = b2Math.b2Min(minVertexX, @m_worldAABB.maxVertex.x)
  		minVertexY = b2Math.b2Min(minVertexY, @m_worldAABB.maxVertex.y)
  		minVertexX = b2Math.b2Max(minVertexX, @m_worldAABB.minVertex.x)
  		minVertexY = b2Math.b2Max(minVertexY, @m_worldAABB.minVertex.y)
  
  		//var maxVertex = b2Math.b2ClampV(aabb.maxVertex, @m_worldAABB.minVertex, @m_worldAABB.maxVertex)
  		var maxVertexX = aabb.maxVertex.x
  		var maxVertexY = aabb.maxVertex.y
  		maxVertexX = b2Math.b2Min(maxVertexX, @m_worldAABB.maxVertex.x)
  		maxVertexY = b2Math.b2Min(maxVertexY, @m_worldAABB.maxVertex.y)
  		maxVertexX = b2Math.b2Max(maxVertexX, @m_worldAABB.minVertex.x)
  		maxVertexY = b2Math.b2Max(maxVertexY, @m_worldAABB.minVertex.y)
  
  		// Bump lower bounds downs and upper bounds up. @ ensures correct sorting of
  		// lower/upper bounds that would have equal values.
  		// TODO_ERIN implement fast float to uint16 conversion.
  		lowerValues[0] = (@m_quantizationFactor.x * (minVertexX - @m_worldAABB.minVertex.x)) & (b2Settings.USHRT_MAX - 1)
  		upperValues[0] = ((@m_quantizationFactor.x * (maxVertexX - @m_worldAABB.minVertex.x))& 0x0000ffff) | 1
  
  		lowerValues[1] = (@m_quantizationFactor.y * (minVertexY - @m_worldAABB.minVertex.y)) & (b2Settings.USHRT_MAX - 1)
  		upperValues[1] = ((@m_quantizationFactor.y * (maxVertexY - @m_worldAABB.minVertex.y))& 0x0000ffff) | 1
  	},
  
  	// @ one is only used for validation.
  	TestOverlapValidate: function(p1, p2){
  
  		for (var axis = 0 axis < 2 ++axis)
  		{
  			var bounds = @m_bounds[axis]
  
  			//b2Settings.b2Assert(p1.lowerBounds[axis] < 2 * @m_proxyCount)
  			//b2Settings.b2Assert(p1.upperBounds[axis] < 2 * @m_proxyCount)
  			//b2Settings.b2Assert(p2.lowerBounds[axis] < 2 * @m_proxyCount)
  			//b2Settings.b2Assert(p2.upperBounds[axis] < 2 * @m_proxyCount)
  
  			if (bounds[p1.lowerBounds[axis]].value > bounds[p2.upperBounds[axis]].value)
  				return false
  
  			if (bounds[p1.upperBounds[axis]].value < bounds[p2.lowerBounds[axis]].value)
  				return false
  		}
  
  		return true
  	},
  
  	TestOverlap: function(b, p)
  	{
  		for (var axis = 0 axis < 2 ++axis)
  		{
  			var bounds = @m_bounds[axis]
  
  			//b2Settings.b2Assert(p.lowerBounds[axis] < 2 * @m_proxyCount)
  			//b2Settings.b2Assert(p.upperBounds[axis] < 2 * @m_proxyCount)
  
  			if (b.lowerValues[axis] > bounds[p.upperBounds[axis]].value)
  				return false
  
  			if (b.upperValues[axis] < bounds[p.lowerBounds[axis]].value)
  				return false
  		}
  
  		return true
  	},
  
  	Query: function(lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis){
  
  		var lowerQuery = b2BroadPhase.BinarySearch(bounds, boundCount, lowerValue)
  		var upperQuery = b2BroadPhase.BinarySearch(bounds, boundCount, upperValue)
  
  		// Easy case: lowerQuery <= lowerIndex(i) < upperQuery
  		// Solution: search query range for min bounds.
  		for (var j = lowerQuery j < upperQuery ++j)
  		{
  			if (bounds[j].IsLower())
  			{
  				@IncrementOverlapCount(bounds[j].proxyId)
  			}
  		}
  
  		// Hard case: lowerIndex(i) < lowerQuery < upperIndex(i)
  		// Solution: use the stabbing count to search down the bound array.
  		if (lowerQuery > 0)
  		{
  			var i = lowerQuery - 1
  			var s = bounds[i].stabbingCount
  
  			// Find the s overlaps.
  			while (s)
  			{
  				//b2Settings.b2Assert(i >= 0)
  
  				if (bounds[i].IsLower())
  				{
  					var proxy = @m_proxyPool[ bounds[i].proxyId ]
  					if (lowerQuery <= proxy.upperBounds[axis])
  					{
  						@IncrementOverlapCount(bounds[i].proxyId)
  						--s
  					}
  				}
  				--i
  			}
  		}
  
  		lowerQueryOut[0] = lowerQuery
  		upperQueryOut[0] = upperQuery
  	},
  
  
  	IncrementOverlapCount: function(proxyId){
  		var proxy = @m_proxyPool[ proxyId ]
  		if (proxy.timeStamp < @m_timeStamp)
  		{
  			proxy.timeStamp = @m_timeStamp
  			proxy.overlapCount = 1
  		}
  		else
  		{
  			proxy.overlapCount = 2
  			//b2Settings.b2Assert(@m_queryResultCount < b2Settings.b2_maxProxies)
  			@m_queryResults[@m_queryResultCount] = proxyId
  			++@m_queryResultCount
  		}
  	},
  	IncrementTimeStamp: function(){
  		if (@m_timeStamp == b2Settings.USHRT_MAX)
  		{
  			for (var i = 0 i < b2Settings.b2_maxProxies ++i)
  			{
  				@m_proxyPool[i].timeStamp = 0
  			}
  			@m_timeStamp = 1
  		}
  		else
  		{
  			++@m_timeStamp
  		}
  	},
  
  //public:
  	m_pairManager: new b2PairManager(),
  
  	m_proxyPool: new Array(b2Settings.b2_maxPairs),
  	m_freeProxy: 0,
  
  	m_bounds: new Array(2*b2Settings.b2_maxProxies),
  
  	m_queryResults: new Array(b2Settings.b2_maxProxies),
  	m_queryResultCount: 0,
  
  	m_worldAABB: null,
  	m_quantizationFactor: new b2Vec2(),
  	m_proxyCount: 0,
  	m_timeStamp: 0}
  b2BroadPhase.s_validate = false
  b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX
  b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX
  b2BroadPhase.BinarySearch = function(bounds, count, value)
  	{
  		var low = 0
  		var high = count - 1
  		while (low <= high)
  		{
  			var mid = Math.floor((low + high) / 2)
  			if (bounds[mid].value > value)
  			{
  				high = mid - 1
  			}
  			else if (bounds[mid].value < value)
  			{
  				low = mid + 1
  			}
  			else
  			{
  				return (mid)
  			}
  		}
  
  		return (low)
  	}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2ShapeDef;
  exports.b2ShapeDef = b2ShapeDef = b2ShapeDef = (function() {
    b2ShapeDef.prototype.type = 0;
    b2ShapeDef.prototype.userData = null;
    b2ShapeDef.prototype.localPosition = null;
    b2ShapeDef.prototype.localRotation = null;
    b2ShapeDef.prototype.friction = null;
    b2ShapeDef.prototype.restitution = null;
    b2ShapeDef.prototype.density = null;
    function b2ShapeDef() {
      this.type = b2Shape.e_unknownShape;
      this.userData = null;
      this.localPosition = new b2Vec2(0.0, 0.0);
      this.localRotation = 0.0;
      this.friction = 0.2;
      this.restitution = 0.0;
      this.density = 0.0;
      this.categoryBits = 0x0001;
      this.maskBits = 0xFFFF;
      this.groupIndex = 0;
    }
    b2ShapeDef.prototype.ComputeMass = function(massData) {
      var box, circle, poly;
      massData.center = new b2Vec2(0.0, 0.0);
      if (this.density === 0.0) {
        massData.mass = 0.0;
        massData.center.Set(0.0, 0.0);
        massData.I = 0.0;
      }
      switch (this.type) {
        case b2Shape.e_circleShape:
          circle = this;
          massData.mass = this.density * b2Settings.b2_pi * circle.radius * circle.radius;
          massData.center.Set(0.0, 0.0);
          return massData.I = 0.5 * massData.mass * circle.radius * circle.radius;
        case b2Shape.e_boxShape:
          box = this;
          massData.mass = 4.0 * this.density * box.extents.x * box.extents.y;
          massData.center.Set(0.0, 0.0);
          return massData.I = massData.mass / 3.0 * b2Math.b2Dot(box.extents, box.extents);
        case b2Shape.e_polyShape:
          poly = this;
          return b2Shape.PolyMass(massData, poly.vertices, poly.vertexCount, this.density);
        default:
          massData.mass = 0.0;
          massData.center.Set(0.0, 0.0);
          return massData.I = 0.0;
      }
    };
    return b2ShapeDef;
  })();
  /*
  var b2ShapeDef = Class.create()
  b2ShapeDef.prototype = 
  {
  	initialize: function()
  	{
  		@type = b2Shape.e_unknownShape
  		@userData = null
  		@localPosition = new b2Vec2(0.0, 0.0)
  		@localRotation = 0.0
  		@friction = 0.2
  		@restitution = 0.0
  		@density = 0.0
  		@categoryBits = 0x0001
  		@maskBits = 0xFFFF
  		@groupIndex = 0
  	},
  
  	//virtual ~b2ShapeDef() {}
  
  	ComputeMass: function(massData)
  	{
  
  		massData.center = new b2Vec2(0.0, 0.0)
  
  		if (@density == 0.0)
  		{
  			massData.mass = 0.0
  			massData.center.Set(0.0, 0.0)
  			massData.I = 0.0
  		}
  
  		switch (@type)
  		{
  		case b2Shape.e_circleShape:
  			{
  				var circle = @
  				massData.mass = @density * b2Settings.b2_pi * circle.radius * circle.radius
  				massData.center.Set(0.0, 0.0)
  				massData.I = 0.5 * (massData.mass) * circle.radius * circle.radius
  			}
  			break
  
  		case b2Shape.e_boxShape:
  			{
  				var box = @
  				massData.mass = 4.0 * @density * box.extents.x * box.extents.y
  				massData.center.Set(0.0, 0.0)
  				massData.I = massData.mass / 3.0 * b2Math.b2Dot(box.extents, box.extents)
  			}
  			break
  
  		case b2Shape.e_polyShape:
  			{
  				var poly = @
  				b2Shape.PolyMass(massData, poly.vertices, poly.vertexCount, @density)
  			}
  			break
  
  		default:
  			massData.mass = 0.0
  			massData.center.Set(0.0, 0.0)
  			massData.I = 0.0
  			break
  		}
  	},
  
  	type: 0,
  	userData: null,
  	localPosition: null,
  	localRotation: null,
  	friction: null,
  	restitution: null,
  	density: null,
  
  	// The collision category bits. Normally you would just set one bit.
  	categoryBits: 0,
  
  	// The collision mask bits. @ states the categories that @
  	// shape would accept for collision.
  	maskBits: 0,
  
  	// Collision groups allow a certain group of objects to never collide (negative)
  	// or always collide (positive). Zero means no collision group. Non-zero group
  	// filtering always wins against the mask bits.
  	groupIndex: 0}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Shape;
  exports.b2Shape = b2Shape = b2Shape = (function() {
    function b2Shape(def, body) {
      this.m_R = new b2Mat22();
      this.m_position = new b2Vec2();
      this.m_userData = def.userData;
      this.m_friction = def.friction;
      this.m_restitution = def.restitution;
      this.m_body = body;
      this.m_proxyId = b2Pair.b2_nullProxy;
      this.m_maxRadius = 0.0;
      this.m_categoryBits = def.categoryBits;
      this.m_maskBits = def.maskBits;
      this.m_groupIndex = def.groupIndex;
    }
    b2Shape.prototype.TestPoint = function(p) {
      return false;
    };
    b2Shape.prototype.GetUserData = function() {
      return this.m_userData;
    };
    b2Shape.prototype.GetType = function() {
      return this.m_type;
    };
    b2Shape.prototype.GetBody = function() {
      return this.m_body;
    };
    b2Shape.prototype.GetPosition = function() {
      return this.m_position;
    };
    b2Shape.prototype.GetRotationMatrix = function() {
      return this.m_R;
    };
    b2Shape.prototype.ResetProxy = function(broadPhase) {};
    b2Shape.prototype.GetNext = function() {
      return this.m_next;
    };
    return b2Shape;
  })();
  b2Shape.Create = function(def, body, center) {
    switch (def.type) {
      case b2Shape.e_circleShape:
        return new b2CircleShape(def, body, center);
      case b2Shape.e_boxShape:
      case b2Shape.e_polyShape:
        return new b2PolyShape(def, body, center);
      default:
        return null;
    }
  };
  b2Shape.e_unknownShape = -1;
  b2Shape.e_circleShape = 0;
  b2Shape.e_boxShape = 1;
  b2Shape.e_polyShape = 2;
  b2Shape.e_meshShape = 3;
  b2Shape.e_shapeTypeCount = 4;
  /*
          var b2Shape = Class.create()
          b2Shape.prototype = 
          {
          	TestPoint: function(p){return false},
  
          	GetUserData: function(){return @m_userData},
  
          	GetType: function(){
          		return @m_type
          	},
  
          	// Get the parent body of @ shape.
          	GetBody: function(){
          		return @m_body
          	},
  
          	GetPosition: function(){
          		return @m_position
          	},
          	GetRotationMatrix: function(){
          		return @m_R
          	},
  
          	// Remove and then add proxy from the broad-phase.
          	// @ is used to refresh the collision filters.
          	ResetProxy: function(broadPhase){},
  
          	// Get the next shape in the parent body's shape list.
          	GetNext: function(){
          		return @m_next
          	},
  
          	//--------------- Internals Below -------------------
  
  
  
  
          	initialize: function(def, body){
          		// initialize instance variables for references
          		@m_R = new b2Mat22()
          		@m_position = new b2Vec2()
          		//
  
          		@m_userData = def.userData
  
          		@m_friction = def.friction
          		@m_restitution = def.restitution
          		@m_body = body
  
          		@m_proxyId = b2Pair.b2_nullProxy
  
          		@m_maxRadius = 0.0
  
          		@m_categoryBits = def.categoryBits
          		@m_maskBits = def.maskBits
          		@m_groupIndex = def.groupIndex
          	},
  
          	// Internal use only. Do not call.
          	//b2Shape::~b2Shape()
          	//{
          	//	@m_body->m_world->m_broadPhase->@DestroyProxy(@m_proxyId)
          	//}
  
  
          	DestroyProxy: function()
          	{
          		if (@m_proxyId != b2Pair.b2_nullProxy)
          		{
          			@m_body.m_world.m_broadPhase.DestroyProxy(@m_proxyId)
          			@m_proxyId = b2Pair.b2_nullProxy
          		}
          	},
  
  
          	// Internal use only. Do not call.
          	Synchronize: function(position1, R1, position2, R2){},
          	QuickSync: function(position, R){},
          	Support: function(dX, dY, out){},
          	GetMaxRadius: function(){
          		return @m_maxRadius
          	},
  
          	m_next: null,
  
          	m_R: new b2Mat22(),
          	m_position: new b2Vec2(),
  
          	m_type: 0,
  
          	m_userData: null,
  
          	m_body: null,
  
          	m_friction: null,
          	m_restitution: null,
  
          	m_maxRadius: null,
  
          	m_proxyId: 0,
          	m_categoryBits: 0,
          	m_maskBits: 0,
          	m_groupIndex: 0
  
  
  
          	// b2ShapeType
  
  
  
  
  
  
  
  
  
  
  
  
          }
  
  
          b2Shape.Create = function(def, body, center){
          		switch (def.type)
          		{
          		case b2Shape.e_circleShape:
          			{
          				//void* mem = body->m_world->m_blockAllocator.Allocate(sizeof(b2CircleShape))
          				return new b2CircleShape(def, body, center)
          			}
  
          		case b2Shape.e_boxShape:
          		case b2Shape.e_polyShape:
          			{
          				//void* mem = body->m_world->m_blockAllocator.Allocate(sizeof(b2PolyShape))
          				return new b2PolyShape(def, body, center)
          			}
          		}
  
          		//b2Settings.b2Assert(false)
          		return null
          	}
          b2Shape.Destroy = function(shape)
          	{
  
          		// FROM DESTRUCTOR
          		if (shape.m_proxyId != b2Pair.b2_nullProxy)
          			shape.m_body.m_world.m_broadPhase.DestroyProxy(shape.m_proxyId)
          	}
          b2Shape.e_unknownShape = -1
          b2Shape.e_circleShape = 0
          b2Shape.e_boxShape = 1
          b2Shape.e_polyShape = 2
          b2Shape.e_meshShape = 3
          b2Shape.e_shapeTypeCount = 4
          b2Shape.PolyMass = function(massData, vs, count, rho)
          	{
          		//b2Settings.b2Assert(count >= 3)
  
          		//var center = new b2Vec2(0.0, 0.0)
          		var center = new b2Vec2()
          		center.SetZero()
  
          		var area = 0.0
          		var I = 0.0
  
          		// pRef is the reference point for forming triangles.
          		// It's location doesn't change the result (except for rounding error).
          		var pRef = new b2Vec2(0.0, 0.0)
  
          		var inv3 = 1.0 / 3.0
  
          		for (var i = 0 i < count ++i)
          		{
          			// Triangle vertices.
          			var p1 = pRef
          			var p2 = vs[i]
          			var p3 = i + 1 < count ? vs[i+1] : vs[0]
  
          			var e1 = b2Math.SubtractVV(p2, p1)
          			var e2 = b2Math.SubtractVV(p3, p1)
  
          			var D = b2Math.b2CrossVV(e1, e2)
  
          			var triangleArea = 0.5 * D
          			area += triangleArea
  
          			// Area weighted centroid
          			// center += triangleArea * inv3 * (p1 + p2 + p3)
          			var tVec = new b2Vec2()
          			tVec.SetV(p1)
          			tVec.Add(p2)
          			tVec.Add(p3)
          			tVec.Multiply(inv3*triangleArea)
          			center.Add(tVec)
  
          			var px = p1.x
          			var py = p1.y
          			var ex1 = e1.x
          			var ey1 = e1.y
          			var ex2 = e2.x
          			var ey2 = e2.y
  
          			var intx2 = inv3 * (0.25 * (ex1*ex1 + ex2*ex1 + ex2*ex2) + (px*ex1 + px*ex2)) + 0.5*px*px
          			var inty2 = inv3 * (0.25 * (ey1*ey1 + ey2*ey1 + ey2*ey2) + (py*ey1 + py*ey2)) + 0.5*py*py
  
          			I += D * (intx2 + inty2)
          		}
  
          		// Total mass
          		massData.mass = rho * area
  
          		// Center of mass
          		//b2Settings.b2Assert(area > Number.MIN_VALUE)
          		center.Multiply( 1.0 / area )
          		massData.center = center
  
          		// Inertia tensor relative to the center.
          		I = rho * (I - area * b2Math.b2Dot(center, center))
          		massData.I = I
          	}
          b2Shape.PolyCentroid = function(vs, count, out)
          	{
          		//b2Settings.b2Assert(count >= 3)
  
          		//b2Vec2 c c.Set(0.0f, 0.0f)
          		var cX = 0.0
          		var cY = 0.0
          		//float32 area = 0.0f
          		var area = 0.0
  
          		// pRef is the reference point for forming triangles.
          		// It's location doesn't change the result (except for rounding error).
          		//b2Vec2 pRef(0.0f, 0.0f)
          		var pRefX = 0.0
          		var pRefY = 0.0
  
          		//const float32 inv3 = 1.0f / 3.0f
          		var inv3 = 1.0 / 3.0
  
          		for (var i = 0 i < count ++i)
          		{
          			// Triangle vertices.
          			//b2Vec2 p1 = pRef
          			var p1X = pRefX
          			var p1Y = pRefY
          			//b2Vec2 p2 = vs[i]
          			var p2X = vs[i].x
          			var p2Y = vs[i].y
          			//b2Vec2 p3 = i + 1 < count ? vs[i+1] : vs[0]
          			var p3X = i + 1 < count ? vs[i+1].x : vs[0].x
          			var p3Y = i + 1 < count ? vs[i+1].y : vs[0].y
  
          			//b2Vec2 e1 = p2 - p1
          			var e1X = p2X - p1X
          			var e1Y = p2Y - p1Y
          			//b2Vec2 e2 = p3 - p1
          			var e2X = p3X - p1X
          			var e2Y = p3Y - p1Y
  
          			//float32 D = b2Cross(e1, e2)
          			var D = (e1X * e2Y - e1Y * e2X)
  
          			//float32 triangleArea = 0.5f * D
          			var triangleArea = 0.5 * D
          			area += triangleArea
  
          			// Area weighted centroid
          			//c += triangleArea * inv3 * (p1 + p2 + p3)
          			cX += triangleArea * inv3 * (p1X + p2X + p3X)
          			cY += triangleArea * inv3 * (p1Y + p2Y + p3Y)
          		}
  
          		// Centroid
          		//b2Settings.b2Assert(area > Number.MIN_VALUE)
          		cX *= 1.0 / area
          		cY *= 1.0 / area
  
          		// Replace return with 'out' vector
          		//return c
          		out.Set(cX, cY)
          	}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Bound;
  exports.b2Bound = b2Bound = b2Bound = (function() {
    function b2Bound() {}
    b2Bound.prototype.IsLower = function() {
      return (this.value & 1) === 0;
    };
    b2Bound.prototype.IsUpper = function() {
      return (this.value & 1) === 1;
    };
    b2Bound.prototype.Swap = function(b) {
      var tempProxyId, tempStabbingCount, tempValue;
      tempValue = this.value;
      tempProxyId = this.proxyId;
      tempStabbingCount = this.stabbingCount;
      this.value = b.value;
      this.proxyId = b.proxyId;
      this.stabbingCount = b.stabbingCount;
      b.value = tempValue;
      b.proxyId = tempProxyId;
      return b.stabbingCount = tempStabbingCount;
    };
    b2Bound.prototype.value = 0;
    b2Bound.prototype.proxyId = 0;
    b2Bound.prototype.stabbingCount = 0;
    return b2Bound;
  })();
  /*
  var b2Bound = Class.create()
  b2Bound.prototype = {
  	IsLower: function(){ return (@value & 1) == 0 },
  	IsUpper: function(){ return (@value & 1) == 1 },
  	Swap: function(b){
  		var tempValue = @value
  		var tempProxyId = @proxyId
  		var tempStabbingCount = @stabbingCount
  
  		@value = b.value
  		@proxyId = b.proxyId
  		@stabbingCount = b.stabbingCount
  
  		b.value = tempValue
  		b.proxyId = tempProxyId
  		b.stabbingCount = tempStabbingCount
  	},
  
  	value: 0,
  	proxyId: 0,
  	stabbingCount: 0,
  
  	initialize: function() {}}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Proxy;
  exports.b2Proxy = b2Proxy = b2Proxy = (function() {
    function b2Proxy() {
      this.lowerBounds = [0., 0.];
      this.upperBounds = [0., 0.];
    }
    b2Proxy.prototype.GetNext = function() {
      return this.lowerBounds[0];
    };
    b2Proxy.prototype.SetNext = function(next) {
      return this.lowerBounds[0] = next;
    };
    b2Proxy.prototype.IsValid = function() {
      return this.overlapCount !== b2BroadPhase.b2_invalid;
    };
    b2Proxy.prototype.lowerBounds = [0., 0.];
    b2Proxy.prototype.upperBounds = [0., 0.];
    b2Proxy.prototype.overlapCount = 0;
    b2Proxy.prototype.timeStamp = 0;
    b2Proxy.prototype.userData = null;
    return b2Proxy;
  })();
  /*
  var b2Proxy = Class.create()
  b2Proxy.prototype = {
  	GetNext: function(){ return @lowerBounds[0] },
  	SetNext: function(next) { @lowerBounds[0] = next },
  
  	IsValid: function(){ return @overlapCount != b2BroadPhase.b2_invalid },
  
  	lowerBounds: [(0), (0)],
  	upperBounds: [(0), (0)],
  	overlapCount: 0,
  	timeStamp: 0,
  
  	userData: null,
  
  	initialize: function() {
  		// initialize instance variables for references
  		@lowerBounds = [(0), (0)]
  		@upperBounds = [0), (0)]
  		//
  }}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Pair;
  exports.b2Pair = b2Pair = b2Pair = (function() {
    function b2Pair() {}
    b2Pair.prototype.SetBuffered = function() {
      return this.status |= b2Pair.e_pairBuffered;
    };
    b2Pair.prototype.ClearBuffered = function() {
      return this.status &= ~b2Pair.e_pairBuffered;
    };
    b2Pair.prototype.IsBuffered = function() {
      return (this.status & b2Pair.e_pairBuffered) === b2Pair.e_pairBuffered;
    };
    b2Pair.prototype.SetRemoved = function() {
      return this.status |= b2Pair.e_pairRemoved;
    };
    b2Pair.prototype.ClearRemoved = function() {
      return this.status &= ~b2Pair.e_pairRemoved;
    };
    b2Pair.prototype.IsRemoved = function() {
      return (this.status & b2Pair.e_pairRemoved) === b2Pair.e_pairRemoved;
    };
    b2Pair.prototype.SetFinal = function() {
      return this.status |= b2Pair.e_pairFinal;
    };
    b2Pair.prototype.IsFinal = function() {
      return (this.status & b2Pair.e_pairFinal) === b2Pair.e_pairFinal;
    };
    b2Pair.prototype.userData = null;
    b2Pair.prototype.proxyId1 = 0;
    b2Pair.prototype.proxyId2 = 0;
    b2Pair.prototype.next = 0;
    b2Pair.prototype.status = 0;
    return b2Pair;
  })();
  b2Pair.b2_nullPair = b2Settings.USHRT_MAX;
  b2Pair.b2_nullProxy = b2Settings.USHRT_MAX;
  b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs;
  b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1;
  b2Pair.e_pairBuffered = 0x0001;
  b2Pair.e_pairRemoved = 0x0002;
  b2Pair.e_pairFinal = 0x0004;
  /*
  var b2Pair = Class.create()
  b2Pair.prototype = 
  {
  
  
  	SetBuffered: function()	{ @status |= b2Pair.e_pairBuffered },
  	ClearBuffered: function()	{ @status &= ~b2Pair.e_pairBuffered },
  	IsBuffered: function(){ return (@status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered },
  
  	SetRemoved: function()		{ @status |= b2Pair.e_pairRemoved },
  	ClearRemoved: function()	{ @status &= ~b2Pair.e_pairRemoved },
  	IsRemoved: function(){ return (@status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved },
  
  	SetFinal: function()		{ @status |= b2Pair.e_pairFinal },
  	IsFinal: function(){ return (@status & b2Pair.e_pairFinal) == b2Pair.e_pairFinal },
  
  	userData: null,
  	proxyId1: 0,
  	proxyId2: 0,
  	next: 0,
  	status: 0,
  
  	// STATIC
  
  	// enum
  
  	initialize: function() {}}
  b2Pair.b2_nullPair = b2Settings.USHRT_MAX
  b2Pair.b2_nullProxy = b2Settings.USHRT_MAX
  b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs
  b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1
  b2Pair.e_pairBuffered = 0x0001
  b2Pair.e_pairRemoved = 0x0002
  b2Pair.e_pairFinal = 0x0004*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2PairManager;
  exports.b2PairManager = b2PairManager = b2PairManager = (function() {
    function b2PairManager() {
      var i, _ref, _ref2, _ref3, _ref4;
      this.m_hashTable = new Array(b2Pair.b2_tableCapacity);
      for (i = 0, _ref = b2Pair.b2_tableCapacity; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.m_hashTable[i] = b2Pair.b2_nullPair;
      }
      this.m_pairs = new Array(b2Settings.b2_maxPairs);
      for (i = 0, _ref2 = b2Settings.b2_maxPairs; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        this.m_pairs[i] = new b2Pair();
      }
      this.m_pairBuffer = new Array(b2Settings.b2_maxPairs);
      for (i = 0, _ref3 = b2Settings.b2_maxPairs; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
        this.m_pairBuffer[i] = new b2BufferedPair();
      }
      for (i = 0, _ref4 = b2Settings.b2_maxPairs; 0 <= _ref4 ? i < _ref4 : i > _ref4; 0 <= _ref4 ? i++ : i--) {
        this.m_pairs[i].proxyId1 = b2Pair.b2_nullProxy;
        this.m_pairs[i].proxyId2 = b2Pair.b2_nullProxy;
        this.m_pairs[i].userData = null;
        this.m_pairs[i].status = 0;
        this.m_pairs[i].next = i + 1;
      }
      this.m_pairs[b2Settings.b2_maxPairs - 1].next = b2Pair.b2_nullPair;
      this.m_pairCount = 0;
    }
    b2PairManager.prototype.Initialize = function(broadPhase, callback) {
      this.m_broadPhase = broadPhase;
      return this.m_callback = callback;
    };
    b2PairManager.prototype.AddBufferedPair = function(proxyId1, proxyId2) {
      var pair;
      pair = this.AddPair(proxyId1, proxyId2);
      if (pair.IsBuffered() === false) {
        pair.SetBuffered();
        this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = pair.proxyId1;
        this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = pair.proxyId2;
        ++this.m_pairBufferCount;
      }
      pair.ClearRemoved();
      if (b2BroadPhase.s_validate) {
        return this.ValidateBuffer();
      }
    };
    b2PairManager.prototype.Commit = function() {
      var i, pair, proxies, proxy1, proxy2, removeCount, _ref;
      removeCount = 0;
      proxies = this.m_broadPhase.m_proxyPool;
      for (i = 0, _ref = this.m_pairBufferCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        pair = this.Find(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
        pair.ClearBuffered();
        proxy1 = proxies[pair.proxyId1];
        proxy2 = proxies[pair.proxyId2];
        if (pair.IsRemoved()) {
          if (pair.IsFinal() === true) {
            this.m_callback.PairRemoved(proxy1.userData, proxy2.userData, pair.userData);
          }
          this.m_pairBuffer[removeCount].proxyId1 = pair.proxyId1;
          this.m_pairBuffer[removeCount].proxyId2 = pair.proxyId2;
          ++removeCount;
        } else {
          if (pair.IsFinal() === false) {
            pair.userData = this.m_callback.PairAdded(proxy1.userData, proxy2.userData);
            pair.SetFinal();
          }
        }
      }
      for (i = 0; 0 <= removeCount ? i < removeCount : i > removeCount; 0 <= removeCount ? i++ : i--) {
        this.RemovePair(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
      }
      this.m_pairBufferCount = 0;
      if (b2BroadPhase.s_validate) {
        return this.ValidateTable();
      }
    };
    return b2PairManager;
  })();
  /*
  var b2PairManager = Class.create()
  b2PairManager.prototype = 
  {
  //public:
  	initialize: function(){
  		var i = 0
  		//b2Settings.b2Assert(b2Math.b2IsPowerOfTwo(b2Pair.b2_tableCapacity) == true)
  		//b2Settings.b2Assert(b2Pair.b2_tableCapacity >= b2Settings.b2_maxPairs)
  		@m_hashTable = new Array(b2Pair.b2_tableCapacity)
  		for (i = 0 i < b2Pair.b2_tableCapacity ++i)
  		{
  			@m_hashTable[i] = b2Pair.b2_nullPair
  		}
  		@m_pairs = new Array(b2Settings.b2_maxPairs)
  		for (i = 0 i < b2Settings.b2_maxPairs ++i)
  		{
  			@m_pairs[i] = new b2Pair()
  		}
  		@m_pairBuffer = new Array(b2Settings.b2_maxPairs)
  		for (i = 0 i < b2Settings.b2_maxPairs ++i)
  		{
  			@m_pairBuffer[i] = new b2BufferedPair()
  		}
  
  		for (i = 0 i < b2Settings.b2_maxPairs ++i)
  		{
  			@m_pairs[i].proxyId1 = b2Pair.b2_nullProxy
  			@m_pairs[i].proxyId2 = b2Pair.b2_nullProxy
  			@m_pairs[i].userData = null
  			@m_pairs[i].status = 0
  			@m_pairs[i].next = (i + 1)
  		}
  		@m_pairs[b2Settings.b2_maxPairs-1].next = b2Pair.b2_nullPair
  		@m_pairCount = 0
  	},
  	//~b2PairManager()
  
  	Initialize: function(broadPhase, callback){
  		@m_broadPhase = broadPhase
  		@m_callback = callback
  	},
  
  	AddBufferedPair: function(proxyId1, proxyId2){
  		//b2Settings.b2Assert(id1 != b2_nullProxy && id2 != b2_nullProxy)
  		//b2Settings.b2Assert(@m_pairBufferCount < b2_maxPairs)
  
  		var pair = @AddPair(proxyId1, proxyId2)
  
  		// If @ pair is not in the pair buffer ...
  		if (pair.IsBuffered() == false)
  		{
  			// @ must be a newly added pair.
  			//b2Settings.b2Assert(pair.IsFinal() == false)
  
  			// Add it to the pair buffer.
  			pair.SetBuffered()
  			@m_pairBuffer[@m_pairBufferCount].proxyId1 = pair.proxyId1
  			@m_pairBuffer[@m_pairBufferCount].proxyId2 = pair.proxyId2
  			++@m_pairBufferCount
  
  			//b2Settings.b2Assert(@m_pairBufferCount <= @m_pairCount)
  		}
  
  		// Confirm @ pair for the subsequent call to @Commit.
  		pair.ClearRemoved()
  
  		if (b2BroadPhase.s_validate)
  		{
  			@ValidateBuffer()
  		}
  	},
  
  	// Buffer a pair for removal.
  	RemoveBufferedPair: function(proxyId1, proxyId2){
  		//b2Settings.b2Assert(id1 != b2_nullProxy && id2 != b2_nullProxy)
  		//b2Settings.b2Assert(@m_pairBufferCount < b2_maxPairs)
  
  		var pair = @Find(proxyId1, proxyId2)
  
  		if (pair == null)
  		{
  			// The pair never existed. @ is legal (due to collision filtering).
  			return
  		}
  
  		// If @ pair is not in the pair buffer ...
  		if (pair.IsBuffered() == false)
  		{
  			// @ must be an old pair.
  			//b2Settings.b2Assert(pair.IsFinal() == true)
  
  			pair.SetBuffered()
  			@m_pairBuffer[@m_pairBufferCount].proxyId1 = pair.proxyId1
  			@m_pairBuffer[@m_pairBufferCount].proxyId2 = pair.proxyId2
  			++@m_pairBufferCount
  
  			//b2Settings.b2Assert(@m_pairBufferCount <= @m_pairCount)
  		}
  
  		pair.SetRemoved()
  
  		if (b2BroadPhase.s_validate)
  		{
  			@ValidateBuffer()
  		}
  	},
  
  	Commit: function(){
  		var i = 0
  
  		var removeCount = 0
  
  		var proxies = @m_broadPhase.m_proxyPool
  
  		for (i = 0 i < @m_pairBufferCount ++i)
  		{
  			var pair = @Find(@m_pairBuffer[i].proxyId1, @m_pairBuffer[i].proxyId2)
  			//b2Settings.b2Assert(pair.IsBuffered())
  			pair.ClearBuffered()
  
  			//b2Settings.b2Assert(pair.proxyId1 < b2Settings.b2_maxProxies && pair.proxyId2 < b2Settings.b2_maxProxies)
  
  			var proxy1 = proxies[ pair.proxyId1 ]
  			var proxy2 = proxies[ pair.proxyId2 ]
  
  			//b2Settings.b2Assert(proxy1.IsValid())
  			//b2Settings.b2Assert(proxy2.IsValid())
  
  			if (pair.IsRemoved())
  			{
  				// It is possible a pair was added then removed before a commit. Therefore,
  				// we should be careful not to tell the user the pair was removed when the
  				// the user didn't receive a matching add.
  				if (pair.IsFinal() == true)
  				{
  					@m_callback.PairRemoved(proxy1.userData, proxy2.userData, pair.userData)
  				}
  
  				// Store the ids so we can actually remove the pair below.
  				@m_pairBuffer[removeCount].proxyId1 = pair.proxyId1
  				@m_pairBuffer[removeCount].proxyId2 = pair.proxyId2
  				++removeCount
  			}
  			else
  			{
  				//b2Settings.b2Assert(@m_broadPhase.TestOverlap(proxy1, proxy2) == true)
  
  				if (pair.IsFinal() == false)
  				{
  					pair.userData = @m_callback.PairAdded(proxy1.userData, proxy2.userData)
  					pair.SetFinal()
  				}
  			}
  		}
  
  		for (i = 0 i < removeCount ++i)
  		{
  			@RemovePair(@m_pairBuffer[i].proxyId1, @m_pairBuffer[i].proxyId2)
  		}
  
  		@m_pairBufferCount = 0
  
  		if (b2BroadPhase.s_validate)
  		{
  			@ValidateTable()
  		}
  	},
  
  //private:
  
  	// Add a pair and return the new pair. If the pair already exists,
  	// no new pair is created and the old one is returned.
  	AddPair: function(proxyId1, proxyId2){
  
  		if (proxyId1 > proxyId2){
  			var temp = proxyId1
  			proxyId1 = proxyId2
  			proxyId2 = temp
  			//b2Math.b2Swap(p1, p2)
  		}
  
  		var hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask
  
  		//var pairIndex = @FindHash(proxyId1, proxyId2, hash)
  		var pair = pair = @FindHash(proxyId1, proxyId2, hash)
  
  		if (pair != null)
  		{
  			return pair
  		}
  
  		//b2Settings.b2Assert(@m_pairCount < b2Settings.b2_maxPairs && @m_freePair != b2_nullPair)
  
  		var pIndex = @m_freePair
  		pair = @m_pairs[pIndex]
  		@m_freePair = pair.next
  
  		pair.proxyId1 = proxyId1
  		pair.proxyId2 = proxyId2
  		pair.status = 0
  		pair.userData = null
  		pair.next = @m_hashTable[hash]
  
  		@m_hashTable[hash] = pIndex
  
  		++@m_pairCount
  
  		return pair
  	},
  
  	// Remove a pair, return the pair's userData.
  	RemovePair: function(proxyId1, proxyId2){
  
  		//b2Settings.b2Assert(@m_pairCount > 0)
  
  		if (proxyId1 > proxyId2){
  			var temp = proxyId1
  			proxyId1 = proxyId2
  			proxyId2 = temp
  			//b2Math.b2Swap(proxyId1, proxyId2)
  		}
  
  		var hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask
  
  		var node = @m_hashTable[hash]
  		var pNode = null
  
  		while (node != b2Pair.b2_nullPair)
  		{
  			if (b2PairManager.Equals(@m_pairs[node], proxyId1, proxyId2))
  			{
  				var index = node
  
  				//*node = @m_pairs[*node].next
  				if (pNode){
  					pNode.next = @m_pairs[node].next
  				}
  				else{
  					@m_hashTable[hash] = @m_pairs[node].next
  				}
  
  				var pair = @m_pairs[ index ]
  				var userData = pair.userData
  
  				// Scrub
  				pair.next = @m_freePair
  				pair.proxyId1 = b2Pair.b2_nullProxy
  				pair.proxyId2 = b2Pair.b2_nullProxy
  				pair.userData = null
  				pair.status = 0
  
  				@m_freePair = index
  				--@m_pairCount
  				return userData
  			}
  			else
  			{
  				//node = &@m_pairs[*node].next
  				pNode = @m_pairs[node]
  				node = pNode.next
  			}
  		}
  
  		//b2Settings.b2Assert(false)
  		return null
  	},
  
  	Find: function(proxyId1, proxyId2){
  
  		if (proxyId1 > proxyId2){
  			var temp = proxyId1
  			proxyId1 = proxyId2
  			proxyId2 = temp
  			//b2Math.b2Swap(proxyId1, proxyId2)
  		}
  
  		var hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask
  
  		return @FindHash(proxyId1, proxyId2, hash)
  	},
  	FindHash: function(proxyId1, proxyId2, hash){
  		var index = @m_hashTable[hash]
  
  		while( index != b2Pair.b2_nullPair && b2PairManager.Equals(@m_pairs[index], proxyId1, proxyId2) == false)
  		{
  			index = @m_pairs[index].next
  		}
  
  		if ( index == b2Pair.b2_nullPair )
  		{
  			return null
  		}
  
  		//b2Settings.b2Assert(index < b2_maxPairs)
  
  		return @m_pairs[ index ]
  	},
  
  	ValidateBuffer: function(){
  		// DEBUG
  	},
  
  	ValidateTable: function(){
  		// DEBUG
  	},
  
  //public:
  	m_broadPhase: null,
  	m_callback: null,
  	m_pairs: null,
  	m_freePair: 0,
  	m_pairCount: 0,
  
  	m_pairBuffer: null,
  	m_pairBufferCount: 0,
  
  	m_hashTable: null
  
  
  // static
  	// Thomas Wang's hash, see: http:
  
  
  
  }
  b2PairManager.Hash = function(proxyId1, proxyId2)
  	{
  		var key = ((proxyId2 << 16) & 0xffff0000) | proxyId1
  		key = ~key + ((key << 15) & 0xFFFF8000)
  		key = key ^ ((key >> 12) & 0x000fffff)
  		key = key + ((key << 2) & 0xFFFFFFFC)
  		key = key ^ ((key >> 4) & 0x0fffffff)
  		key = key * 2057
  		key = key ^ ((key >> 16) & 0x0000ffff)
  		return key
  	}
  b2PairManager.Equals = function(pair, proxyId1, proxyId2)
  	{
  		return (pair.proxyId1 == proxyId1 && pair.proxyId2 == proxyId2)
  	}
  b2PairManager.EqualsPair = function(pair1, pair2)
  	{
  		return pair1.proxyId1 == pair2.proxyId1 && pair1.proxyId2 == pair2.proxyId2
  	}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2PairCallback;
  exports.b2PairCallback = b2PairCallback = b2PairCallback = (function() {
    function b2PairCallback() {}
    b2PairCallback.prototype.PairAdded = function(proxyUserData1, proxyUserData2) {
      return null;
    };
    b2PairCallback.prototype.PairRemoved = function(proxyUserData1, proxyUserData2, pairUserData) {};
    return b2PairCallback;
  })();
  /*
  var b2PairCallback = Class.create();
  b2PairCallback.prototype = 
  {
  	//virtual ~b2PairCallback() {}
  
  	// This returns the new pair user data.
  	PairAdded: function(proxyUserData1, proxyUserData2){return null},
  
  	// This should free the pair's user data. In extreme circumstances, it is possible
  	// this will be called with null pairUserData because the pair never existed.
  	PairRemoved: function(proxyUserData1, proxyUserData2, pairUserData){},
  	initialize: function() {}};*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2BufferedPair;
  exports.b2BufferedPair = b2BufferedPair = b2BufferedPair = (function() {
    function b2BufferedPair() {}
    b2BufferedPair.prototype.proxyId1 = 0;
    b2BufferedPair.prototype.proxyId2 = 0;
    return b2BufferedPair;
  })();
  /*
  var b2BufferedPair = Class.create();
  b2BufferedPair.prototype = {
  	proxyId1: 0,
  	proxyId2: 0,
  
  	initialize: function() {}}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2ContactNode;
  exports.b2ContactNode = b2ContactNode = b2ContactNode = (function() {
    function b2ContactNode() {}
    b2ContactNode.prototype.other = null;
    b2ContactNode.prototype.contact = null;
    b2ContactNode.prototype.prev = null;
    b2ContactNode.prototype.next = null;
    return b2ContactNode;
  })();
  /*
  var b2ContactNode = Class.create();
  b2ContactNode.prototype = 
  {
  	other: null,
  	contact: null,
  	prev: null,
  	next: null,
  	initialize: function() {}};*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. this notice may not be removed or altered from any source distribution.
  */
  var b2Contact;
  exports.b2Contact = b2Contact = b2Contact = (function() {
    function b2Contact(s1, s2) {
      this.m_node1 = new b2ContactNode();
      this.m_node2 = new b2ContactNode();
      this.m_flags = 0;
      if (!s1 || !s2) {
        this.m_shape1 = null;
        this.m_shape2 = null;
        return;
      }
      this.m_shape1 = s1;
      this.m_shape2 = s2;
      this.m_manifoldCount = 0;
      this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
      this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution);
      this.m_prev = null;
      this.m_next = null;
      this.m_node1.contact = null;
      this.m_node1.prev = null;
      this.m_node1.next = null;
      this.m_node1.other = null;
      this.m_node2.contact = null;
      this.m_node2.prev = null;
      this.m_node2.next = null;
      this.m_node2.other = null;
    }
    b2Contact.prototype.GetManifolds = function() {
      return null;
    };
    b2Contact.prototype.GetManifoldCount = function() {
      return this.m_manifoldCount;
    };
    b2Contact.prototype.GetNext = function() {
      return this.m_next;
    };
    b2Contact.prototype.GetShape1 = function() {
      return this.m_shape1;
    };
    b2Contact.prototype.GetShape2 = function() {
      return this.m_shape2;
    };
    b2Contact.prototype.Evaluate = function() {};
    b2Contact.prototype.m_flags = 0;
    b2Contact.prototype.m_prev = null;
    b2Contact.prototype.m_next = null;
    b2Contact.prototype.m_node1 = new b2ContactNode();
    b2Contact.prototype.m_node2 = new b2ContactNode();
    b2Contact.prototype.m_shape1 = null;
    b2Contact.prototype.m_shape2 = null;
    b2Contact.prototype.m_manifoldCount = 0;
    b2Contact.prototype.m_friction = null;
    b2Contact.prototype.m_restitution = null;
    return b2Contact;
  })();
  b2Contact.e_islandFlag = 0x0001;
  b2Contact.e_destroyFlag = 0x0002;
  b2Contact.AddType = function(createFcn, destroyFcn, type1, type2) {
    b2Contact.s_registers[type1][type2].createFcn = createFcn;
    b2Contact.s_registers[type1][type2].destroyFcn = destroyFcn;
    b2Contact.s_registers[type1][type2].primary = true;
    if (type1 !== type2) {
      b2Contact.s_registers[type2][type1].createFcn = createFcn;
      b2Contact.s_registers[type2][type1].destroyFcn = destroyFcn;
      return b2Contact.s_registers[type2][type1].primary = false;
    }
  };
  b2Contact.InitializeRegisters = function() {
    var i, j, _ref, _ref2;
    b2Contact.s_registers = new Array(b2Shape.e_shapeTypeCount);
    for (i = 0, _ref = b2Shape.e_shapeTypeCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      b2Contact.s_registers[i] = new Array(b2Shape.e_shapeTypeCount);
      for (j = 0, _ref2 = b2Shape.e_shapeTypeCount; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
        b2Contact.s_registers[i][j] = new b2ContactRegister();
      }
    }
    b2Contact.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
    b2Contact.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polyShape, b2Shape.e_circleShape);
    return b2Contact.AddType(b2PolyContact.Create, b2PolyContact.Destroy, b2Shape.e_polyShape, b2Shape.e_polyShape);
  };
  b2Contact.Create = function(shape1, shape2, allocator) {
    var c, createFcn, i, m, type1, type2, _ref;
    if (b2Contact.s_initialized === false) {
      b2Contact.InitializeRegisters();
      b2Contact.s_initialized = true;
    }
    type1 = shape1.m_type;
    type2 = shape2.m_type;
    createFcn = b2Contact.s_registers[type1][type2].createFcn;
    if (createFcn) {
      if (b2Contact.s_registers[type1][type2].primary) {
        return createFcn(shape1, shape2, allocator);
      } else {
        c = createFcn(shape2, shape1, allocator);
        for (i = 0, _ref = c.GetManifoldCount(); 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          m = c.GetManifolds()[i];
          m.normal = m.normal.Negative();
        }
        return c;
      }
    } else {
      return null;
    }
  };
  b2Contact.Destroy = function(contact, allocator) {
    var destroyFcn, type1, type2;
    if (contact.GetManifoldCount() > 0) {
      contact.m_shape1.m_body.WakeUp();
      contact.m_shape2.m_body.WakeUp();
    }
    type1 = contact.m_shape1.m_type;
    type2 = contact.m_shape2.m_type;
    destroyFcn = b2Contact.s_registers[type1][type2].destroyFcn;
    return destroyFcn(contact, allocator);
  };
  b2Contact.s_registers = null;
  b2Contact.s_initialized = false;
  /*
  var b2Contact = Class.create()
  b2Contact.prototype = 
  {
  	GetManifolds: function(){return null},
  	GetManifoldCount: function()
  	{
  		return @m_manifoldCount
  	},
  
  	GetNext: function(){
  		return @m_next
  	},
  
  	GetShape1: function(){
  		return @m_shape1
  	},
  
  	GetShape2: function(){
  		return @m_shape2
  	},
  
  	//--------------- Internals Below -------------------
  
  	// @m_flags
  	// enum
  
  
  	initialize: function(s1, s2)
  	{
  		// initialize instance variables for references
  		@m_node1 = new b2ContactNode()
  		@m_node2 = new b2ContactNode()
  		//
  
  		@m_flags = 0
  
  		if (!s1 || !s2){
  			@m_shape1 = null
  			@m_shape2 = null
  			return
  		}
  
  		@m_shape1 = s1
  		@m_shape2 = s2
  
  		@m_manifoldCount = 0
  
  		@m_friction = Math.sqrt(@m_shape1.m_friction * @m_shape2.m_friction)
  		@m_restitution = b2Math.b2Max(@m_shape1.m_restitution, @m_shape2.m_restitution)
  
  		@m_prev = null
  		@m_next = null
  
  		@m_node1.contact = null
  		@m_node1.prev = null
  		@m_node1.next = null
  		@m_node1.other = null
  
  		@m_node2.contact = null
  		@m_node2.prev = null
  		@m_node2.next = null
  		@m_node2.other = null
  	},
  
  	//virtual ~b2Contact() {}
  
  	Evaluate: function(){},
  
  	m_flags: 0,
  
  	// World pool and list pointers.
  	m_prev: null,
  	m_next: null,
  
  	// Nodes for connecting bodies.
  	m_node1: new b2ContactNode(),
  	m_node2: new b2ContactNode(),
  
  	m_shape1: null,
  	m_shape2: null,
  
  	m_manifoldCount: 0,
  
  	// Combined friction
  	m_friction: null,
  	m_restitution: null}
  b2Contact.e_islandFlag = 0x0001
  b2Contact.e_destroyFlag = 0x0002
  b2Contact.AddType = function(createFcn, destroyFcn, type1, type2)
  	{
  		//b2Settings.b2Assert(b2Shape.e_unknownShape < type1 && type1 < b2Shape.e_shapeTypeCount)
  		//b2Settings.b2Assert(b2Shape.e_unknownShape < type2 && type2 < b2Shape.e_shapeTypeCount)
  
  		b2Contact.s_registers[type1][type2].createFcn = createFcn
  		b2Contact.s_registers[type1][type2].destroyFcn = destroyFcn
  		b2Contact.s_registers[type1][type2].primary = true
  
  		if (type1 != type2)
  		{
  			b2Contact.s_registers[type2][type1].createFcn = createFcn
  			b2Contact.s_registers[type2][type1].destroyFcn = destroyFcn
  			b2Contact.s_registers[type2][type1].primary = false
  		}
  	}
  b2Contact.InitializeRegisters = function(){
  		b2Contact.s_registers = new Array(b2Shape.e_shapeTypeCount)
  		for (var i = 0 i < b2Shape.e_shapeTypeCount i++){
  			b2Contact.s_registers[i] = new Array(b2Shape.e_shapeTypeCount)
  			for (var j = 0 j < b2Shape.e_shapeTypeCount j++){
  				b2Contact.s_registers[i][j] = new b2ContactRegister()
  			}
  		}
  
  		b2Contact.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape)
  		b2Contact.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polyShape, b2Shape.e_circleShape)
  		b2Contact.AddType(b2PolyContact.Create, b2PolyContact.Destroy, b2Shape.e_polyShape, b2Shape.e_polyShape)
  
  	}
  b2Contact.Create = function(shape1, shape2, allocator){
  		if (b2Contact.s_initialized == false)
  		{
  			b2Contact.InitializeRegisters()
  			b2Contact.s_initialized = true
  		}
  
  		var type1 = shape1.m_type
  		var type2 = shape2.m_type
  
  		//b2Settings.b2Assert(b2Shape.e_unknownShape < type1 && type1 < b2Shape.e_shapeTypeCount)
  		//b2Settings.b2Assert(b2Shape.e_unknownShape < type2 && type2 < b2Shape.e_shapeTypeCount)
  
  		var createFcn = b2Contact.s_registers[type1][type2].createFcn
  		if (createFcn)
  		{
  			if (b2Contact.s_registers[type1][type2].primary)
  			{
  				return createFcn(shape1, shape2, allocator)
  			}
  			else
  			{
  				var c = createFcn(shape2, shape1, allocator)
  				for (var i = 0 i < c.GetManifoldCount() ++i)
  				{
  					var m = c.GetManifolds()[ i ]
  					m.normal = m.normal.Negative()
  				}
  				return c
  			}
  		}
  		else
  		{
  			return null
  		}
  	}
  b2Contact.Destroy = function(contact, allocator){
  		//b2Settings.b2Assert(b2Contact.s_initialized == true)
  
  		if (contact.GetManifoldCount() > 0)
  		{
  			contact.m_shape1.m_body.WakeUp()
  			contact.m_shape2.m_body.WakeUp()
  		}
  
  		var type1 = contact.m_shape1.m_type
  		var type2 = contact.m_shape2.m_type
  
  		//b2Settings.b2Assert(b2Shape.e_unknownShape < type1 && type1 < b2Shape.e_shapeTypeCount)
  		//b2Settings.b2Assert(b2Shape.e_unknownShape < type2 && type2 < b2Shape.e_shapeTypeCount)
  
  		var destroyFcn = b2Contact.s_registers[type1][type2].destroyFcn
  		destroyFcn(contact, allocator)
  	}
  b2Contact.s_registers = null
  b2Contact.s_initialized = false*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2NullContact;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2NullContact = b2NullContact = b2NullContact = (function() {
    __extends(b2NullContact, b2Contact);
    function b2NullContact(s1, s2) {
      this.m_node1 = new b2ContactNode();
      this.m_node2 = new b2ContactNode();
      this.m_flags = 0;
      if (!s1 || !s2) {
        this.m_shape1 = null;
        this.m_shape2 = null;
        return;
      }
      this.m_shape1 = s1;
      this.m_shape2 = s2;
      this.m_manifoldCount = 0;
      this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
      this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution);
      this.m_prev = null;
      this.m_next = null;
      this.m_node1.contact = null;
      this.m_node1.prev = null;
      this.m_node1.next = null;
      this.m_node1.other = null;
      this.m_node2.contact = null;
      this.m_node2.prev = null;
      this.m_node2.next = null;
      this.m_node2.other = null;
    }
    b2NullContact.prototype.Evaluate = function() {};
    b2NullContact.prototype.GetManifolds = function() {
      return null;
    };
    return b2NullContact;
  })();
  /*
  var b2NullContact = Class.create()
  Object.extend(b2NullContact.prototype, b2Contact.prototype)
  Object.extend(b2NullContact.prototype, 
  {
  		initialize: function(s1, s2) {
  		// The constructor for b2Contact
  		// initialize instance variables for references
  		@m_node1 = new b2ContactNode()
  		@m_node2 = new b2ContactNode()
  		//
  		@m_flags = 0
  
  		if (!s1 || !s2){
  			@m_shape1 = null
  			@m_shape2 = null
  			return
  		}
  
  		@m_shape1 = s1
  		@m_shape2 = s2
  
  		@m_manifoldCount = 0
  
  		@m_friction = Math.sqrt(@m_shape1.m_friction * @m_shape2.m_friction)
  		@m_restitution = b2Math.b2Max(@m_shape1.m_restitution, @m_shape2.m_restitution)
  
  		@m_prev = null
  		@m_next = null
  
  		@m_node1.contact = null
  		@m_node1.prev = null
  		@m_node1.next = null
  		@m_node1.other = null
  
  		@m_node2.contact = null
  		@m_node2.prev = null
  		@m_node2.next = null
  		@m_node2.other = null
  		//
  },
  	Evaluate: function() {},
  	GetManifolds: function(){ return null }})*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  @ software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of @ software.
  Permission is granted to anyone to use @ software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of @ software must not be misrepresented you must not
  claim that you wrote the original software. If you use @ software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. @ notice may not be removed or altered from any source distribution.
  */
  var b2ContactManager;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2ContactManager = b2ContactManager = b2ContactManager = (function() {
    __extends(b2ContactManager, b2PairCallback);
    function b2ContactManager() {
      this.m_nullContact = new b2NullContact();
      this.m_world = null;
      this.m_destroyImmediate = false;
    }
    b2ContactManager.prototype.PairAdded = function(proxyUserData1, proxyUserData2) {
      var body1, body2, contact, shape1, shape2, tempBody, tempShape;
      shape1 = proxyUserData1;
      shape2 = proxyUserData2;
      body1 = shape1.m_body;
      body2 = shape2.m_body;
      if (body1.IsStatic() && body2.IsStatic()) {
        return this.m_nullContact;
      }
      if (shape1.m_body === shape2.m_body) {
        return this.m_nullContact;
      }
      if (body2.IsConnected(body1)) {
        return this.m_nullContact;
      }
      if (this.m_world.m_filter !== null && this.m_world.m_filter.ShouldCollide(shape1, shape2) === false) {
        return this.m_nullContact;
      }
      if (body2.m_invMass === 0.0) {
        tempShape = shape1;
        shape1 = shape2;
        shape2 = tempShape;
        tempBody = body1;
        body1 = body2;
        body2 = tempBody;
      }
      contact = b2Contact.Create(shape1, shape2, this.m_world.m_blockAllocator);
      if (!(contact != null)) {
        return this.m_nullContact;
      } else {
        contact.m_prev = null;
        contact.m_next = this.m_world.m_contactList;
        if (this.m_world.m_contactList !== null) {
          this.m_world.m_contactList.m_prev = contact;
        }
        this.m_world.m_contactList = contact;
        this.m_world.m_contactCount++;
      }
      return contact;
    };
    b2ContactManager.prototype.CleanContactList = function() {
      var c, c0, _results;
      c = this.m_world.m_contactList;
      _results = [];
      while (c != null) {
        c0 = c;
        c = c.m_next;
        _results.push(c0.m_flags & b2Contact.e_destroyFlag ? (this.DestroyContact(c0), c0 = null) : void 0);
      }
      return _results;
    };
    b2ContactManager.prototype.Collide = function() {
      var body1, body2, c, newCount, node1, node2, oldCount, _results;
      c = this.m_world.m_contactList;
      _results = [];
      while (c != null) {
        if (!(c.m_shape1.m_body.IsSleeping() && c.m_shape2.m_body.IsSleeping())) {
          oldCount = c.GetManifoldCount();
          c.Evaluate();
          newCount = c.GetManifoldCount();
          if (oldCount === 0 && newCount > 0) {
            body1 = c.m_shape1.m_body;
            body2 = c.m_shape2.m_body;
            node1 = c.m_node1;
            node2 = c.m_node2;
            node1.contact = c;
            node1.other = body2;
            node1.prev = null;
            node1.next = body1.m_contactList;
            if (node1.next !== null) {
              node1.next.prev = c.m_node1;
            }
            body1.m_contactList = c.m_node1;
            node2.contact = c;
            node2.other = body1;
            node2.prev = null;
            node2.next = body2.m_contactList;
            if (node2.next !== null) {
              node2.next.prev = node2;
            }
            body2.m_contactList = node2;
          } else if (oldCount > 0 && newCount === 0) {
            body1 = c.m_shape1.m_body;
            body2 = c.m_shape2.m_body;
            node1 = c.m_node1;
            node2 = c.m_node2;
            if (node1.prev) {
              node1.prev.next = node1.next;
            }
            if (node1.next) {
              node1.next.prev = node1.prev;
            }
            if (node1 === body1.m_contactList) {
              body1.m_contactList = node1.next;
            }
            node1.prev = null;
            node1.next = null;
            if (node2.prev) {
              node2.prev.next = node2.next;
            }
            if (node2.next) {
              node2.next.prev = node2.prev;
            }
            if (node2 === body2.m_contactList) {
              body2.m_contactList = node2.next;
            }
            node2.prev = null;
            node2.next = null;
          }
        }
        _results.push(c = c.m_next);
      }
      return _results;
    };
    b2ContactManager.prototype.m_world = null;
    b2ContactManager.prototype.m_nullContact = new b2NullContact();
    b2ContactManager.prototype.m_destroyImmediate = null;
    return b2ContactManager;
  })();
  /*
  var b2ContactManager = Class.create()
  Object.extend(b2ContactManager.prototype, b2PairCallback.prototype)
  Object.extend(b2ContactManager.prototype, 
  {
  	initialize: function(){
  		// The constructor for b2PairCallback
  		//
  
  		// initialize instance variables for references
  		@m_nullContact = new b2NullContact()
  		//
  
  		@m_world = null
  		@m_destroyImmediate = false
  	},
  
  	// @ is a callback from the broadphase when two AABB proxies begin
  	// to overlap. We create a b2Contact to manage the narrow phase.
  	PairAdded: function(proxyUserData1, proxyUserData2){
  		var shape1 = proxyUserData1
  		var shape2 = proxyUserData2
  
  		var body1 = shape1.m_body
  		var body2 = shape2.m_body
  
  		if (body1.IsStatic() && body2.IsStatic())
  		{
  			return @m_nullContact
  		}
  
  		if (shape1.m_body == shape2.m_body)
  		{
  			return @m_nullContact
  		}
  
  		if (body2.IsConnected(body1))
  		{
  			return @m_nullContact
  		}
  
  		if (@m_world.m_filter != null && @m_world.m_filter.ShouldCollide(shape1, shape2) == false)
  		{
  			return @m_nullContact
  		}
  
  		// Ensure that body2 is dynamic (body1 is static or dynamic).
  		if (body2.m_invMass == 0.0)
  		{
  			var tempShape = shape1
  			shape1 = shape2
  			shape2 = tempShape
  			//b2Math.b2Swap(shape1, shape2)
  			var tempBody = body1
  			body1 = body2
  			body2 = tempBody
  			//b2Math.b2Swap(body1, body2)
  		}
  
  		// Call the factory.
  		var contact = b2Contact.Create(shape1, shape2, @m_world.m_blockAllocator)
  
  		if (contact == null)
  		{
  			return @m_nullContact
  		}
  		else
  		{
  			// Insert into the world.
  			contact.m_prev = null
  			contact.m_next = @m_world.m_contactList
  			if (@m_world.m_contactList != null)
  			{
  				@m_world.m_contactList.m_prev = contact
  			}
  			@m_world.m_contactList = contact
  			@m_world.m_contactCount++
  		}
  
  		return contact
  	},
  
  	// @ is a callback from the broadphase when two AABB proxies cease
  	// to overlap. We destroy the b2Contact.
  	PairRemoved: function(proxyUserData1, proxyUserData2, pairUserData){
  
  		if (pairUserData == null)
  		{
  			return
  		}
  
  		var c = pairUserData
  		if (c != @m_nullContact)
  		{
  			//b2Settings.b2Assert(@m_world.m_contactCount > 0)
  			if (@m_destroyImmediate == true)
  			{
  				@DestroyContact(c)
  				c = null
  			}
  			else
  			{
  				c.m_flags |= b2Contact.e_destroyFlag
  			}
  		}
  	},
  
  	DestroyContact: function(c)
  	{
  
  		//b2Settings.b2Assert(@m_world.m_contactCount > 0)
  
  		// Remove from the world.
  		if (c.m_prev)
  		{
  			c.m_prev.m_next = c.m_next
  		}
  
  		if (c.m_next)
  		{
  			c.m_next.m_prev = c.m_prev
  		}
  
  		if (c == @m_world.m_contactList)
  		{
  			@m_world.m_contactList = c.m_next
  		}
  
  		// If there are contact points, then disconnect from the island graph.
  		if (c.GetManifoldCount() > 0)
  		{
  			var body1 = c.m_shape1.m_body
  			var body2 = c.m_shape2.m_body
  			var node1 = c.m_node1
  			var node2 = c.m_node2
  
  			// Wake up touching bodies.
  			body1.WakeUp()
  			body2.WakeUp()
  
  			// Remove from body 1
  			if (node1.prev)
  			{
  				node1.prev.next = node1.next
  			}
  
  			if (node1.next)
  			{
  				node1.next.prev = node1.prev
  			}
  
  			if (node1 == body1.m_contactList)
  			{
  				body1.m_contactList = node1.next
  			}
  
  			node1.prev = null
  			node1.next = null
  
  			// Remove from body 2
  			if (node2.prev)
  			{
  				node2.prev.next = node2.next
  			}
  
  			if (node2.next)
  			{
  				node2.next.prev = node2.prev
  			}
  
  			if (node2 == body2.m_contactList)
  			{
  				body2.m_contactList = node2.next
  			}
  
  			node2.prev = null
  			node2.next = null
  		}
  
  		// Call the factory.
  		b2Contact.Destroy(c, @m_world.m_blockAllocator)
  		--@m_world.m_contactCount
  	},
  
  
  	// Destroy any contacts marked for deferred destruction.
  	CleanContactList: function()
  	{
  		var c = @m_world.m_contactList
  		while (c != null)
  		{
  			var c0 = c
  			c = c.m_next
  
  			if (c0.m_flags & b2Contact.e_destroyFlag)
  			{
  				@DestroyContact(c0)
  				c0 = null
  			}
  		}
  	},
  
  
  	// @ is the top level collision call for the time step. Here
  	// all the narrow phase collision is processed for the world
  	// contact list.
  	Collide: function()
  	{
  		var body1
  		var body2
  		var node1
  		var node2
  
  		for (var c = @m_world.m_contactList c != null c = c.m_next)
  		{
  			if (c.m_shape1.m_body.IsSleeping() &&
  				c.m_shape2.m_body.IsSleeping())
  			{
  				continue
  			}
  
  			var oldCount = c.GetManifoldCount()
  			c.Evaluate()
  
  			var newCount = c.GetManifoldCount()
  
  			if (oldCount == 0 && newCount > 0)
  			{
  				//b2Settings.b2Assert(c.GetManifolds().pointCount > 0)
  
  				// Connect to island graph.
  				body1 = c.m_shape1.m_body
  				body2 = c.m_shape2.m_body
  				node1 = c.m_node1
  				node2 = c.m_node2
  
  				// Connect to body 1
  				node1.contact = c
  				node1.other = body2
  
  				node1.prev = null
  				node1.next = body1.m_contactList
  				if (node1.next != null)
  				{
  					node1.next.prev = c.m_node1
  				}
  				body1.m_contactList = c.m_node1
  
  				// Connect to body 2
  				node2.contact = c
  				node2.other = body1
  
  				node2.prev = null
  				node2.next = body2.m_contactList
  				if (node2.next != null)
  				{
  					node2.next.prev = node2
  				}
  				body2.m_contactList = node2
  			}
  			else if (oldCount > 0 && newCount == 0)
  			{
  				// Disconnect from island graph.
  				body1 = c.m_shape1.m_body
  				body2 = c.m_shape2.m_body
  				node1 = c.m_node1
  				node2 = c.m_node2
  
  				// Remove from body 1
  				if (node1.prev)
  				{
  					node1.prev.next = node1.next
  				}
  
  				if (node1.next)
  				{
  					node1.next.prev = node1.prev
  				}
  
  				if (node1 == body1.m_contactList)
  				{
  					body1.m_contactList = node1.next
  				}
  
  				node1.prev = null
  				node1.next = null
  
  				// Remove from body 2
  				if (node2.prev)
  				{
  					node2.prev.next = node2.next
  				}
  
  				if (node2.next)
  				{
  					node2.next.prev = node2.prev
  				}
  
  				if (node2 == body2.m_contactList)
  				{
  					body2.m_contactList = node2.next
  				}
  
  				node2.prev = null
  				node2.next = null
  			}
  		}
  	},
  
  	m_world: null,
  
  	// @ lets us provide broadphase proxy pair user data for
  	// contacts that shouldn't exist.
  	m_nullContact: new b2NullContact(),
  	m_destroyImmediate: null})*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2BodyDef;
  exports.b2BodyDef = b2BodyDef = b2BodyDef = (function() {
    b2BodyDef.prototype.userData = null;
    b2BodyDef.prototype.shapes = [];
    b2BodyDef.prototype.position = null;
    b2BodyDef.prototype.rotation = null;
    b2BodyDef.prototype.linearVelocity = null;
    b2BodyDef.prototype.angularVelocity = null;
    b2BodyDef.prototype.linearDamping = null;
    b2BodyDef.prototype.angularDamping = null;
    b2BodyDef.prototype.allowSleep = null;
    b2BodyDef.prototype.isSleeping = null;
    b2BodyDef.prototype.preventRotation = null;
    function b2BodyDef() {
      var i, _ref;
      this.shapes = [];
      this.userData = null;
      for (i = 0, _ref = b2Settings.b2_maxShapesPerBody; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        this.shapes[i] = null;
      }
      this.position = new b2Vec2(0.0, 0.0);
      this.rotation = 0.0;
      this.linearVelocity = new b2Vec2(0.0, 0.0);
      this.angularVelocity = 0.0;
      this.linearDamping = 0.0;
      this.angularDamping = 0.0;
      this.allowSleep = true;
      this.isSleeping = false;
      this.preventRotation = false;
    }
    b2BodyDef.prototype.AddShape = function(shape) {
      var i, _ref, _results;
      _results = [];
      for (i = 0, _ref = b2Settings.b2_maxShapesPerBody; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (this.shapes[i] == null) {
          this.shapes[i] = shape;
          break;
        }
      }
      return _results;
    };
    return b2BodyDef;
  })();
  /*
  var b2BodyDef = Class.create()
  b2BodyDef.prototype = 
  {
  	initialize: function()
  	{
  		// initialize instance variables for references
  		@shapes = new Array()
  		//
  
  		@userData = null
  		for (var i = 0 i < b2Settings.b2_maxShapesPerBody i++){
  			@shapes[i] = null
  		}
  		@position = new b2Vec2(0.0, 0.0)
  		@rotation = 0.0
  		@linearVelocity = new b2Vec2(0.0, 0.0)
  		@angularVelocity = 0.0
  		@linearDamping = 0.0
  		@angularDamping = 0.0
  		@allowSleep = true
  		@isSleeping = false
  		@preventRotation = false
  	},
  
  	userData: null,
  	shapes: new Array(),
  	position: null,
  	rotation: null,
  	linearVelocity: null,
  	angularVelocity: null,
  	linearDamping: null,
  	angularDamping: null,
  	allowSleep: null,
  	isSleeping: null,
  	preventRotation: null,
  
  	AddShape: function(shape)
  	{
  		for (var i = 0 i < b2Settings.b2_maxShapesPerBody ++i)
  		{
  			if (@shapes[i] == null)
  			{
  				@shapes[i] = shape
  				break
  			}
  		}
  	}}*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2BoxDef;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2BoxDef = b2BoxDef = b2BoxDef = (function() {
    __extends(b2BoxDef, b2ShapeDef);
    b2BoxDef.prototype.extents = null;
    function b2BoxDef() {
      this.type = b2Shape.e_unknownShape;
      this.userData = null;
      this.localPosition = new b2Vec2(0.0, 0.0);
      this.localRotation = 0.0;
      this.friction = 0.2;
      this.restitution = 0.0;
      this.density = 0.0;
      this.categoryBits = 0x0001;
      this.maskBits = 0xFFFF;
      this.groupIndex = 0;
      this.type = b2Shape.e_boxShape;
      this.extents = new b2Vec2(1.0, 1.0);
    }
    return b2BoxDef;
  })();
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2Body;
  exports.b2Body = b2Body = b2Body = (function() {
    function b2Body(bd, world) {
      var i, massData, massDatas, r, sd, shape, _ref, _ref2, _ref3, _ref4;
      this.sMat0 = new b2Mat22();
      this.m_position = new b2Vec2();
      this.m_R = new b2Mat22(0);
      this.m_position0 = new b2Vec2();
      this.m_flags = 0;
      this.m_position.SetV(bd.position);
      this.m_rotation = bd.rotation;
      this.m_R.Set(this.m_rotation);
      this.m_position0.SetV(this.m_position);
      this.m_rotation0 = this.m_rotation;
      this.m_world = world;
      this.m_linearDamping = b2Math.b2Clamp(1.0 - bd.linearDamping, 0.0, 1.0);
      this.m_angularDamping = b2Math.b2Clamp(1.0 - bd.angularDamping, 0.0, 1.0);
      this.m_force = new b2Vec2(0.0, 0.0);
      this.m_torque = 0.0;
      this.m_mass = 0.0;
      massDatas = new Array(b2Settings.b2_maxShapesPerBody);
      for (i = 0, _ref = b2Settings.b2_maxShapesPerBody; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        massDatas[i] = new b2MassData();
      }
      this.m_shapeCount = 0;
      this.m_center = new b2Vec2(0.0, 0.0);
      for (i = 0, _ref2 = b2Settings.b2_maxShapesPerBody; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        sd = bd.shapes[i];
        if (sd === null) {
          break;
        }
        massData = massDatas[i];
        sd.ComputeMass(massData);
        this.m_mass += massData.mass;
        this.m_center.x += massData.mass * (sd.localPosition.x + massData.center.x);
        this.m_center.y += massData.mass * (sd.localPosition.y + massData.center.y);
        ++this.m_shapeCount;
      }
      if (this.m_mass > 0.0) {
        this.m_center.Multiply(1.0 / this.m_mass);
        this.m_position.Add(b2Math.b2MulMV(this.m_R, this.m_center));
      } else {
        this.m_flags |= b2Body.e_staticFlag;
      }
      this.m_I = 0.0;
      for (i = 0, _ref3 = this.m_shapeCount; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
        sd = bd.shapes[i];
        massData = massDatas[i];
        this.m_I += massData.I;
        r = b2Math.SubtractVV(b2Math.AddVV(sd.localPosition, massData.center), this.m_center);
        this.m_I += massData.mass * b2Math.b2Dot(r, r);
      }
      if (this.m_mass > 0.0) {
        this.m_invMass = 1.0 / this.m_mass;
      } else {
        this.m_invMass = 0.0;
      }
      if (this.m_I > 0.0 && bd.preventRotation === false) {
        this.m_invI = 1.0 / this.m_I;
      } else {
        this.m_I = 0.0;
        this.m_invI = 0.0;
      }
      this.m_linearVelocity = b2Math.AddVV(bd.linearVelocity, b2Math.b2CrossFV(bd.angularVelocity, this.m_center));
      this.m_angularVelocity = bd.angularVelocity;
      this.m_jointList = null;
      this.m_contactList = null;
      this.m_prev = null;
      this.m_next = null;
      this.m_shapeList = null;
      for (i = 0, _ref4 = this.m_shapeCount; 0 <= _ref4 ? i < _ref4 : i > _ref4; 0 <= _ref4 ? i++ : i--) {
        sd = bd.shapes[i];
        shape = b2Shape.Create(sd, this, this.m_center);
        shape.m_next = this.m_shapeList;
        this.m_shapeList = shape;
      }
      this.m_sleepTime = 0.0;
      if (bd.allowSleep) {
        this.m_flags |= b2Body.e_allowSleepFlag;
      }
      if (bd.isSleeping) {
        this.m_flags |= b2Body.e_sleepFlag;
      }
      if ((this.m_flags & b2Body.e_sleepFlag) || this.m_invMass === 0.0) {
        this.m_linearVelocity.Set(0.0, 0.0);
        this.m_angularVelocity = 0.0;
      }
      this.m_userData = bd.userData;
    }
    b2Body.prototype.GetShapeList = function() {
      return this.m_shapeList;
    };
    b2Body.prototype.Freeze = function() {
      var s, _results;
      this.m_flags |= b2Body.e_frozenFlag;
      this.m_linearVelocity.SetZero();
      this.m_angularVelocity = 0.0;
      s = this.m_shapeList;
      _results = [];
      while (s != null) {
        s.DestroyProxy();
        _results.push(s = s.m_next);
      }
      return _results;
    };
    b2Body.prototype.m_flags = 0;
    b2Body.prototype.m_position = new b2Vec2();
    b2Body.prototype.m_rotation = null;
    b2Body.prototype.m_R = new b2Mat22(0);
    b2Body.prototype.m_position0 = new b2Vec2();
    b2Body.prototype.m_rotation0 = null;
    b2Body.prototype.m_linearVelocity = null;
    b2Body.prototype.m_angularVelocity = null;
    b2Body.prototype.m_force = null;
    b2Body.prototype.m_torque = null;
    b2Body.prototype.m_center = null;
    b2Body.prototype.m_world = null;
    b2Body.prototype.m_prev = null;
    b2Body.prototype.m_next = null;
    b2Body.prototype.m_shapeList = null;
    b2Body.prototype.m_shapeCount = 0;
    b2Body.prototype.m_jointList = null;
    b2Body.prototype.m_contactList = null;
    b2Body.prototype.m_mass = null;
    b2Body.prototype.m_invMass = null;
    b2Body.prototype.m_I = null;
    b2Body.prototype.m_invI = null;
    b2Body.prototype.m_linearDamping = null;
    b2Body.prototype.m_angularDamping = null;
    b2Body.prototype.m_sleepTime = null;
    b2Body.prototype.m_userData = null;
    return b2Body;
  })();
  b2Body.e_staticFlag = 0x0001;
  b2Body.e_frozenFlag = 0x0002;
  b2Body.e_islandFlag = 0x0004;
  b2Body.e_sleepFlag = 0x0008;
  b2Body.e_allowSleepFlag = 0x0010;
  b2Body.e_destroyFlag = 0x0020;
  /*
  var b2Body = Class.create()
  b2Body.prototype = 
  {
  	// Set the position of the body's origin and rotation (radians).
  	// @ breaks any contacts and wakes the other bodies.
  	SetOriginPosition: function(position, rotation){
  		if (@IsFrozen())
  		{
  			return
  		}
  
  		@m_rotation = rotation
  		@m_R.Set(@m_rotation)
  		@m_position = b2Math.AddVV(position , b2Math.b2MulMV(@m_R, @m_center))
  
  		@m_position0.SetV(@m_position)
  		@m_rotation0 = @m_rotation
  
  		for (var s = @m_shapeList s != null s = s.m_next)
  		{
  			s.Synchronize(@m_position, @m_R, @m_position, @m_R)
  		}
  
  		@m_world.m_broadPhase.Commit()
  	},
  
  	// Get the position of the body's origin. The body's origin does not
  	// necessarily coincide with the center of mass. It depends on how the
  	// shapes are created.
  	GetOriginPosition: function(){
  		return b2Math.SubtractVV(@m_position, b2Math.b2MulMV(@m_R, @m_center))
  	},
  
  	// Set the position of the body's center of mass and rotation (radians).
  	// @ breaks any contacts and wakes the other bodies.
  	SetCenterPosition: function(position, rotation){
  		if (@IsFrozen())
  		{
  			return
  		}
  
  		@m_rotation = rotation
  		@m_R.Set(@m_rotation)
  		@m_position.SetV( position )
  
  		@m_position0.SetV(@m_position)
  		@m_rotation0 = @m_rotation
  
  		for (var s = @m_shapeList s != null s = s.m_next)
  		{
  			s.Synchronize(@m_position, @m_R, @m_position, @m_R)
  		}
  
  		@m_world.m_broadPhase.Commit()
  	},
  
  	// Get the position of the body's center of mass. The body's center of mass
  	// does not necessarily coincide with the body's origin. It depends on how the
  	// shapes are created.
  	GetCenterPosition: function(){
  		return @m_position
  	},
  
  	// Get the rotation in radians.
  	GetRotation: function(){
  		return @m_rotation
  	},
  
  	GetRotationMatrix: function(){
  		return @m_R
  	},
  
  	// Set/Get the linear velocity of the center of mass.
  	SetLinearVelocity: function(v){
  		@m_linearVelocity.SetV(v)
  	},
  	GetLinearVelocity: function(){
  		return @m_linearVelocity
  	},
  
  	// Set/Get the angular velocity.
  	SetAngularVelocity: function(w){
  		@m_angularVelocity = w
  	},
  	GetAngularVelocity: function(){
  		return @m_angularVelocity
  	},
  
  	// Apply a force at a world point. Additive.
  	ApplyForce: function(force, point)
  	{
  		if (@IsSleeping() == false)
  		{
  			@m_force.Add( force )
  			@m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(point, @m_position), force)
  		}
  	},
  
  	// Apply a torque. Additive.
  	ApplyTorque: function(torque)
  	{
  		if (@IsSleeping() == false)
  		{
  			@m_torque += torque
  		}
  	},
  
  	// Apply an impulse at a point. @ immediately modifies the velocity.
  	ApplyImpulse: function(impulse, point)
  	{
  		if (@IsSleeping() == false)
  		{
  			@m_linearVelocity.Add( b2Math.MulFV(@m_invMass, impulse) )
  			@m_angularVelocity += ( @m_invI * b2Math.b2CrossVV( b2Math.SubtractVV(point, @m_position), impulse)  )
  		}
  	},
  
  	GetMass: function(){
  		return @m_mass
  	},
  
  	GetInertia: function(){
  		return @m_I
  	},
  
  	// Get the world coordinates of a point give the local coordinates
  	// relative to the body's center of mass.
  	GetWorldPoint: function(localPoint){
  		return b2Math.AddVV(@m_position , b2Math.b2MulMV(@m_R, localPoint))
  	},
  
  	// Get the world coordinates of a vector given the local coordinates.
  	GetWorldVector: function(localVector){
  		return b2Math.b2MulMV(@m_R, localVector)
  	},
  
  	// Returns a local point relative to the center of mass given a world point.
  	GetLocalPoint: function(worldPoint){
  		return b2Math.b2MulTMV(@m_R, b2Math.SubtractVV(worldPoint, @m_position))
  	},
  
  	// Returns a local vector given a world vector.
  	GetLocalVector: function(worldVector){
  		return b2Math.b2MulTMV(@m_R, worldVector)
  	},
  
  	// Is @ body static (immovable)?
  	IsStatic: function(){
  		return (@m_flags & b2Body.e_staticFlag) == b2Body.e_staticFlag
  	},
  
  	IsFrozen: function()
  	{
  		return (@m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag
  	},
  
  	// Is @ body sleeping (not simulating).
  	IsSleeping: function(){
  		return (@m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag
  	},
  
  	// You can disable sleeping on @ particular body.
  	AllowSleeping: function(flag)
  	{
  		if (flag)
  		{
  			@m_flags |= b2Body.e_allowSleepFlag
  		}
  		else
  		{
  			@m_flags &= ~b2Body.e_allowSleepFlag
  			@WakeUp()
  		}
  	},
  
  	// Wake up @ body so it will begin simulating.
  	WakeUp: function(){
  		@m_flags &= ~b2Body.e_sleepFlag
  		@m_sleepTime = 0.0
  	},
  
  	// Get the list of all shapes attached to @ body.
  	GetShapeList: function(){
  		return @m_shapeList
  	},
  
  	GetContactList: function()
  	{
  		return @m_contactList
  	},
  
  	GetJointList: function()
  	{
  		return @m_jointList
  	},
  
  	// Get the next body in the world's body list.
  	GetNext: function(){
  		return @m_next
  	},
  
  	GetUserData: function(){
  		return @m_userData
  	},
  
  	//--------------- Internals Below -------------------
  
  	initialize: function(bd, world){
  		// initialize instance variables for references
  		@sMat0 = new b2Mat22()
  		@m_position = new b2Vec2()
  		@m_R = new b2Mat22(0)
  		@m_position0 = new b2Vec2()
  		//
  
  		var i = 0
  		var sd
  		var massData
  
  		@m_flags = 0
  		@m_position.SetV( bd.position )
  		@m_rotation = bd.rotation
  		@m_R.Set(@m_rotation)
  		@m_position0.SetV(@m_position)
  		@m_rotation0 = @m_rotation
  		@m_world = world
  
  		@m_linearDamping = b2Math.b2Clamp(1.0 - bd.linearDamping, 0.0, 1.0)
  		@m_angularDamping = b2Math.b2Clamp(1.0 - bd.angularDamping, 0.0, 1.0)
  
  		@m_force = new b2Vec2(0.0, 0.0)
  		@m_torque = 0.0
  
  		@m_mass = 0.0
  
  		var massDatas = new Array(b2Settings.b2_maxShapesPerBody)
  		for (i = 0 i < b2Settings.b2_maxShapesPerBody i++){
  			massDatas[i] = new b2MassData()
  		}
  
  		// Compute the shape mass properties, the bodies total mass and COM.
  		@m_shapeCount = 0
  		@m_center = new b2Vec2(0.0, 0.0)
  		for (i = 0 i < b2Settings.b2_maxShapesPerBody ++i)
  		{
  			sd = bd.shapes[i]
  			if (sd == null) break
  			massData = massDatas[ i ]
  			sd.ComputeMass(massData)
  			@m_mass += massData.mass
  			//@m_center += massData->mass * (sd->localPosition + massData->center)
  			@m_center.x += massData.mass * (sd.localPosition.x + massData.center.x)
  			@m_center.y += massData.mass * (sd.localPosition.y + massData.center.y)
  			++@m_shapeCount
  		}
  
  		// Compute center of mass, and shift the origin to the COM.
  		if (@m_mass > 0.0)
  		{
  			@m_center.Multiply( 1.0 / @m_mass )
  			@m_position.Add( b2Math.b2MulMV(@m_R, @m_center) )
  		}
  		else
  		{
  			@m_flags |= b2Body.e_staticFlag
  		}
  
  		// Compute the moment of inertia.
  		@m_I = 0.0
  		for (i = 0 i < @m_shapeCount ++i)
  		{
  			sd = bd.shapes[i]
  			massData = massDatas[ i ]
  			@m_I += massData.I
  			var r = b2Math.SubtractVV( b2Math.AddVV(sd.localPosition, massData.center), @m_center )
  			@m_I += massData.mass * b2Math.b2Dot(r, r)
  		}
  
  		if (@m_mass > 0.0)
  		{
  			@m_invMass = 1.0 / @m_mass
  		}
  		else
  		{
  			@m_invMass = 0.0
  		}
  
  		if (@m_I > 0.0 && bd.preventRotation == false)
  		{
  			@m_invI = 1.0 / @m_I
  		}
  		else
  		{
  			@m_I = 0.0
  			@m_invI = 0.0
  		}
  
  		// Compute the center of mass velocity.
  		@m_linearVelocity = b2Math.AddVV(bd.linearVelocity, b2Math.b2CrossFV(bd.angularVelocity, @m_center))
  		@m_angularVelocity = bd.angularVelocity
  
  		@m_jointList = null
  		@m_contactList = null
  		@m_prev = null
  		@m_next = null
  
  		// Create the shapes.
  		@m_shapeList = null
  		for (i = 0 i < @m_shapeCount ++i)
  		{
  			sd = bd.shapes[i]
  			var shape = b2Shape.Create(sd, @, @m_center)
  			shape.m_next = @m_shapeList
  			@m_shapeList = shape
  		}
  
  		@m_sleepTime = 0.0
  		if (bd.allowSleep)
  		{
  			@m_flags |= b2Body.e_allowSleepFlag
  		}
  		if (bd.isSleeping)
  		{
  			@m_flags |= b2Body.e_sleepFlag
  		}
  
  		if ((@m_flags & b2Body.e_sleepFlag)  || @m_invMass == 0.0)
  		{
  			@m_linearVelocity.Set(0.0, 0.0)
  			@m_angularVelocity = 0.0
  		}
  
  		@m_userData = bd.userData
  	},
  	// does not support destructors
  
  	Destroy: function(){
  		var s = @m_shapeList
  		while (s)
  		{
  			var s0 = s
  			s = s.m_next
  
  			b2Shape.Destroy(s0)
  		}
  	},
  
  	// Temp mat
  	sMat0: new b2Mat22(),
  	SynchronizeShapes: function(){
  		//b2Mat22 R0(@m_rotation0)
  		@sMat0.Set(@m_rotation0)
  		for (var s = @m_shapeList s != null s = s.m_next)
  		{
  			s.Synchronize(@m_position0, @sMat0, @m_position, @m_R)
  		}
  	},
  
  	QuickSyncShapes: function(){
  		for (var s = @m_shapeList s != null s = s.m_next)
  		{
  			s.QuickSync(@m_position, @m_R)
  		}
  	},
  
  	// @ is used to prevent connected bodies from colliding.
  	// It may lie, depending on the collideConnected flag.
  	IsConnected: function(other){
  		for (var jn = @m_jointList jn != null jn = jn.next)
  		{
  			if (jn.other == other)
  				return jn.joint.m_collideConnected == false
  		}
  
  		return false
  	},
  
  	Freeze: function(){
  		@m_flags |= b2Body.e_frozenFlag
  		@m_linearVelocity.SetZero()
  		@m_angularVelocity = 0.0
  
  		for (var s = @m_shapeList s != null s = s.m_next)
  		{
  			s.DestroyProxy()
  		}
  	},
  
  	m_flags: 0,
  
  	m_position: new b2Vec2(),
  	m_rotation: null,
  	m_R: new b2Mat22(0),
  
  	// Conservative advancement data.
  	m_position0: new b2Vec2(),
  	m_rotation0: null,
  
  	m_linearVelocity: null,
  	m_angularVelocity: null,
  
  	m_force: null,
  	m_torque: null,
  
  	m_center: null,
  
  	m_world: null,
  	m_prev: null,
  	m_next: null,
  
  	m_shapeList: null,
  	m_shapeCount: 0,
  
  	m_jointList: null,
  	m_contactList: null,
  
  	m_mass: null,
  	m_invMass: null,
  	m_I: null,
  	m_invI: null,
  
  	m_linearDamping: null,
  	m_angularDamping: null,
  
  	m_sleepTime: null,
  
  	m_userData: null}
  b2Body.e_staticFlag = 0x0001
  b2Body.e_frozenFlag = 0x0002
  b2Body.e_islandFlag = 0x0004
  b2Body.e_sleepFlag = 0x0008
  b2Body.e_allowSleepFlag = 0x0010
  b2Body.e_destroyFlag = 0x0020*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2CircleShape;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2CircleShape = b2CircleShape = b2CircleShape = (function() {
    __extends(b2CircleShape, b2Shape);
    function b2CircleShape(def, body, localCenter) {
      var aabb, broadPhase, circle, rX, rY;
      this.m_R = new b2Mat22();
      this.m_position = new b2Vec2();
      this.m_userData = def.userData;
      this.m_friction = def.friction;
      this.m_restitution = def.restitution;
      this.m_body = body;
      this.m_proxyId = b2Pair.b2_nullProxy;
      this.m_maxRadius = 0.0;
      this.m_categoryBits = def.categoryBits;
      this.m_maskBits = def.maskBits;
      this.m_groupIndex = def.groupIndex;
      this.m_localPosition = new b2Vec2();
      circle = def;
      this.m_localPosition.Set(def.localPosition.x - localCenter.x, def.localPosition.y - localCenter.y);
      this.m_type = b2Shape.e_circleShape;
      this.m_radius = circle.radius;
      this.m_R.SetM(this.m_body.m_R);
      rX = this.m_R.col1.x * this.m_localPosition.x + this.m_R.col2.x * this.m_localPosition.y;
      rY = this.m_R.col1.y * this.m_localPosition.x + this.m_R.col2.y * this.m_localPosition.y;
      this.m_position.x = this.m_body.m_position.x + rX;
      this.m_position.y = this.m_body.m_position.y + rY;
      this.m_maxRadius = Math.sqrt(rX * rX + rY * rY) + this.m_radius;
      aabb = new b2AABB();
      aabb.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius);
      aabb.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius);
      broadPhase = this.m_body.m_world.m_broadPhase;
      if (broadPhase.InRange(aabb)) {
        this.m_proxyId = broadPhase.CreateProxy(aabb, this);
      } else {
        this.m_proxyId = b2Pair.b2_nullProxy;
      }
      if (this.m_proxyId === b2Pair.b2_nullProxy) {
        this.m_body.Freeze();
      }
    }
    return b2CircleShape;
  })();
  /*
  var b2CircleShape = Class.create()
  Object.extend(b2CircleShape.prototype, b2Shape.prototype)
  Object.extend(b2CircleShape.prototype, 
  {
  	TestPoint: function(p){
  		//var d = b2Math.SubtractVV(p, @m_position)
  		var d = new b2Vec2()
  		d.SetV(p)
  		d.Subtract(@m_position)
  		return b2Math.b2Dot(d, d) <= @m_radius * @m_radius
  	},
  
  	//--------------- Internals Below -------------------
  
  	initialize: function(def, body, localCenter){
  		// initialize instance variables for references
  		@m_R = new b2Mat22()
  		@m_position = new b2Vec2()
  		//
  
  		// The constructor for b2Shape
  		@m_userData = def.userData
  
  		@m_friction = def.friction
  		@m_restitution = def.restitution
  		@m_body = body
  
  		@m_proxyId = b2Pair.b2_nullProxy
  
  		@m_maxRadius = 0.0
  
  		@m_categoryBits = def.categoryBits
  		@m_maskBits = def.maskBits
  		@m_groupIndex = def.groupIndex
  		//
  
  		// initialize instance variables for references
  		@m_localPosition = new b2Vec2()
  		//
  
  		//super(def, body)
  
  		//b2Settings.b2Assert(def.type == b2Shape.e_circleShape)
  		var circle = def
  
  		//@m_localPosition = def.localPosition - localCenter
  		@m_localPosition.Set(def.localPosition.x - localCenter.x, def.localPosition.y - localCenter.y)
  		@m_type = b2Shape.e_circleShape
  		@m_radius = circle.radius
  
  		@m_R.SetM(@m_body.m_R)
  		//b2Vec2 r = b2Mul(@m_body->@m_R, @m_localPosition)
  		var rX = @m_R.col1.x * @m_localPosition.x + @m_R.col2.x * @m_localPosition.y
  		var rY = @m_R.col1.y * @m_localPosition.x + @m_R.col2.y * @m_localPosition.y
  		//@m_position = @m_body->@m_position + r
  		@m_position.x = @m_body.m_position.x + rX
  		@m_position.y = @m_body.m_position.y + rY
  		//@m_maxRadius = r.Length() + @m_radius
  		@m_maxRadius = Math.sqrt(rX*rX+rY*rY) + @m_radius
  
  		var aabb = new b2AABB()
  		aabb.minVertex.Set(@m_position.x - @m_radius, @m_position.y - @m_radius)
  		aabb.maxVertex.Set(@m_position.x + @m_radius, @m_position.y + @m_radius)
  
  		var broadPhase = @m_body.m_world.m_broadPhase
  		if (broadPhase.InRange(aabb))
  		{
  			@m_proxyId = broadPhase.CreateProxy(aabb, @)
  		}
  		else
  		{
  			@m_proxyId = b2Pair.b2_nullProxy
  		}
  
  		if (@m_proxyId == b2Pair.b2_nullProxy)
  		{
  			@m_body.Freeze()
  		}
  	},
  
  	Synchronize: function(position1, R1, position2, R2){
  		@m_R.SetM(R2)
  		//@m_position = position2 + b2Mul(R2, @m_localPosition)
  		@m_position.x = (R2.col1.x * @m_localPosition.x + R2.col2.x * @m_localPosition.y) + position2.x
  		@m_position.y = (R2.col1.y * @m_localPosition.x + R2.col2.y * @m_localPosition.y) + position2.y
  
  		if (@m_proxyId == b2Pair.b2_nullProxy)
  		{
  			return
  		}
  
  		// Compute an AABB that covers the swept shape (may miss some rotation effect).
  		//b2Vec2 p1 = position1 + b2Mul(R1, @m_localPosition)
  		var p1X = position1.x + (R1.col1.x * @m_localPosition.x + R1.col2.x * @m_localPosition.y)
  		var p1Y = position1.y + (R1.col1.y * @m_localPosition.x + R1.col2.y * @m_localPosition.y)
  		//b2Vec2 lower = b2Min(p1, @m_position)
  		var lowerX = Math.min(p1X, @m_position.x)
  		var lowerY = Math.min(p1Y, @m_position.y)
  		//b2Vec2 upper = b2Max(p1, @m_position)
  		var upperX = Math.max(p1X, @m_position.x)
  		var upperY = Math.max(p1Y, @m_position.y)
  
  		var aabb = new b2AABB()
  		aabb.minVertex.Set(lowerX - @m_radius, lowerY - @m_radius)
  		aabb.maxVertex.Set(upperX + @m_radius, upperY + @m_radius)
  
  		var broadPhase = @m_body.m_world.m_broadPhase
  		if (broadPhase.InRange(aabb))
  		{
  			broadPhase.MoveProxy(@m_proxyId, aabb)
  		}
  		else
  		{
  			@m_body.Freeze()
  		}
  	},
  
  	QuickSync: function(position, R){
  		@m_R.SetM(R)
  		//@m_position = position + b2Mul(R, @m_localPosition)
  		@m_position.x = (R.col1.x * @m_localPosition.x + R.col2.x * @m_localPosition.y) + position.x
  		@m_position.y = (R.col1.y * @m_localPosition.x + R.col2.y * @m_localPosition.y) + position.y
  	},
  
  
  	ResetProxy: function(broadPhase)
  	{
  		if (@m_proxyId == b2Pair.b2_nullProxy)
  		{
  			return
  		}
  
  		var proxy = broadPhase.GetProxy(@m_proxyId)
  
  		broadPhase.DestroyProxy(@m_proxyId)
  		proxy = null
  
  		var aabb = new b2AABB()
  		aabb.minVertex.Set(@m_position.x - @m_radius, @m_position.y - @m_radius)
  		aabb.maxVertex.Set(@m_position.x + @m_radius, @m_position.y + @m_radius)
  
  		if (broadPhase.InRange(aabb))
  		{
  			@m_proxyId = broadPhase.CreateProxy(aabb, @)
  		}
  		else
  		{
  			@m_proxyId = b2Pair.b2_nullProxy
  		}
  
  		if (@m_proxyId == b2Pair.b2_nullProxy)
  		{
  			@m_body.Freeze()
  		}
  	},
  
  
  	Support: function(dX, dY, out)
  	{
  		//b2Vec2 u = d
  		//u.Normalize()
  		var len = Math.sqrt(dX*dX + dY*dY)
  		dX /= len
  		dY /= len
  		//return @m_position + @m_radius * u
  		out.Set(	@m_position.x + @m_radius*dX,
  					@m_position.y + @m_radius*dY)
  	},
  
  
  	// Local position in parent body
  	m_localPosition: new b2Vec2(),
  	m_radius: null})*/
  
  /*
  Copyright (c) 2006-2007 Erin Catto http:
  
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.
  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:
  1. The origin of this software must not be misrepresented you must not
  claim that you wrote the original software. If you use this software
  in a product, an acknowledgment in the product documentation would be
  appreciated but is not required.
  2. Altered source versions must be plainly marked, and must not be
  misrepresented the original software.
  3. This notice may not be removed or altered from any source distribution.
  */
  var b2PolyShape;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2PolyShape = b2PolyShape = b2PolyShape = (function() {
    __extends(b2PolyShape, b2Shape);
    function b2PolyShape(def, body, newOrigin) {
      var aabb, box, broadPhase, centroidX, centroidY, hX, hY, hcX, hcY, i, i1, i2, length, localR, maxVertexX, maxVertexY, minVertexX, minVertexY, poly, positionX, positionY, tVec, uX, uY, v, _ref, _ref2, _ref3, _ref4;
      this.m_R = new b2Mat22();
      this.m_position = new b2Vec2();
      this.m_userData = def.userData;
      this.m_friction = def.friction;
      this.m_restitution = def.restitution;
      this.m_body = body;
      this.m_proxyId = b2Pair.b2_nullProxy;
      this.m_maxRadius = 0.0;
      this.m_categoryBits = def.categoryBits;
      this.m_maskBits = def.maskBits;
      this.m_groupIndex = def.groupIndex;
      this.syncAABB = new b2AABB();
      this.syncMat = new b2Mat22();
      this.m_localCentroid = new b2Vec2();
      this.m_localOBB = new b2OBB();
      aabb = new b2AABB();
      this.m_vertices = new Array(b2Settings.b2_maxPolyVertices);
      this.m_coreVertices = new Array(b2Settings.b2_maxPolyVertices);
      this.m_normals = new Array(b2Settings.b2_maxPolyVertices);
      this.m_type = b2Shape.e_polyShape;
      localR = new b2Mat22(def.localRotation);
      if (def.type === b2Shape.e_boxShape) {
        this.m_localCentroid.x = def.localPosition.x - newOrigin.x;
        this.m_localCentroid.y = def.localPosition.y - newOrigin.y;
        box = def;
        this.m_vertexCount = 4;
        hX = box.extents.x;
        hY = box.extents.y;
        hcX = Math.max(0.0, hX - 2.0 * b2Settings.b2_linearSlop);
        hcY = Math.max(0.0, hY - 2.0 * b2Settings.b2_linearSlop);
        tVec = this.m_vertices[0] = new b2Vec2();
        tVec.x = localR.col1.x * hX + localR.col2.x * hY;
        tVec.y = localR.col1.y * hX + localR.col2.y * hY;
        tVec = this.m_vertices[1] = new b2Vec2();
        tVec.x = localR.col1.x * -hX + localR.col2.x * hY;
        tVec.y = localR.col1.y * -hX + localR.col2.y * hY;
        tVec = this.m_vertices[2] = new b2Vec2();
        tVec.x = localR.col1.x * -hX + localR.col2.x * -hY;
        tVec.y = localR.col1.y * -hX + localR.col2.y * -hY;
        tVec = this.m_vertices[3] = new b2Vec2();
        tVec.x = localR.col1.x * hX + localR.col2.x * -hY;
        tVec.y = localR.col1.y * hX + localR.col2.y * -hY;
        tVec = this.m_coreVertices[0] = new b2Vec2();
        tVec.x = localR.col1.x * hcX + localR.col2.x * hcY;
        tVec.y = localR.col1.y * hcX + localR.col2.y * hcY;
        tVec = this.m_coreVertices[1] = new b2Vec2();
        tVec.x = localR.col1.x * -hcX + localR.col2.x * hcY;
        tVec.y = localR.col1.y * -hcX + localR.col2.y * hcY;
        tVec = this.m_coreVertices[2] = new b2Vec2();
        tVec.x = localR.col1.x * -hcX + localR.col2.x * -hcY;
        tVec.y = localR.col1.y * -hcX + localR.col2.y * -hcY;
        tVec = this.m_coreVertices[3] = new b2Vec2();
        tVec.x = localR.col1.x * hcX + localR.col2.x * -hcY;
        tVec.y = localR.col1.y * hcX + localR.col2.y * -hcY;
      } else {
        poly = def;
        this.m_vertexCount = poly.vertexCount;
        b2Shape.PolyCentroid(poly.vertices, poly.vertexCount, b2PolyShape.tempVec);
        centroidX = b2PolyShape.tempVec.x;
        centroidY = b2PolyShape.tempVec.y;
        this.m_localCentroid.x = def.localPosition.x + (localR.col1.x * centroidX + localR.col2.x * centroidY) - newOrigin.x;
        this.m_localCentroid.y = def.localPosition.y + (localR.col1.y * centroidX + localR.col2.y * centroidY) - newOrigin.y;
        for (i = 0, _ref = this.m_vertexCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          this.m_vertices[i] = new b2Vec2();
          this.m_coreVertices[i] = new b2Vec2();
          hX = poly.vertices[i].x - centroidX;
          hY = poly.vertices[i].y - centroidY;
          this.m_vertices[i].x = localR.col1.x * hX + localR.col2.x * hY;
          this.m_vertices[i].y = localR.col1.y * hX + localR.col2.y * hY;
          uX = this.m_vertices[i].x;
          uY = this.m_vertices[i].y;
          length = Math.sqrt(uX * uX + uY * uY);
          if (length > Number.MIN_VALUE) {
            uX *= 1.0 / length;
            uY *= 1.0 / length;
          }
          this.m_coreVertices[i].x = this.m_vertices[i].x - 2.0 * b2Settings.b2_linearSlop * uX;
          this.m_coreVertices[i].y = this.m_vertices[i].y - 2.0 * b2Settings.b2_linearSlop * uY;
        }
      }
      minVertexX = Number.MAX_VALUE;
      minVertexY = Number.MAX_VALUE;
      maxVertexX = -Number.MAX_VALUE;
      maxVertexY = -Number.MAX_VALUE;
      this.m_maxRadius = 0.0;
      for (i = 0, _ref2 = this.m_vertexCount; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        v = this.m_vertices[i];
        minVertexX = Math.min(minVertexX, v.x);
        minVertexY = Math.min(minVertexY, v.y);
        maxVertexX = Math.max(maxVertexX, v.x);
        maxVertexY = Math.max(maxVertexY, v.y);
        this.m_maxRadius = Math.max(this.m_maxRadius, v.Length());
      }
      this.m_localOBB.R.SetIdentity();
      this.m_localOBB.center.Set((minVertexX + maxVertexX) * 0.5, (minVertexY + maxVertexY) * 0.5);
      this.m_localOBB.extents.Set((maxVertexX - minVertexX) * 0.5, (maxVertexY - minVertexY) * 0.5);
      i1 = 0;
      i2 = 0;
      for (i = 0, _ref3 = this.m_vertexCount; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
        this.m_normals[i] = new b2Vec2();
        i1 = i;
        i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
        this.m_normals[i].x = this.m_vertices[i2].y - this.m_vertices[i1].y;
        this.m_normals[i].y = -(this.m_vertices[i2].x - this.m_vertices[i1].x);
        this.m_normals[i].Normalize();
      }
      for (i = 0, _ref4 = this.m_vertexCount; 0 <= _ref4 ? i < _ref4 : i > _ref4; 0 <= _ref4 ? i++ : i--) {
        i1 = i;
        i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
      }
      this.m_R.SetM(this.m_body.m_R);
      this.m_position.x = this.m_body.m_position.x + (this.m_R.col1.x * this.m_localCentroid.x + this.m_R.col2.x * this.m_localCentroid.y);
      this.m_position.y = this.m_body.m_position.y + (this.m_R.col1.y * this.m_localCentroid.x + this.m_R.col2.y * this.m_localCentroid.y);
      b2PolyShape.tAbsR.col1.x = this.m_R.col1.x * this.m_localOBB.R.col1.x + this.m_R.col2.x * this.m_localOBB.R.col1.y;
      b2PolyShape.tAbsR.col1.y = this.m_R.col1.y * this.m_localOBB.R.col1.x + this.m_R.col2.y * this.m_localOBB.R.col1.y;
      b2PolyShape.tAbsR.col2.x = this.m_R.col1.x * this.m_localOBB.R.col2.x + this.m_R.col2.x * this.m_localOBB.R.col2.y;
      b2PolyShape.tAbsR.col2.y = this.m_R.col1.y * this.m_localOBB.R.col2.x + this.m_R.col2.y * this.m_localOBB.R.col2.y;
      b2PolyShape.tAbsR.Abs();
      hX = b2PolyShape.tAbsR.col1.x * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * this.m_localOBB.extents.y;
      hY = b2PolyShape.tAbsR.col1.y * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * this.m_localOBB.extents.y;
      positionX = this.m_position.x + (this.m_R.col1.x * this.m_localOBB.center.x + this.m_R.col2.x * this.m_localOBB.center.y);
      positionY = this.m_position.y + (this.m_R.col1.y * this.m_localOBB.center.x + this.m_R.col2.y * this.m_localOBB.center.y);
      aabb.minVertex.x = positionX - hX;
      aabb.minVertex.y = positionY - hY;
      aabb.maxVertex.x = positionX + hX;
      aabb.maxVertex.y = positionY + hY;
      broadPhase = this.m_body.m_world.m_broadPhase;
      if (broadPhase.InRange(aabb)) {
        this.m_proxyId = broadPhase.CreateProxy(aabb, this);
      } else {
        this.m_proxyId = b2Pair.b2_nullProxy;
      }
      if (this.m_proxyId === b2Pair.b2_nullProxy) {
        this.m_body.Freeze();
      }
    }
    return b2PolyShape;
  })();
  b2PolyShape.tempVec = new b2Vec2();
  b2PolyShape.tAbsR = new b2Mat22();
  /*
  var b2PolyShape = Class.create()
  Object.extend(b2PolyShape.prototype, b2Shape.prototype)
  Object.extend(b2PolyShape.prototype, 
  {
  	TestPoint: function(p){
  
  		//var pLocal = b2Math.b2MulTMV(@m_R, b2Math.SubtractVV(p, @m_position))
  		var pLocal = new b2Vec2()
  		pLocal.SetV(p)
  		pLocal.Subtract(@m_position)
  		pLocal.MulTM(@m_R)
  
  		for (var i = 0 i < @m_vertexCount ++i)
  		{
  			//var dot = b2Math.b2Dot(@m_normals[i], b2Math.SubtractVV(pLocal, @m_vertices[i]))
  			var tVec = new b2Vec2()
  			tVec.SetV(pLocal)
  			tVec.Subtract(@m_vertices[i])
  
  			var dot = b2Math.b2Dot(@m_normals[i], tVec)
  			if (dot > 0.0)
  			{
  				return false
  			}
  		}
  
  		return true
  	},
  
  	//--------------- Internals Below -------------------
  	// Temp vec for b2Shape.PolyCentroid
  
  	initialize: function(def, body, newOrigin){
  		// initialize instance variables for references
  		@m_R = new b2Mat22()
  		@m_position = new b2Vec2()
  		//
  
  		// The constructor for b2Shape
  		@m_userData = def.userData
  
  		@m_friction = def.friction
  		@m_restitution = def.restitution
  		@m_body = body
  
  		@m_proxyId = b2Pair.b2_nullProxy
  
  		@m_maxRadius = 0.0
  
  		@m_categoryBits = def.categoryBits
  		@m_maskBits = def.maskBits
  		@m_groupIndex = def.groupIndex
  		//
  
  		// initialize instance variables for references
  		@syncAABB = new b2AABB()
  		@syncMat = new b2Mat22()
  		@m_localCentroid = new b2Vec2()
  		@m_localOBB = new b2OBB()
  		//
  
  
  		//super(def, body)
  
  		var i = 0
  
  
  		var hX
  		var hY
  
  		var tVec
  
  		var aabb = new b2AABB()
  
  		// Vertices
  		@m_vertices = new Array(b2Settings.b2_maxPolyVertices)
  		@m_coreVertices = new Array(b2Settings.b2_maxPolyVertices)
  		//for (i = 0 i < b2Settings.b2_maxPolyVertices i++)
  		//	@m_vertices[i] = new b2Vec2()
  
  		// Normals
  		@m_normals = new Array(b2Settings.b2_maxPolyVertices)
  		//for (i = 0 i < b2Settings.b2_maxPolyVertices i++)
  		//	@m_normals[i] = new b2Vec2()
  
  		//b2Settings.b2Assert(def.type == b2Shape.e_boxShape || def.type == b2Shape.e_polyShape)
  		@m_type = b2Shape.e_polyShape
  
  		var localR = new b2Mat22(def.localRotation)
  
  		// Get the vertices transformed into the body frame.
  		if (def.type == b2Shape.e_boxShape)
  		{
  			//@m_localCentroid = def.localPosition - newOrigin
  			@m_localCentroid.x = def.localPosition.x - newOrigin.x
  			@m_localCentroid.y = def.localPosition.y - newOrigin.y
  
  			var box = def
  			@m_vertexCount = 4
  			hX = box.extents.x
  			hY = box.extents.y
  
  			//hc.x = b2Max(0.0f, h.x - 2.0f * b2_linearSlop)
  			var hcX = Math.max(0.0, hX - 2.0 * b2Settings.b2_linearSlop)
  			//hc.y = b2Max(0.0f, h.y - 2.0f * b2_linearSlop)
  			var hcY = Math.max(0.0, hY - 2.0 * b2Settings.b2_linearSlop)
  
  			//@m_vertices[0] = b2Mul(localR, b2Vec2(h.x, h.y))
  			tVec = @m_vertices[0] = new b2Vec2()
  			tVec.x = localR.col1.x * hX + localR.col2.x * hY
  			tVec.y = localR.col1.y * hX + localR.col2.y * hY
  			//@m_vertices[1] = b2Mul(localR, b2Vec2(-h.x, h.y))
  			tVec = @m_vertices[1] = new b2Vec2()
  			tVec.x = localR.col1.x * -hX + localR.col2.x * hY
  			tVec.y = localR.col1.y * -hX + localR.col2.y * hY
  			//@m_vertices[2] = b2Mul(localR, b2Vec2(-h.x, -h.y))
  			tVec = @m_vertices[2] = new b2Vec2()
  			tVec.x = localR.col1.x * -hX + localR.col2.x * -hY
  			tVec.y = localR.col1.y * -hX + localR.col2.y * -hY
  			//@m_vertices[3] = b2Mul(localR, b2Vec2(h.x, -h.y))
  			tVec = @m_vertices[3] = new b2Vec2()
  			tVec.x = localR.col1.x * hX + localR.col2.x * -hY
  			tVec.y = localR.col1.y * hX + localR.col2.y * -hY
  
  			//@m_coreVertices[0] = b2Mul(localR, b2Vec2(hc.x, hc.y))
  			tVec = @m_coreVertices[0] = new b2Vec2()
  			tVec.x = localR.col1.x * hcX + localR.col2.x * hcY
  			tVec.y = localR.col1.y * hcX + localR.col2.y * hcY
  			//@m_coreVertices[1] = b2Mul(localR, b2Vec2(-hc.x, hc.y))
  			tVec = @m_coreVertices[1] = new b2Vec2()
  			tVec.x = localR.col1.x * -hcX + localR.col2.x * hcY
  			tVec.y = localR.col1.y * -hcX + localR.col2.y * hcY
  			//@m_coreVertices[2] = b2Mul(localR, b2Vec2(-hc.x, -hc.y))
  			tVec = @m_coreVertices[2] = new b2Vec2()
  			tVec.x = localR.col1.x * -hcX + localR.col2.x * -hcY
  			tVec.y = localR.col1.y * -hcX + localR.col2.y * -hcY
  			//@m_coreVertices[3] = b2Mul(localR, b2Vec2(hc.x, -hc.y))
  			tVec = @m_coreVertices[3] = new b2Vec2()
  			tVec.x = localR.col1.x * hcX + localR.col2.x * -hcY
  			tVec.y = localR.col1.y * hcX + localR.col2.y * -hcY
  		}
  		else
  		{
  			var poly = def
  
  			@m_vertexCount = poly.vertexCount
  			//b2Settings.b2Assert(3 <= @m_vertexCount && @m_vertexCount <= b2Settings.b2_maxPolyVertices)
  			//b2Vec2 centroid = b2Shape.PolyCentroid(poly->vertices, poly->vertexCount)
  			b2Shape.PolyCentroid(poly.vertices, poly.vertexCount, b2PolyShape.tempVec)
  			var centroidX = b2PolyShape.tempVec.x
  			var centroidY = b2PolyShape.tempVec.y
  			//@m_localCentroid = def->localPosition + b2Mul(localR, centroid) - newOrigin
  			@m_localCentroid.x = def.localPosition.x + (localR.col1.x * centroidX + localR.col2.x * centroidY) - newOrigin.x
  			@m_localCentroid.y = def.localPosition.y + (localR.col1.y * centroidX + localR.col2.y * centroidY) - newOrigin.y
  
  			for (i = 0 i < @m_vertexCount ++i)
  			{
  				@m_vertices[i] = new b2Vec2()
  				@m_coreVertices[i] = new b2Vec2()
  
  				//@m_vertices[i] = b2Mul(localR, poly->vertices[i] - centroid)
  				hX = poly.vertices[i].x - centroidX
  				hY = poly.vertices[i].y - centroidY
  				@m_vertices[i].x = localR.col1.x * hX + localR.col2.x * hY
  				@m_vertices[i].y = localR.col1.y * hX + localR.col2.y * hY
  
  				//b2Vec2 u = @m_vertices[i]
  				var uX = @m_vertices[i].x
  				var uY = @m_vertices[i].y
  				//float32 length = u.Length()
  				var length = Math.sqrt(uX*uX + uY*uY)
  				if (length > Number.MIN_VALUE)
  				{
  					uX *= 1.0 / length
  					uY *= 1.0 / length
  				}
  
  				//@m_coreVertices[i] = @m_vertices[i] - 2.0f * b2_linearSlop * u
  				@m_coreVertices[i].x = @m_vertices[i].x - 2.0 * b2Settings.b2_linearSlop * uX
  				@m_coreVertices[i].y = @m_vertices[i].y - 2.0 * b2Settings.b2_linearSlop * uY
  			}
  
  		}
  
  		// Compute bounding box. TODO_ERIN optimize OBB
  		//var minVertex = new b2Vec2(Number.MAX_VALUE, Number.MAX_VALUE)
  		var minVertexX = Number.MAX_VALUE
  		var minVertexY = Number.MAX_VALUE
  		var maxVertexX = -Number.MAX_VALUE
  		var maxVertexY = -Number.MAX_VALUE
  		@m_maxRadius = 0.0
  		for (i = 0 i < @m_vertexCount ++i)
  		{
  			var v = @m_vertices[i]
  			//minVertex = b2Math.b2MinV(minVertex, @m_vertices[i])
  			minVertexX = Math.min(minVertexX, v.x)
  			minVertexY = Math.min(minVertexY, v.y)
  			//maxVertex = b2Math.b2MaxV(maxVertex, @m_vertices[i])
  			maxVertexX = Math.max(maxVertexX, v.x)
  			maxVertexY = Math.max(maxVertexY, v.y)
  			//@m_maxRadius = b2Max(@m_maxRadius, v.Length())
  			@m_maxRadius = Math.max(@m_maxRadius, v.Length())
  		}
  
  		@m_localOBB.R.SetIdentity()
  		//@m_localOBB.center = 0.5 * (minVertex + maxVertex)
  		@m_localOBB.center.Set((minVertexX + maxVertexX) * 0.5, (minVertexY + maxVertexY) * 0.5)
  		//@m_localOBB.extents = 0.5 * (maxVertex - minVertex)
  		@m_localOBB.extents.Set((maxVertexX - minVertexX) * 0.5, (maxVertexY - minVertexY) * 0.5)
  
  		// Compute the edge normals and next index map.
  		var i1 = 0
  		var i2 = 0
  		for (i = 0 i < @m_vertexCount ++i)
  		{
  			@m_normals[i] =  new b2Vec2()
  			i1 = i
  			i2 = i + 1 < @m_vertexCount ? i + 1 : 0
  			//b2Vec2 edge = @m_vertices[i2] - @m_vertices[i1]
  			//var edgeX = @m_vertices[i2].x - @m_vertices[i1].x
  			//var edgeY = @m_vertices[i2].y - @m_vertices[i1].y
  			//@m_normals[i] = b2Cross(edge, 1.0f)
  			@m_normals[i].x = @m_vertices[i2].y - @m_vertices[i1].y
  			@m_normals[i].y = -(@m_vertices[i2].x - @m_vertices[i1].x)
  			@m_normals[i].Normalize()
  		}
  
  		// Ensure the polygon in convex. TODO_ERIN compute convex hull.
  		for (i = 0 i < @m_vertexCount ++i)
  		{
  			i1 = i
  			i2 = i + 1 < @m_vertexCount ? i + 1 : 0
  
  			//b2Settings.b2Assert(b2Math.b2CrossVV(@m_normals[i1], @m_normals[i2]) > Number.MIN_VALUE)
  		}
  
  		@m_R.SetM(@m_body.m_R)
  		//@m_position.SetV( @m_body.m_position  + b2Mul(@m_body->@m_R, @m_localCentroid) )
  		@m_position.x = @m_body.m_position.x + (@m_R.col1.x * @m_localCentroid.x + @m_R.col2.x * @m_localCentroid.y)
  		@m_position.y = @m_body.m_position.y + (@m_R.col1.y * @m_localCentroid.x + @m_R.col2.y * @m_localCentroid.y)
  
  		//var R = b2Math.b2MulMM(@m_R, @m_localOBB.R)
  			//R.col1 = b2MulMV(@m_R, @m_localOBB.R.col1)
  			b2PolyShape.tAbsR.col1.x = @m_R.col1.x * @m_localOBB.R.col1.x + @m_R.col2.x * @m_localOBB.R.col1.y
  			b2PolyShape.tAbsR.col1.y = @m_R.col1.y * @m_localOBB.R.col1.x + @m_R.col2.y * @m_localOBB.R.col1.y
  			//R.col2 = b2MulMV(@m_R, @m_localOBB.R.col2)
  			b2PolyShape.tAbsR.col2.x = @m_R.col1.x * @m_localOBB.R.col2.x + @m_R.col2.x * @m_localOBB.R.col2.y
  			b2PolyShape.tAbsR.col2.y = @m_R.col1.y * @m_localOBB.R.col2.x + @m_R.col2.y * @m_localOBB.R.col2.y
  		//var absR = b2Math.b2AbsM(R)
  		b2PolyShape.tAbsR.Abs()
  
  		//h = b2Math.b2MulMV(b2PolyShape.tAbsR, @m_localOBB.extents)
  		hX = b2PolyShape.tAbsR.col1.x * @m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * @m_localOBB.extents.y
  		hY = b2PolyShape.tAbsR.col1.y * @m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * @m_localOBB.extents.y
  
  		//var position = @m_position + b2Mul(@m_R, @m_localOBB.center)
  		var positionX = @m_position.x + (@m_R.col1.x * @m_localOBB.center.x + @m_R.col2.x * @m_localOBB.center.y)
  		var positionY = @m_position.y + (@m_R.col1.y * @m_localOBB.center.x + @m_R.col2.y * @m_localOBB.center.y)
  
  		//aabb.minVertex = b2Math.SubtractVV(@m_position, h)
  		aabb.minVertex.x = positionX - hX
  		aabb.minVertex.y = positionY - hY
  		//aabb.maxVertex = b2Math.AddVV(@m_position, h)
  		aabb.maxVertex.x = positionX + hX
  		aabb.maxVertex.y = positionY + hY
  
  		var broadPhase = @m_body.m_world.m_broadPhase
  		if (broadPhase.InRange(aabb))
  		{
  			@m_proxyId = broadPhase.CreateProxy(aabb, @)
  		}
  		else
  		{
  			@m_proxyId = b2Pair.b2_nullProxy
  		}
  
  		if (@m_proxyId == b2Pair.b2_nullProxy)
  		{
  			@m_body.Freeze()
  		}
  	},
  
  	// Temp AABB for Synch function
  	syncAABB: new b2AABB(),
  	syncMat: new b2Mat22(),
  	Synchronize: function(position1, R1, position2, R2){
  		// The body transform is copied for convenience.
  		@m_R.SetM(R2)
  		//@m_position = @m_body->@m_position + b2Mul(@m_body->@m_R, @m_localCentroid)
  		@m_position.x = @m_body.m_position.x + (R2.col1.x * @m_localCentroid.x + R2.col2.x * @m_localCentroid.y)
  		@m_position.y = @m_body.m_position.y + (R2.col1.y * @m_localCentroid.x + R2.col2.y * @m_localCentroid.y)
  
  		if (@m_proxyId == b2Pair.b2_nullProxy)
  		{
  			return
  		}
  
  		//b2AABB aabb1, aabb2
  		var hX
  		var hY
  
  		//b2Mat22 obbR = b2Mul(R1, @m_localOBB.R)
  			var v1 = R1.col1
  			var v2 = R1.col2
  			var v3 = @m_localOBB.R.col1
  			var v4 = @m_localOBB.R.col2
  			//@syncMat.col1 = b2MulMV(R1, @m_localOBB.R.col1)
  			@syncMat.col1.x = v1.x * v3.x + v2.x * v3.y
  			@syncMat.col1.y = v1.y * v3.x + v2.y * v3.y
  			//@syncMat.col2 = b2MulMV(R1, @m_localOBB.R.col2)
  			@syncMat.col2.x = v1.x * v4.x + v2.x * v4.y
  			@syncMat.col2.y = v1.y * v4.x + v2.y * v4.y
  		//b2Mat22 absR = b2Abs(obbR)
  		@syncMat.Abs()
  		//b2Vec2 center = position1 + b2Mul(R1, @m_localCentroid + @m_localOBB.center)
  		hX = @m_localCentroid.x + @m_localOBB.center.x
  		hY = @m_localCentroid.y + @m_localOBB.center.y
  		var centerX = position1.x + (R1.col1.x * hX + R1.col2.x * hY)
  		var centerY = position1.y + (R1.col1.y * hX + R1.col2.y * hY)
  		//b2Vec2 h = b2Mul(@syncMat, @m_localOBB.extents)
  		hX = @syncMat.col1.x * @m_localOBB.extents.x + @syncMat.col2.x * @m_localOBB.extents.y
  		hY = @syncMat.col1.y * @m_localOBB.extents.x + @syncMat.col2.y * @m_localOBB.extents.y
  		//aabb1.minVertex = center - h
  		@syncAABB.minVertex.x = centerX - hX
  		@syncAABB.minVertex.y = centerY - hY
  		//aabb1.maxVertex = center + h
  		@syncAABB.maxVertex.x = centerX + hX
  		@syncAABB.maxVertex.y = centerY + hY
  
  		//b2Mat22 obbR = b2Mul(R2, @m_localOBB.R)
  			v1 = R2.col1
  			v2 = R2.col2
  			v3 = @m_localOBB.R.col1
  			v4 = @m_localOBB.R.col2
  			//@syncMat.col1 = b2MulMV(R1, @m_localOBB.R.col1)
  			@syncMat.col1.x = v1.x * v3.x + v2.x * v3.y
  			@syncMat.col1.y = v1.y * v3.x + v2.y * v3.y
  			//@syncMat.col2 = b2MulMV(R1, @m_localOBB.R.col2)
  			@syncMat.col2.x = v1.x * v4.x + v2.x * v4.y
  			@syncMat.col2.y = v1.y * v4.x + v2.y * v4.y
  		//b2Mat22 absR = b2Abs(obbR)
  		@syncMat.Abs()
  		//b2Vec2 center = position2 + b2Mul(R2, @m_localCentroid + @m_localOBB.center)
  		hX = @m_localCentroid.x + @m_localOBB.center.x
  		hY = @m_localCentroid.y + @m_localOBB.center.y
  		centerX = position2.x + (R2.col1.x * hX + R2.col2.x * hY)
  		centerY = position2.y + (R2.col1.y * hX + R2.col2.y * hY)
  		//b2Vec2 h = b2Mul(absR, @m_localOBB.extents)
  		hX = @syncMat.col1.x * @m_localOBB.extents.x + @syncMat.col2.x * @m_localOBB.extents.y
  		hY = @syncMat.col1.y * @m_localOBB.extents.x + @syncMat.col2.y * @m_localOBB.extents.y
  		//aabb2.minVertex = center - h
  		//aabb2.maxVertex = center + h
  
  		//aabb.minVertex = b2Min(aabb1.minVertex, aabb2.minVertex)
  		@syncAABB.minVertex.x = Math.min(@syncAABB.minVertex.x, centerX - hX)
  		@syncAABB.minVertex.y = Math.min(@syncAABB.minVertex.y, centerY - hY)
  		//aabb.maxVertex = b2Max(aabb1.maxVertex, aabb2.maxVertex)
  		@syncAABB.maxVertex.x = Math.max(@syncAABB.maxVertex.x, centerX + hX)
  		@syncAABB.maxVertex.y = Math.max(@syncAABB.maxVertex.y, centerY + hY)
  
  		var broadPhase = @m_body.m_world.m_broadPhase
  		if (broadPhase.InRange(@syncAABB))
  		{
  			broadPhase.MoveProxy(@m_proxyId, @syncAABB)
  		}
  		else
  		{
  			@m_body.Freeze()
  		}
  	},
  
  	QuickSync: function(position, R){
  		//@m_R = R
  		@m_R.SetM(R)
  		//@m_position = position + b2Mul(R, @m_localCentroid)
  		@m_position.x = position.x + (R.col1.x * @m_localCentroid.x + R.col2.x * @m_localCentroid.y)
  		@m_position.y = position.y + (R.col1.y * @m_localCentroid.x + R.col2.y * @m_localCentroid.y)
  	},
  
  	ResetProxy: function(broadPhase){
  
  		if (@m_proxyId == b2Pair.b2_nullProxy)
  		{
  			return
  		}
  
  		var proxy = broadPhase.GetProxy(@m_proxyId)
  
  		broadPhase.DestroyProxy(@m_proxyId)
  		proxy = null
  
  		var R = b2Math.b2MulMM(@m_R, @m_localOBB.R)
  		var absR = b2Math.b2AbsM(R)
  		var h = b2Math.b2MulMV(absR, @m_localOBB.extents)
  		//var position = @m_position + b2Mul(@m_R, @m_localOBB.center)
  		var position = b2Math.b2MulMV(@m_R, @m_localOBB.center)
  		position.Add(@m_position)
  
  		var aabb = new b2AABB()
  		//aabb.minVertex = position - h
  		aabb.minVertex.SetV(position)
  		aabb.minVertex.Subtract(h)
  		//aabb.maxVertex = position + h
  		aabb.maxVertex.SetV(position)
  		aabb.maxVertex.Add(h)
  
  		if (broadPhase.InRange(aabb))
  		{
  			@m_proxyId = broadPhase.CreateProxy(aabb, @)
  		}
  		else
  		{
  			@m_proxyId = b2Pair.b2_nullProxy
  		}
  
  		if (@m_proxyId == b2Pair.b2_nullProxy)
  		{
  			@m_body.Freeze()
  		}
  	},
  
  
  	Support: function(dX, dY, out)
  	{
  		//b2Vec2 dLocal = b2MulT(@m_R, d)
  		var dLocalX = (dX*@m_R.col1.x + dY*@m_R.col1.y)
  		var dLocalY = (dX*@m_R.col2.x + dY*@m_R.col2.y)
  
  		var bestIndex = 0
  		//float32 bestValue = b2Dot(@m_vertices[0], dLocal)
  		var bestValue = (@m_coreVertices[0].x * dLocalX + @m_coreVertices[0].y * dLocalY)
  		for (var i = 1 i < @m_vertexCount ++i)
  		{
  			//float32 value = b2Dot(@m_vertices[i], dLocal)
  			var value = (@m_coreVertices[i].x * dLocalX + @m_coreVertices[i].y * dLocalY)
  			if (value > bestValue)
  			{
  				bestIndex = i
  				bestValue = value
  			}
  		}
  
  		//return @m_position + b2Mul(@m_R, @m_vertices[bestIndex])
  		out.Set(	@m_position.x + (@m_R.col1.x * @m_coreVertices[bestIndex].x + @m_R.col2.x * @m_coreVertices[bestIndex].y),
  					@m_position.y + (@m_R.col1.y * @m_coreVertices[bestIndex].x + @m_R.col2.y * @m_coreVertices[bestIndex].y))
  
  	},
  
  
  	// Local position of the shape centroid in parent body frame.
  	m_localCentroid: new b2Vec2(),
  
  	// Local position oriented bounding box. The OBB center is relative to
  	// shape centroid.
  	m_localOBB: new b2OBB(),
  	m_vertices: null,
  	m_coreVertices: null,
  	m_vertexCount: 0,
  	m_normals: null})
  
  b2PolyShape.tempVec = new b2Vec2()
  b2PolyShape.tAbsR = new b2Mat22()*/

  provide("coffeebox2d", module.exports);

  (function($) {
    return $.ender({
      coffeebox2d: require('coffeebox2d')
    });
  })(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  !(function(timeout) {
    var _maxId, _timeouts;
    _timeouts = {};
    _maxId = 0;
    return timeout.timeout = function(name, delay, fn) {
      var args, data, resetTimeout;
      if (typeof name === 'string') {
        args = Array.prototype.slice.call(arguments, 3);
      } else {
        fn = delay;
        delay = name;
        name = "_timeout__" + (++_maxId);
      }
      if (name in _timeouts) {
        data = _timeouts[name];
        clearTimeout(data.id);
      } else {
        _timeouts[name] = data = {};
      }
      if (fn) {
        resetTimeout = function() {
          return data.id = setTimeout(data.fn, delay);
        };
        data.fn = __bind(function() {
          if (fn.apply(this, args) === true) {
            return resetTimeout();
          } else {
            return delete _timeouts[name];
          }
        }, this);
        resetTimeout();
        return name;
      } else {
        if (delay != null) {
          return data.fn();
        } else if (name in _timeouts) {
          return delete _timeouts[name];
        } else {
          return false;
        }
      }
    };
  })(typeof exports !== "undefined" && exports !== null ? exports : (this['timeout'] = {}));

  provide("timeout", module.exports);

  !(function($) {
    var timeout;
    timeout = require('timeout').timeout;
    $.ender({
      timeout: timeout
    });
    return $.ender({
      timeout: function() {
        timeout.apply(this, arguments);
        return this;
      }
    }, true);
  })(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  (function(wings) {
    var escapeXML, isArray, parse_re, renderRawTemplate, replaceBraces, restoreBraces, _ref;
    wings.strict = false;
    wings.renderTemplate = function(template, data, links) {
      template = replaceBraces(template);
      template = renderRawTemplate(template, data, links);
      template = restoreBraces(template);
      return template;
    };
    replaceBraces = function(template) {
      return template.replace(/\{\{/g, '\ufe5b').replace(/\}\}/g, '\ufe5d');
    };
    restoreBraces = function(template) {
      return template.replace(/\ufe5b/g, '{').replace(/\ufe5d/g, '}');
    };
    isArray = (_ref = Array.isArray) != null ? _ref : (function(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
    });
    escapeXML = function(s) {
      return s.toString().replace(/&(?!\w+;)|["<>]/g, function(s) {
        switch (s) {
          case '&':
            return '&amp;';
          case '"':
            return '\"';
          case '<':
            return '&lt;';
          case '>':
            return '&gt;';
          default:
            return s;
        }
      });
    };
    parse_re = /\s*\{([:!])\s*([^}]*?)\s*\}([\S\s]+?)\s*\{\/\s*\2\s*\}|\{(\#)\s*[\S\s]+?\s*\#\}|\{([@&]?)\s*([^}]*?)\s*\}/mg;
    return renderRawTemplate = function(template, data, links) {
      return template.replace(parse_re, function(all, section_op, section_name, section_content, comment_op, tag_op, tag_name) {
        var content, i, link, name, op, part, parts, rest, v, value, _len, _ref2;
        op = section_op || comment_op || tag_op;
        name = section_name || tag_name;
        content = section_content;
        switch (op) {
          case ':':
            value = data[name];
            if (!(value != null)) {
              if (wings.strict) {
                throw "Invalid section: " + (JSON.stringify(data)) + ": " + name;
              } else {
                return "";
              }
            } else if (isArray(value)) {
              parts = [];
              for (i = 0, _len = value.length; i < _len; i++) {
                v = value[i];
                v['#'] = i;
                parts.push(renderRawTemplate(content, v, links));
              }
              return parts.join('');
            } else if (typeof value === 'object') {
              return renderRawTemplate(content, value, links);
            } else if (typeof value === 'function') {
              return value.call(data, content);
            } else if (value) {
              return renderRawTemplate(content, data, links);
            } else {
              return "";
            }
            break;
          case '!':
            value = data[name];
            if (!(value != null)) {
              if (wings.strict) {
                throw "Invalid inverted section: " + (JSON.stringify(data)) + ": " + name;
              } else {
                return "";
              }
            } else if (!value || (isArray(value) && value.length === 0)) {
              return renderRawTemplate(content, data, links);
            } else {
              return "";
            }
            break;
          case '#':
            return '';
          case '@':
            link = links ? links[name] : null;
            if (!(link != null)) {
              if (wings.strict) {
                throw "Invalid link: " + (JSON.stringify(links)) + ": " + name;
              } else {
                return "";
              }
            } else if (typeof link === 'function') {
              link = link.call(data);
            }
            return renderRawTemplate(replaceBraces(link), data, links);
          case '&':
          case '':
            value = data;
            rest = name;
            while (value && rest) {
              _ref2 = rest.match(/^([^.]*)\.?(.*)$/), all = _ref2[0], part = _ref2[1], rest = _ref2[2];
              value = value[part];
            }
            if (!(value != null)) {
              if (wings.strict) {
                throw "Invalid value: " + (JSON.stringify(data)) + ": " + name;
              } else {
                return "";
              }
            } else if (typeof value === 'function') {
              value = value.call(data);
            }
            if (op === '&') {
              return value;
            } else {
              return escapeXML(value);
            }
          default:
            throw "Invalid section op: " + op;
        }
      });
    };
  })(typeof exports !== "undefined" && exports !== null ? exports : (this['wings'] = {}));

  provide("wings", module.exports);

  (function($) {
    var renderTemplate;
    renderTemplate = require('wings').renderTemplate;
    $.ender({
      renderTemplate: renderTemplate
    });
    return $.ender({
      render: function(data, links) {
        return renderTemplate(this[0].innerHTML, data, links);
      }
    }, true);
  })(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  
  (function(sel) {
    /* util.coffee
    */
    var attrPattern, checkNth, combinatorPattern, combine, contains, create, eachElement, elCmp, evaluate, extend, filter, filterDescendants, find, html, name, nextElementSibling, normalizeRoots, nthPattern, outerDescendants, parentMap, parse, parseSimple, pseudoPattern, select, selectorGroups, selectorPattern, synonym, tagPattern, _attrMap, _positionalPseudos, _ref;
    html = document.documentElement;
    extend = function(a, b) {
      var x, _i, _len;
      for (_i = 0, _len = b.length; _i < _len; _i++) {
        x = b[_i];
        a.push(x);
      }
      return a;
    };
    eachElement = function(el, first, next, fn) {
      el = el[first];
      while (el) {
        if (el.nodeType === 1) fn(el);
        el = el[next];
      }
    };
    nextElementSibling = html.nextElementSibling ? function(el) {
      return el.nextElementSibling;
    } : function(el) {
      el = el.nextSibling;
      while (el && el.nodeType !== 1) {
        el = el.nextSibling;
      }
      return el;
    };
    contains = html.compareDocumentPosition != null ? function(a, b) {
      return (a.compareDocumentPosition(b) & 16) === 16;
    } : html.contains != null ? function(a, b) {
      if (a.documentElement) {
        return b.ownerDocument === a;
      } else {
        return a !== b && a.contains(b);
      }
    } : function(a, b) {
      if (a.documentElement) return b.ownerDocument === a;
      while (b = b.parentNode) {
        if (a === b) return true;
      }
      return false;
    };
    elCmp = html.compareDocumentPosition ? function(a, b) {
      if (a === b) {
        return 0;
      } else if (a.compareDocumentPosition(b) & 4) {
        return -1;
      } else {
        return 1;
      }
    } : html.sourceIndex ? function(a, b) {
      if (a === b) {
        return 0;
      } else if (a.sourceIndex < b.sourceIndex) {
        return -1;
      } else {
        return 1;
      }
    } : void 0;
    filterDescendants = function(els) {
      return els.filter(function(el, i) {
        return el && !(i && (els[i - 1] === el || contains(els[i - 1], el)));
      });
    };
    outerDescendants = function(els) {
      var r;
      r = [];
      filterDescendants(els).forEach(function(el) {
        var parent;
        parent = el.parentNode;
        if (parent && parent !== r[r.length - 1]) r.push(parent);
      });
      return r;
    };
    combine = function(a, b, aRest, bRest, map) {
      var i, j, r;
      r = [];
      i = 0;
      j = 0;
      while (i < a.length && j < b.length) {
        switch (map[elCmp(a[i], b[j])]) {
          case -1:
            i++;
            break;
          case -2:
            j++;
            break;
          case 1:
            r.push(a[i++]);
            break;
          case 2:
            r.push(b[j++]);
            break;
          case 0:
            r.push(a[i++]);
            j++;
        }
      }
      if (aRest) {
        while (i < a.length) {
          r.push(a[i++]);
        }
      }
      if (bRest) {
        while (j < b.length) {
          r.push(b[j++]);
        }
      }
      return r;
    };
    sel.union = function(a, b) {
      return combine(a, b, true, true, {
        '0': 0,
        '-1': 1,
        '1': 2
      });
    };
    sel.intersection = function(a, b) {
      return combine(a, b, false, false, {
        '0': 0,
        '-1': -1,
        '1': -2
      });
    };
    sel.difference = function(a, b) {
      return combine(a, b, true, false, {
        '0': -1,
        '-1': 1,
        '1': -2
      });
    };
    /* find.coffee
    */
    _attrMap = {
      'tag': function(el) {
        return el.tagName;
      },
      'class': function(el) {
        return el.className;
      }
    };
    (function() {
      var p;
      p = document.createElement('p');
      p.innerHTML = '<a href="#"></a>';
      if (p.firstChild.getAttribute('href') !== '#') {
        _attrMap['href'] = function(el) {
          return el.getAttribute('href', 2);
        };
        return _attrMap['src'] = function(el) {
          return el.getAttribute('src', 2);
        };
      }
    })();
    _positionalPseudos = {
      'nth-child': false,
      'nth-of-type': false,
      'first-child': false,
      'first-of-type': false,
      'nth-last-child': true,
      'nth-last-of-type': true,
      'last-child': true,
      'last-of-type': true,
      'only-child': false,
      'only-of-type': false
    };
    find = function(e, roots) {
      var els;
      if (e.id) {
        els = [];
        roots.forEach(function(root) {
          var el;
          el = (root.ownerDocument || root).getElementById(e.id);
          if (el && contains(root, el)) els.push(el);
        });
        e.id = null;
      } else if (e.classes && html.getElementsByClassName) {
        els = roots.map(function(root) {
          return e.classes.map(function(cls) {
            return root.getElementsByClassName(cls);
          }).reduce(sel.union);
        }).reduce(extend, []);
        e.classes = null;
      } else {
        els = roots.map(function(root) {
          return root.getElementsByTagName(e.tag || '*');
        }).reduce(extend, []);
        e.tag = null;
      }
      if (els && els.length) {
        return filter(e, els);
      } else {
        return [];
      }
    };
    filter = function(e, els) {
      if (e.id) {
        els = els.filter(function(el) {
          return el.id === e.id;
        });
      }
      if (e.tag && e.tag !== '*') {
        els = els.filter(function(el) {
          return el.nodeName.toLowerCase() === e.tag;
        });
      }
      if (e.classes) {
        e.classes.forEach(function(cls) {
          els = els.filter(function(el) {
            return (" " + el.className + " ").indexOf(" " + cls + " ") >= 0;
          });
        });
      }
      if (e.attrs) {
        e.attrs.forEach(function(_arg) {
          var name, op, val;
          name = _arg.name, op = _arg.op, val = _arg.val;
          els = els.filter(function(el) {
            var attr, value;
            attr = _attrMap[name] ? _attrMap[name](el) : el.getAttribute(name);
            value = attr + "";
            return (attr || (el.attributes && el.attributes[name] && el.attributes[name].specified)) && (!op ? true : op === '=' ? value === val : op === '!=' ? value !== val : op === '*=' ? value.indexOf(val) >= 0 : op === '^=' ? value.indexOf(val) === 0 : op === '$=' ? value.substr(value.length - val.length) === val : op === '~=' ? (" " + value + " ").indexOf(" " + val + " ") >= 0 : op === '|=' ? value === val || (value.indexOf(val) === 0 && value.charAt(val.length) === '-') : false);
          });
        });
      }
      if (e.pseudos) {
        e.pseudos.forEach(function(_arg) {
          var filtered, first, name, next, pseudo, val;
          name = _arg.name, val = _arg.val;
          pseudo = sel.pseudos[name];
          if (!pseudo) throw new Error("no pseudo with name: " + name);
          if (name in _positionalPseudos) {
            first = _positionalPseudos[name] ? 'lastChild' : 'firstChild';
            next = _positionalPseudos[name] ? 'previousSibling' : 'nextSibling';
            els.forEach(function(el) {
              var indices, parent;
              if ((parent = el.parentNode) && parent._sel_children === void 0) {
                indices = {
                  '*': 0
                };
                eachElement(parent, first, next, function(el) {
                  el._sel_index = ++indices['*'];
                  el._sel_indexOfType = indices[el.nodeName] = (indices[el.nodeName] || 0) + 1;
                });
                parent._sel_children = indices;
              }
            });
          }
          filtered = els.filter(function(el) {
            return pseudo(el, val);
          });
          if (name in _positionalPseudos) {
            els.forEach(function(el) {
              var parent;
              if ((parent = el.parentNode) && parent._sel_children !== void 0) {
                eachElement(parent, first, next, function(el) {
                  el._sel_index = el._sel_indexOfType = void 0;
                });
                parent._sel_children = void 0;
              }
            });
          }
          els = filtered;
        });
      }
      return els;
    };
    /* pseudos.coffee
    */
    nthPattern = /\s*((?:\+|\-)?(\d*))n\s*((?:\+|\-)\s*\d+)?\s*/;
    checkNth = function(i, val) {
      var a, b, m;
      if (!val) {
        return false;
      } else if (isFinite(val)) {
        return i == val;
      } else if (val === 'even') {
        return i % 2 === 0;
      } else if (val === 'odd') {
        return i % 2 === 1;
      } else if (m = nthPattern.exec(val)) {
        a = m[2] ? parseInt(m[1]) : parseInt(m[1] + '1');
        b = m[3] ? parseInt(m[3].replace(/\s*/, '')) : 0;
        if (!a) {
          return i === b;
        } else {
          return ((i - b) % a === 0) && ((i - b) / a >= 0);
        }
      } else {
        throw new Error('invalid nth expression');
      }
    };
    sel.pseudos = {
      'first-child': function(el) {
        return el._sel_index === 1;
      },
      'only-child': function(el) {
        return el._sel_index === 1 && el.parentNode._sel_children['*'] === 1;
      },
      'nth-child': function(el, val) {
        return checkNth(el._sel_index, val);
      },
      'first-of-type': function(el) {
        return el._sel_indexOfType === 1;
      },
      'only-of-type': function(el) {
        return el._sel_indexOfType === 1 && el.parentNode._sel_children[el.nodeName] === 1;
      },
      'nth-of-type': function(el, val) {
        return checkNth(el._sel_indexOfType, val);
      },
      target: function(el) {
        return el.getAttribute('id') === location.hash.substr(1);
      },
      checked: function(el) {
        return el.checked === true;
      },
      enabled: function(el) {
        return el.disabled === false;
      },
      disabled: function(el) {
        return el.disabled === true;
      },
      selected: function(el) {
        return el.selected === true;
      },
      focus: function(el) {
        return el.ownerDocument.activeElement === el;
      },
      empty: function(el) {
        return !el.childNodes.length;
      },
      contains: function(el, val) {
        var _ref;
        return ((_ref = el.textContent) != null ? _ref : el.innerText).indexOf(val) >= 0;
      },
      "with": function(el, val) {
        return select(val, [el]).length > 0;
      },
      without: function(el, val) {
        return select(val, [el]).length === 0;
      }
    };
    _ref = {
      'has': 'with',
      'last-child': 'first-child',
      'nth-last-child': 'nth-child',
      'last-of-type': 'first-of-type',
      'nth-last-of-type': 'nth-of-type'
    };
    for (synonym in _ref) {
      name = _ref[synonym];
      sel.pseudos[synonym] = sel.pseudos[name];
    }
    /* parser.coffee
    */
    attrPattern = /\[\s*([-\w]+)\s*(?:([~|^$*!]?=)\s*(?:([-\w]+)|['"]([^'"]*)['"])\s*)?\]/g;
    pseudoPattern = /::?([-\w]+)(?:\((\([^()]+\)|[^()]+)\))?/g;
    combinatorPattern = /^\s*([,+~])/;
    selectorPattern = RegExp("^(?:\\s*(>))?\\s*(?:(\\*|\\w+))?(?:\\#([-\\w]+))?(?:\\.([-\\.\\w]+))?((?:" + attrPattern.source + ")*)((?:" + pseudoPattern.source + ")*)");
    selectorGroups = {
      type: 1,
      tag: 2,
      id: 3,
      classes: 4,
      attrsAll: 5,
      pseudosAll: 10
    };
    parse = function(selector) {
      var e, last, result;
      result = last = parseSimple(selector);
      if (last.compound) last.children = [];
      while (last[0].length < selector.length) {
        selector = selector.substr(last[0].length);
        e = parseSimple(selector);
        if (e.compound) {
          e.children = [result];
          result = e;
        } else if (last.compound) {
          last.children.push(e);
        } else {
          last.child = e;
        }
        last = e;
      }
      return result;
    };
    parseSimple = function(selector) {
      var e, group, name;
      if (e = combinatorPattern.exec(selector)) {
        e.compound = true;
        e.type = e[1];
      } else if (e = selectorPattern.exec(selector)) {
        e.simple = true;
        for (name in selectorGroups) {
          group = selectorGroups[name];
          e[name] = e[group];
        }
        e.type || (e.type = ' ');
        if (e.tag) e.tag = e.tag.toLowerCase();
        if (e.classes) e.classes = e.classes.toLowerCase().split('.');
        if (e.attrsAll) {
          e.attrs = [];
          e.attrsAll.replace(attrPattern, function(all, name, op, val, quotedVal) {
            e.attrs.push({
              name: name,
              op: op,
              val: val || quotedVal
            });
            return "";
          });
        }
        if (e.pseudosAll) {
          e.pseudos = [];
          e.pseudosAll.replace(pseudoPattern, function(all, name, val) {
            if (name === 'not') {
              e.not = parse(val);
            } else {
              e.pseudos.push({
                name: name,
                val: val
              });
            }
            return "";
          });
        }
      } else {
        throw new Error("Parse error at: " + selector);
      }
      return e;
    };
    /* eval.coffee
    */
    evaluate = function(e, roots) {
      var els, outerRoots, sibs;
      els = [];
      if (roots.length) {
        switch (e.type) {
          case ' ':
          case '>':
            outerRoots = filterDescendants(roots);
            els = find(e, outerRoots);
            if (e.type === '>') {
              roots.forEach(function(el) {
                el._sel_mark = true;
              });
              els = els.filter(function(el) {
                if ((el = el.parentNode)) return el._sel_mark;
              });
              roots.forEach(function(el) {
                el._sel_mark = false;
              });
            }
            if (e.not) els = sel.difference(els, find(e.not, outerRoots));
            if (e.child) els = evaluate(e.child, els);
            break;
          case '+':
          case '~':
          case ',':
            if (e.children.length === 2) {
              sibs = evaluate(e.children[0], roots);
              els = evaluate(e.children[1], roots);
            } else {
              sibs = roots;
              roots = outerDescendants(roots);
              els = evaluate(e.children[0], roots);
            }
            if (e.type === ',') {
              els = sel.union(sibs, els);
            } else if (e.type === '+') {
              sibs.forEach(function(el) {
                if ((el = nextElementSibling(el))) el._sel_mark = true;
              });
              els = els.filter(function(el) {
                return el._sel_mark;
              });
              sibs.forEach(function(el) {
                if ((el = nextElementSibling(el))) el._sel_mark = void 0;
              });
            } else if (e.type === '~') {
              sibs.forEach(function(el) {
                while ((el = nextElementSibling(el)) && !el._sel_mark) {
                  el._sel_mark = true;
                }
              });
              els = els.filter(function(el) {
                return el._sel_mark;
              });
              sibs.forEach(function(el) {
                while ((el = nextElementSibling(el)) && el._sel_mark) {
                  el._sel_mark = void 0;
                }
              });
            }
        }
      }
      return els;
    };
    /* select.coffee
    */
    parentMap = {
      thead: 'table',
      tbody: 'table',
      tfoot: 'table',
      tr: 'tbody',
      th: 'tr',
      td: 'tr',
      fieldset: 'form',
      option: 'select'
    };
    tagPattern = /^\s*<([^\s>]+)/;
    create = function(html, root) {
      var els, parent;
      parent = (root || document).createElement(parentMap[tagPattern.exec(html)[1]] || 'div');
      parent.innerHTML = html;
      els = [];
      eachElement(parent, 'firstChild', 'nextSibling', function(el) {
        return els.push(el);
      });
      return els;
    };
    select = document.querySelector && document.querySelectorAll ? function(selector, roots) {
      try {
        return roots.map(function(root) {
          return root.querySelectorAll(selector);
        }).reduce(extend, []);
      } catch (e) {
        return evaluate(parse(selector), roots);
      }
    } : function(selector, roots) {
      return evaluate(parse(selector), roots);
    };
    normalizeRoots = function(roots) {
      if (!roots) {
        return [document];
      } else if (typeof roots === 'string') {
        return select(roots, [document]);
      } else if (typeof roots === 'object' && isFinite(roots.length)) {
        if (roots.sort) roots.sort(elCmp);
        return filterDescendants(roots);
      } else {
        return [roots];
      }
    };
    sel.sel = function(selector, _roots) {
      var roots;
      roots = normalizeRoots(_roots);
      if (!selector) {
        return [];
      } else if (Array.isArray(selector)) {
        return selector;
      } else if (tagPattern.test(selector)) {
        return create(selector, roots[0]);
      } else if (selector === window || selector === 'window') {
        return [window];
      } else if (selector === document || selector === 'document') {
        return [document];
      } else if (selector.nodeType === 1) {
        if (!_roots || roots.some(function(root) {
          return contains(root, selector);
        })) {
          return [selector];
        } else {
          return [];
        }
      } else {
        return select(selector, roots);
      }
    };
    return sel.matching = function(els, selector) {
      return filter(parse(selector), els);
    };
  })(typeof exports !== "undefined" && exports !== null ? exports : (this['sel'] = {}));
  

  provide("sel", module.exports);

  
  (function($) {
    var methods, sel;
    sel = require('sel');
    $._select = sel.sel;
    methods = {
      find: function(s) {
        return $(s, this);
      },
      union: function(s, r) {
        return $(sel.union(this, sel.sel(s, r)));
      },
      difference: function(s, r) {
        return $(sel.difference(this, sel.sel(s, r)));
      },
      intersection: function(s, r) {
        return $(sel.intersection(this, sel.sel(s, r)));
      },
      matching: function(s) {
        return $(sel.matching(this, s));
      },
      is: function(s, r) {
        return sel.intersection(this, sel.sel(s, r)).length > 0;
      }
    };
    methods.and = methods.union;
    methods.not = methods.difference;
    $.pseudos = sel.pseudos;
    return $.ender(methods, true);
  })(ender);
  

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*
      http://www.JSON.org/json2.js
      2011-02-23
  
      Public Domain.
  
      NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
  
      See http://www.JSON.org/js.html
  
  
      This code should be minified before deployment.
      See http://javascript.crockford.com/jsmin.html
  
      USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
      NOT CONTROL.
  
  
      This file creates a global JSON object containing two methods: stringify
      and parse.
  
          JSON.stringify(value, replacer, space)
              value       any JavaScript value, usually an object or array.
  
              replacer    an optional parameter that determines how object
                          values are stringified for objects. It can be a
                          function or an array of strings.
  
              space       an optional parameter that specifies the indentation
                          of nested structures. If it is omitted, the text will
                          be packed without extra whitespace. If it is a number,
                          it will specify the number of spaces to indent at each
                          level. If it is a string (such as '\t' or '&nbsp;'),
                          it contains the characters used to indent at each level.
  
              This method produces a JSON text from a JavaScript value.
  
              When an object value is found, if the object contains a toJSON
              method, its toJSON method will be called and the result will be
              stringified. A toJSON method does not serialize: it returns the
              value represented by the name/value pair that should be serialized,
              or undefined if nothing should be serialized. The toJSON method
              will be passed the key associated with the value, and this will be
              bound to the value
  
              For example, this would serialize Dates as ISO strings.
  
                  Date.prototype.toJSON = function (key) {
                      function f(n) {
                          // Format integers to have at least two digits.
                          return n < 10 ? '0' + n : n;
                      }
  
                      return this.getUTCFullYear()   + '-' +
                           f(this.getUTCMonth() + 1) + '-' +
                           f(this.getUTCDate())      + 'T' +
                           f(this.getUTCHours())     + ':' +
                           f(this.getUTCMinutes())   + ':' +
                           f(this.getUTCSeconds())   + 'Z';
                  };
  
              You can provide an optional replacer method. It will be passed the
              key and value of each member, with this bound to the containing
              object. The value that is returned from your method will be
              serialized. If your method returns undefined, then the member will
              be excluded from the serialization.
  
              If the replacer parameter is an array of strings, then it will be
              used to select the members to be serialized. It filters the results
              such that only members with keys listed in the replacer array are
              stringified.
  
              Values that do not have JSON representations, such as undefined or
              functions, will not be serialized. Such values in objects will be
              dropped; in arrays they will be replaced with null. You can use
              a replacer function to replace those with JSON values.
              JSON.stringify(undefined) returns undefined.
  
              The optional space parameter produces a stringification of the
              value that is filled with line breaks and indentation to make it
              easier to read.
  
              If the space parameter is a non-empty string, then that string will
              be used for indentation. If the space parameter is a number, then
              the indentation will be that many spaces.
  
              Example:
  
              text = JSON.stringify(['e', {pluribus: 'unum'}]);
              // text is '["e",{"pluribus":"unum"}]'
  
  
              text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
              // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
  
              text = JSON.stringify([new Date()], function (key, value) {
                  return this[key] instanceof Date ?
                      'Date(' + this[key] + ')' : value;
              });
              // text is '["Date(---current time---)"]'
  
  
          JSON.parse(text, reviver)
              This method parses a JSON text to produce an object or array.
              It can throw a SyntaxError exception.
  
              The optional reviver parameter is a function that can filter and
              transform the results. It receives each of the keys and values,
              and its return value is used instead of the original value.
              If it returns what it received, then the structure is not modified.
              If it returns undefined then the member is deleted.
  
              Example:
  
              // Parse the text. Values that look like ISO date strings will
              // be converted to Date objects.
  
              myData = JSON.parse(text, function (key, value) {
                  var a;
                  if (typeof value === 'string') {
                      a =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                      if (a) {
                          return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                              +a[5], +a[6]));
                      }
                  }
                  return value;
              });
  
              myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                  var d;
                  if (typeof value === 'string' &&
                          value.slice(0, 5) === 'Date(' &&
                          value.slice(-1) === ')') {
                      d = new Date(value.slice(5, -1));
                      if (d) {
                          return d;
                      }
                  }
                  return value;
              });
  
  
      This is a reference implementation. You are free to copy, modify, or
      redistribute.
  */
  
  /*jslint evil: true, strict: false, regexp: false */
  
  /*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
      call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
      getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
      lastIndex, length, parse, prototype, push, replace, slice, stringify,
      test, toJSON, toString, valueOf
  */
  
  
  // Create a JSON object only if one does not already exist. We create the
  // methods in a closure to avoid creating global variables.
  
  !function (context) {
      "use strict";
  
      var JSON;
      if (context.JSON) {
          return;
      } else {
          context['JSON'] = JSON = {};
      }
  
      function f(n) {
          // Format integers to have at least two digits.
          return n < 10 ? '0' + n : n;
      }
  
      if (typeof Date.prototype.toJSON !== 'function') {
  
          Date.prototype.toJSON = function (key) {
  
              return isFinite(this.valueOf()) ?
                  this.getUTCFullYear()     + '-' +
                  f(this.getUTCMonth() + 1) + '-' +
                  f(this.getUTCDate())      + 'T' +
                  f(this.getUTCHours())     + ':' +
                  f(this.getUTCMinutes())   + ':' +
                  f(this.getUTCSeconds())   + 'Z' : null;
          };
  
          String.prototype.toJSON      =
              Number.prototype.toJSON  =
              Boolean.prototype.toJSON = function (key) {
                  return this.valueOf();
              };
      }
  
      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          gap,
          indent,
          meta = {    // table of character substitutions
              '\b': '\\b',
              '\t': '\\t',
              '\n': '\\n',
              '\f': '\\f',
              '\r': '\\r',
              '"' : '\\"',
              '\\': '\\\\'
          },
          rep;
  
  
      function quote(string) {
  
  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.
  
          escapable.lastIndex = 0;
          return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
              var c = meta[a];
              return typeof c === 'string' ? c :
                  '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) + '"' : '"' + string + '"';
      }
  
  
      function str(key, holder) {
  
  // Produce a string from holder[key].
  
          var i,          // The loop counter.
              k,          // The member key.
              v,          // The member value.
              length,
              mind = gap,
              partial,
              value = holder[key];
  
  // If the value has a toJSON method, call it to obtain a replacement value.
  
          if (value && typeof value === 'object' &&
                  typeof value.toJSON === 'function') {
              value = value.toJSON(key);
          }
  
  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.
  
          if (typeof rep === 'function') {
              value = rep.call(holder, key, value);
          }
  
  // What happens next depends on the value's type.
  
          switch (typeof value) {
          case 'string':
              return quote(value);
  
          case 'number':
  
  // JSON numbers must be finite. Encode non-finite numbers as null.
  
              return isFinite(value) ? String(value) : 'null';
  
          case 'boolean':
          case 'null':
  
  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.
  
              return String(value);
  
  // If the type is 'object', we might be dealing with an object or an array or
  // null.
  
          case 'object':
  
  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.
  
              if (!value) {
                  return 'null';
              }
  
  // Make an array to hold the partial results of stringifying this object value.
  
              gap += indent;
              partial = [];
  
  // Is the value an array?
  
              if (Object.prototype.toString.apply(value) === '[object Array]') {
  
  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.
  
                  length = value.length;
                  for (i = 0; i < length; i += 1) {
                      partial[i] = str(i, value) || 'null';
                  }
  
  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.
  
                  v = partial.length === 0 ? '[]' : gap ?
                      '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                      '[' + partial.join(',') + ']';
                  gap = mind;
                  return v;
              }
  
  // If the replacer is an array, use it to select the members to be stringified.
  
              if (rep && typeof rep === 'object') {
                  length = rep.length;
                  for (i = 0; i < length; i += 1) {
                      if (typeof rep[i] === 'string') {
                          k = rep[i];
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              } else {
  
  // Otherwise, iterate through all of the keys in the object.
  
                  for (k in value) {
                      if (Object.prototype.hasOwnProperty.call(value, k)) {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              }
  
  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.
  
              v = partial.length === 0 ? '{}' : gap ?
                  '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                  '{' + partial.join(',') + '}';
              gap = mind;
              return v;
          }
      }
  
  // If the JSON object does not yet have a stringify method, give it one.
  
      if (typeof JSON.stringify !== 'function') {
          JSON.stringify = function (value, replacer, space) {
  
  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.
  
              var i;
              gap = '';
              indent = '';
  
  // If the space parameter is a number, make an indent string containing that
  // many spaces.
  
              if (typeof space === 'number') {
                  for (i = 0; i < space; i += 1) {
                      indent += ' ';
                  }
  
  // If the space parameter is a string, it will be used as the indent string.
  
              } else if (typeof space === 'string') {
                  indent = space;
              }
  
  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.
  
              rep = replacer;
              if (replacer && typeof replacer !== 'function' &&
                      (typeof replacer !== 'object' ||
                      typeof replacer.length !== 'number')) {
                  throw new Error('JSON.stringify');
              }
  
  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.
  
              return str('', {'': value});
          };
      }
  
  
  // If the JSON object does not yet have a parse method, give it one.
  
      if (typeof JSON.parse !== 'function') {
          JSON.parse = function (text, reviver) {
  
  // The parse method takes a text and an optional reviver function, and returns
  // a JavaScript value if the text is a valid JSON text.
  
              var j;
  
              function walk(holder, key) {
  
  // The walk method is used to recursively walk the resulting structure so
  // that modifications can be made.
  
                  var k, v, value = holder[key];
                  if (value && typeof value === 'object') {
                      for (k in value) {
                          if (Object.prototype.hasOwnProperty.call(value, k)) {
                              v = walk(value, k);
                              if (v !== undefined) {
                                  value[k] = v;
                              } else {
                                  delete value[k];
                              }
                          }
                      }
                  }
                  return reviver.call(holder, key, value);
              }
  
  
  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.
  
              text = String(text);
              cx.lastIndex = 0;
              if (cx.test(text)) {
                  text = text.replace(cx, function (a) {
                      return '\\u' +
                          ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                  });
              }
  
  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.
  
  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
  
              if (/^[\],:{}\s]*$/
                      .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                          .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
  
  // In the third stage we use the eval function to compile the text into a
  // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
  // in JavaScript: it can begin a block or an object literal. We wrap the text
  // in parens to eliminate the ambiguity.
  
                  j = eval('(' + text + ')');
  
  // In the optional fourth stage, we recursively walk the new structure, passing
  // each name/value pair to a reviver function for possible transformation.
  
                  return typeof reviver === 'function' ?
                      walk({'': j}, '') : j;
              }
  
  // If the text is not JSON parseable, then a SyntaxError is thrown.
  
              throw new SyntaxError('JSON.parse');
          };
      }
  }(this);

  provide("ender-json", module.exports);

  !(function($) {
      return $.ender({
          JSON: JSON
      });
  })(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  (function(hashchange) {
    var Fragment, HashEvent, HashIFrame, HashTimer, IFragment, fragment, ifragment, impl;
    fragment = new (Fragment = (function() {
      function Fragment() {}
      Fragment.prototype.get = function(win) {
        var hash;
        if (win == null) {
          win = window;
        }
        hash = win.location.hash.replace(/^#/, '');
        return this.decode(hash);
      };
      Fragment.prototype.set = function(hash, win) {
        if (win == null) {
          win = window;
        }
        return win.location.hash = this.encode(hash);
      };
      Fragment.prototype.encode = function(hash) {
        return encodeURI(hash).replace(/#/, '%23');
      };
      Fragment.prototype.decode = function(hash) {
        try {
          if ($.browser.firefox) {
            return hash;
          } else {
            return decodeURI(hash.replace(/%23/, '#'));
          }
        } catch (e) {
          return hash;
        }
      };
      return Fragment;
    })());
    ifragment = new (IFragment = (function() {
      function IFragment() {}
      IFragment.prototype._id = "__history";
      IFragment.prototype.init = function() {
        this.iframe = $('<iframe src="javascript:false" />');
        this.iframe.attr('id', this._id);
        this.iframe.css('display', 'none');
        return $('body').prepend(this.iframe);
      };
      IFragment.prototype.set = function(hash) {
        this.iframe.contentDocument.open();
        this.iframe.contentDocument.close();
        return fragment.set(hash, this.iframe.contentWindow);
      };
      IFragment.prototype.get = function() {
        return fragment.get(this.iframe.contentWindow);
      };
      return IFragment;
    })());
    HashTimer = (function() {
      HashTimer.prototype.delay = 100;
      function HashTimer() {
        $(document).ready(__bind(function() {
          return this._init();
        }, this));
      }
      HashTimer.prototype._init = function() {
        this.hash = fragment.get();
        return $.doTimeout(this.delay, __bind(function() {
          return this.check();
        }, this));
      };
      HashTimer.prototype._check = function() {
        var hash;
        hash = fragment.get();
        if (hash !== this.hash) {
          this.hash = hash;
          $(window).fire('hashchange');
        }
        return true;
      };
      HashTimer.prototype.set = function(hash) {
        if (hash !== this.hash) {
          fragment.set(hash);
          this.hash = hash;
          return $(window).fire('hashchange');
        }
      };
      return HashTimer;
    })();
    HashIFrame = (function() {
      __extends(HashIFrame, HashTimer);
      function HashIFrame() {
        HashIFrame.__super__.constructor.apply(this, arguments);
      }
      HashIFrame.prototype._init = function() {
        HashIFrame.__super__._init.call(this);
        ifragment.init();
        return ifragment.set(this.hash);
      };
      HashIFrame.prototype._check = function() {
        var hash, ihash;
        hash = fragment.get();
        ihash = ifragment.get();
        if (hash !== ihash) {
          if (hash === this.hash) {
            this.hash = ihash;
            fragment.set(this.hash);
          } else {
            this.hash = hash;
            ifragment.set(this.hash);
          }
          $(window).fire('hashchange');
        }
        return true;
      };
      HashIFrame.prototype.set = function(hash) {
        if (hash !== this.hash) {
          ifragment.set(hash);
          return HashIFrame.__super__.set.call(this, hash);
        }
      };
      return HashIFrame;
    })();
    HashEvent = (function() {
      function HashEvent() {}
      HashEvent.prototype.set = function(hash) {
        return fragment.set(hash);
      };
      return HashEvent;
    })();
    if ('onhashchange' in window) {
      impl = new HashEvent;
    } else if ($.browser.msie && $.browser.version < 8) {
      impl = new HashIframe;
    } else {
      impl = new HashTimer;
    }
    return hashchange.hash = function(hash) {
      if (hash != null) {
        return impl.set(hash);
      } else {
        return fragment.get();
      }
    };
  })(typeof exports !== "undefined" && exports !== null ? exports : (this['hashchange'] = {}));

  provide("hashchange", module.exports);

  !(function($) {
    return $.ender({
      hash: require('hashchange').hash
    });
  })(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

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

  provide("route", module.exports);

  (function($) {
    return $.ender({
      route: require('route')
    });
  })(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  !(function(upload) {
    var lastId, reqwest, timeout;
    reqwest = require('reqwest');
    timeout = require('timeout');
    lastId = 0;
    upload.isubmit = function(o) {
      var form, id, iframe, loaded;
      id = '__upload_iframe_' + lastId++;
      iframe = $('<iframe src="javascript:false" />');
      iframe.attr('id', id);
      iframe.attr('name', id);
      iframe.css('display', 'none');
      form = $('<form method="post" enctype="multipart/form-data" />');
      form.attr('action', o.url);
      form.attr('target', id);
      $('body').append(iframe);
      $('body').append(form);
      loaded = false;
      iframe.bind('load', function() {
        var data, doc;
        data = null;
        doc = $(iframe[0].contentDocument);
        if (!iframe.parent().length || (doc.length && doc.text() === 'false')) {
          if (o.error) {
            o.error(iframe);
          }
          return;
        }
        try {
          data = JSON.parse(doc.text());
        } catch (e) {
          if (o.error) {
            o.error(iframe, e);
          }
        }
        if (o.success) {
          o.success(data, iframe);
        }
        $.timeout(1, function() {
          return iframe.remove();
        });
        return loaded = true;
      });
      if (o.timeout) {
        timeout.timeout(o.timeout, function() {
          if (!loaded) {
            iframe.attr('src', 'javascript:false').remove();
            if (o.error) {
              return o.error(iframe, 'Timeout');
            }
          }
        });
      }
      form.append(o.inputs);
      form.submit();
      return form.remove();
    };
    return upload.upload = function(o) {
      var _ref;
      o.method = 'POST';
      o.type = 'json';
      o.processData = false;
      if ((_ref = o.headers) == null) {
        o.headers = {};
      }
      o.headers['X-File-Name'] = encodeURIComponent(o.data.name);
      o.headers['Content-Type'] = 'application/octet-stream';
      return $.ajax(o);
    };
  })(typeof exports !== "undefined" && exports !== null ? exports : (this['upload'] = {}));

  provide("upload", module.exports);

  !(function($) {
    var upload;
    upload = require('upload');
    return $.ender({
      isubmit: upload.isubmit,
      upload: upload.upload
    });
  })(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  (function(jar) {
    return jar.cookie = function(name, value, options) {
      var cookie, date, domain, expires, m, path, secure, _i, _len, _ref;
      if (options == null) {
        options = {};
      }
      if (value !== void 0) {
        if (value === null) {
          value = '';
          options.expires = -1;
        }
        if (options.expires) {
          if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
          } else if (typeof options.expires === 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            options.expires = date.toUTCString();
          }
        }
        expires = (options.expires ? " expires=" + options.expires : '');
        path = (options.path ? " path=" + options.path : '');
        domain = (options.domain ? " domain=" + options.domain : '');
        secure = (options.secure ? ' secure' : '');
        return document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
      } else {
        _ref = document.cookie.split(/;\s/g);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cookie = _ref[_i];
          m = cookie.match(/(\w+)=(.*)/);
          if (Array.isArray(m)) {
            if (m[1] === name) {
              try {
                return decodeURIComponent(m[2]);
              } catch (e) {
                break;
              }
            }
          }
        }
        return null;
      }
    };
  })(typeof exports !== "undefined" && exports !== null ? exports : (this['jar'] = {}));

  provide("jar", module.exports);

  (function($) {
    return $.ender({
      cookie: require('jar').cookie
    });
  })(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Bowser - a browser detector
    * https://github.com/ded/bowser
    * MIT License | (c) Dustin Diaz 2011
    */
  !function (name, definition) {
    if (typeof define == 'function') define(definition)
    else if (typeof module != 'undefined' && module.exports) module.exports['browser'] = definition()
    else this[name] = definition()
  }('bowser', function () {
    /**
      * navigator.userAgent =>
      * Chrome:  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.57 Safari/534.24"
      * Opera:   "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.7; U; en) Presto/2.7.62 Version/11.01"
      * Safari:  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"
      * IE:      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)"
      * Firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0) Gecko/20100101 Firefox/4.0"
      * iPhone:  "Mozilla/5.0 (iPhone Simulator; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5"
      * iPad:    "Mozilla/5.0 (iPad; U; CPU OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5", 
      * Android: "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; T-Mobile G2 Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
      */
  
    var ua = navigator.userAgent
      , t = true
      , ie = /msie/i.test(ua)
      , chrome = /chrome/i.test(ua)
      , safari = /safari/i.test(ua) && !chrome
      , iphone = /iphone/i.test(ua)
      , ipad = /ipad/i.test(ua)
      , android = /android/i.test(ua)
      , opera = /opera/i.test(ua)
      , firefox = /firefox/i.test(ua)
      , gecko = /gecko\//i.test(ua)
      , webkitVersion = /version\/(\d+(\.\d+)?)/i
  
    function detect() {
  
      if (ie) return {
          msie: t
        , version: ua.match(/msie (\d+(\.\d+)?);/i)[1]
      }
      if (chrome) return {
          webkit: t
        , chrome: t
        , version: ua.match(/chrome\/(\d+(\.\d+)?)/i)[1]
      }
      if (iphone) return {
          webkit: t
        , iphone: t
        , mobile: t
        , ios: t
        , version: ua.match(webkitVersion)[1]
      }
      if (ipad) return {
          webkit: t
        , ipad: t
        , mobile: t
        , ios: t
        , version: ua.match(webkitVersion)[1]
      }
      if (android) return {
          webkit: t
        , android: t
        , mobile: t
        , version: ua.match(webkitVersion)[1]
      }
      if (safari) return {
          webkit: t
        , safari: t
        , version: ua.match(webkitVersion)[1]
      }
      if (opera) return {
          opera: t
        , version: ua.match(webkitVersion)[1]
      }
      if (gecko) {
        var o = {
            gecko: t
          , mozilla: t
          , version: ua.match(/firefox\/(\d+(\.\d+)?)/i)[1]
        }
        if (firefox) o.firefox = t
        return o
      }
  
    }
  
    var bowser = detect()
  
    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if ((bowser.msie && bowser.version >= 6) ||
        (bowser.chrome && bowser.version >= 10) ||
        (bowser.firefox && bowser.version >= 4.0) ||
        (bowser.safari && bowser.version >= 5) ||
        (bowser.opera && bowser.version >= 10.0)) {
      bowser.a = t;
    }
  
    else if ((bowser.msie && bowser.version < 6) ||
        (bowser.chrome && bowser.version < 10) ||
        (bowser.firefox && bowser.version < 4.0) ||
        (bowser.safari && bowser.version < 5) ||
        (bowser.opera && bowser.version < 10.0)) {
      bowser.c = t
    } else bowser.x = t
  
    return bowser
  })
  

  provide("bowser", module.exports);

  $.ender(module.exports);

}();