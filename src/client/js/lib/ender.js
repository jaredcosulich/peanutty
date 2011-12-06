/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build es5-basic domready sel bonzo bean morpheus reqwest hashchange route timeout upload wings jar ender-json
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
    select = false && document.querySelector && document.querySelectorAll ? function(selector, roots) {
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