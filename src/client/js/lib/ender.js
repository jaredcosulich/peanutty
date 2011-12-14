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

  var __hasProp = Object.prototype.hasOwnProperty;
  
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
        if (i in this) fn.call(that, val, i, this);
      }
    };
  }
  
  if (!Array.prototype.map) {
    Array.prototype.map = function(fn, that) {
      var i, val, _len, _results;
      _results = [];
      for (i = 0, _len = this.length; i < _len; i++) {
        val = this[i];
        if (i in this) _results.push(fn.call(that, val, i, this));
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
        if (i in this && fn.call(that, val, i, this)) _results.push(val);
      }
      return _results;
    };
  }
  
  if (!Array.prototype.some) {
    Array.prototype.some = function(fn, that) {
      var i, val, _len;
      for (i = 0, _len = this.length; i < _len; i++) {
        val = this[i];
        if (i in this) if (fn.call(that, val, i, this)) return true;
      }
      return false;
    };
  }
  
  if (!Array.prototype.every) {
    Array.prototype.every = function(fn, that) {
      var i, val, _len;
      for (i = 0, _len = this.length; i < _len; i++) {
        val = this[i];
        if (i in this) if (!fn.call(that, val, i, this)) return false;
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
        if (i in this) result = fn.call(null, result, this[i], i, this);
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
        if (i in this) result = fn.call(null, result, this[i], i, this);
        i--;
      }
      return result;
    };
  }
  
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(value) {
      var i, _ref;
      i = (_ref = arguments[1]) != null ? _ref : 0;
      if (i < 0) i += length;
      i = Math.max(i, 0);
      while (i < this.length) {
        if (i in this) if (this[i] === value) return i;
        i++;
      }
      return -1;
    };
  }
  
  if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(value) {
      var i;
      i = arguments[1] || this.length;
      if (i < 0) i += length;
      i = Math.min(i, this.length - 1);
      while (i >= 0) {
        if (i in this) if (this[i] === value) return i;
        i--;
      }
      return -1;
    };
  }
  
  if (!Object.keys) {
    Object.keys = function(obj) {
      var key, _results;
      _results = [];
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        _results.push(key);
      }
      return _results;
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
      var r = [], i = 0, j = 0, k, item, inIt
      for (; item = ar[i]; ++i) {
        inIt = false
        for (k = 0; k < r.length; ++k) {
          if (r[k] === item) {
            inIt = true; break
          }
        }
        if (!inIt) r[j++] = item
      }
      return r
    }
  
    $.ender({
      parents: function (selector, closest) {
        var collection = $(selector), j, k, p, r = []
        for (j = 0, k = this.length; j < k; j++) {
          p = this[j]
          while (p = p.parentNode) {
            if (~indexOf(collection, p)) {
              r.push(p)
              if (closest) break;
            }
          }
        }
        return $(uniq(r))
      },
  
      closest: function (selector) {
        return this.parents(selector, true)
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
  
      siblings: function () {
        var i, l, p, r = []
        for (i = 0, l = this.length; i < l; i++) {
          p = this[i]
          while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
          p = this[i]
          while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
        }
        return $(r)
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
    return b2Settings;
  })();
  b2Settings.b2Assert = function(a) {
    if (!a) {
      vnullVec;
      return nullVec.x++;
    }
  };
  b2Settings.USHRT_MAX = 0x0000ffff;
  b2Settings.b2_pi = Math.PI;
  b2Settings.b2_massUnitsPerKilogram = 1.0;
  b2Settings.b2_timeUnitsPerSecond = 1.0;
  b2Settings.b2_lengthUnitsPerMeter = 30.0;
  b2Settings.b2_maxManifoldPoints = 2;
  b2Settings.b2_maxShapesPerBody = 64;
  b2Settings.b2_maxPolyVertices = 256;
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
    return isFinite(x);
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
  var b2BoundValues;
  exports.b2BoundValues = b2BoundValues = b2BoundValues = (function() {
    b2BoundValues.prototype.lowerValues = [0, 0];
    b2BoundValues.prototype.upperValues = [0, 0];
    function b2BoundValues() {
      this.lowerValues = [0, 0];
      this.upperValues = [0, 0];
    }
    return b2BoundValues;
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
    b2PairManager.prototype.m_broadPhase = null;
    b2PairManager.prototype.m_callback = null;
    b2PairManager.prototype.m_pairs = null;
    b2PairManager.prototype.m_freePair = 0;
    b2PairManager.prototype.m_pairCount = 0;
    b2PairManager.prototype.m_pairBuffer = null;
    b2PairManager.prototype.m_pairBufferCount = 0;
    b2PairManager.prototype.m_hashTable = null;
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
    b2PairManager.prototype.RemoveBufferedPair = function(proxyId1, proxyId2) {
      var pair;
      pair = this.Find(proxyId1, proxyId2);
      if (pair == null) {
        return;
      }
      if (pair.IsBuffered() === false) {
        pair.SetBuffered();
        this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = pair.proxyId1;
        this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = pair.proxyId2;
        ++this.m_pairBufferCount;
      }
      pair.SetRemoved();
      if (b2BroadPhase.s_validate) {
        return this.ValidateBuffer();
      }
    };
    b2PairManager.prototype.AddPair = function(proxyId1, proxyId2) {
      var hash, pIndex, pair, temp;
      if (proxyId1 > proxyId2) {
        temp = proxyId1;
        proxyId1 = proxyId2;
        proxyId2 = temp;
      }
      hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
      pair = pair = this.FindHash(proxyId1, proxyId2, hash);
      if (pair !== null) {
        return pair;
      }
      pIndex = this.m_freePair;
      pair = this.m_pairs[pIndex];
      this.m_freePair = pair.next;
      pair.proxyId1 = proxyId1;
      pair.proxyId2 = proxyId2;
      pair.status = 0;
      pair.userData = null;
      pair.next = this.m_hashTable[hash];
      this.m_hashTable[hash] = pIndex;
      ++this.m_pairCount;
      return pair;
    };
    b2PairManager.prototype.RemovePair = function(proxyId1, proxyId2) {
      var hash, index, node, pNode, pair, temp, userData;
      if (proxyId1 > proxyId2) {
        temp = proxyId1;
        proxyId1 = proxyId2;
        proxyId2 = temp;
      }
      hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
      node = this.m_hashTable[hash];
      pNode = null;
      while (node !== b2Pair.b2_nullPair) {
        if (b2PairManager.Equals(this.m_pairs[node], proxyId1, proxyId2)) {
          index = node;
          if (pNode) {
            pNode.next = this.m_pairs[node].next;
          } else {
            this.m_hashTable[hash] = this.m_pairs[node].next;
          }
          pair = this.m_pairs[index];
          userData = pair.userData;
          pair.next = this.m_freePair;
          pair.proxyId1 = b2Pair.b2_nullProxy;
          pair.proxyId2 = b2Pair.b2_nullProxy;
          pair.userData = null;
          pair.status = 0;
          this.m_freePair = index;
          --this.m_pairCount;
          return userData;
        } else {
          pNode = this.m_pairs[node];
          node = pNode.next;
        }
      }
      return null;
    };
    b2PairManager.prototype.Find = function(proxyId1, proxyId2) {
      var hash, temp;
      if (proxyId1 > proxyId2) {
        temp = proxyId1;
        proxyId1 = proxyId2;
        proxyId2 = temp;
      }
      hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
      return this.FindHash(proxyId1, proxyId2, hash);
    };
    b2PairManager.prototype.FindHash = function(proxyId1, proxyId2, hash) {
      var index;
      index = this.m_hashTable[hash];
      while (index !== b2Pair.b2_nullPair && b2PairManager.Equals(this.m_pairs[index], proxyId1, proxyId2) === false) {
        index = this.m_pairs[index].next;
      }
      if (index === b2Pair.b2_nullPair) {
        return null;
      }
      return this.m_pairs[index];
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
  b2PairManager.Hash = function(proxyId1, proxyId2) {
    var key;
    key = ((proxyId2 << 16) & 0xffff0000) | proxyId1;
    key = ~key + ((key << 15) & 0xFFFF8000);
    key = key ^ ((key >> 12) & 0x000fffff);
    key = key + ((key << 2) & 0xFFFFFFFC);
    key = key ^ ((key >> 4) & 0x0fffffff);
    key = key * 2057;
    key = key ^ ((key >> 16) & 0x0000ffff);
    return key;
  };
  b2PairManager.Equals = function(pair, proxyId1, proxyId2) {
    return pair.proxyId1 === proxyId1 && pair.proxyId2 === proxyId2;
  };
  b2PairManager.EqualsPair = function(pair1, pair2) {
    return pair1.proxyId1 === pair2.proxyId1 && pair1.proxyId2 === pair2.proxyId2;
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
    b2BroadPhase.prototype.GetProxy = function(proxyId) {
      if (proxyId === b2Pair.b2_nullProxy || this.m_proxyPool[proxyId].IsValid() === false) {
        rerturn(null);
      }
      return this.m_proxyPool[proxyId];
    };
    b2BroadPhase.prototype.CreateProxy = function(aabb, userData) {
      var axis, boundCount, bounds, i, index, j, lowerIndex, lowerIndexOut, lowerValues, proxy, proxy2, proxyId, tArr, tBound1, tBound2, tEnd, tIndex, upperIndex, upperIndexOut, upperValues, _ref;
      proxyId = this.m_freeProxy;
      proxy = this.m_proxyPool[proxyId];
      this.m_freeProxy = proxy.GetNext();
      proxy.overlapCount = 0;
      proxy.userData = userData;
      boundCount = 2 * this.m_proxyCount;
      lowerValues = new Array();
      upperValues = new Array();
      this.ComputeBounds(lowerValues, upperValues, aabb);
      for (axis = 0; axis < 2; axis++) {
        bounds = this.m_bounds[axis];
        lowerIndex = 0;
        upperIndex = 0;
        lowerIndexOut = [lowerIndex];
        upperIndexOut = [upperIndex];
        this.Query(lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis);
        lowerIndex = lowerIndexOut[0];
        upperIndex = upperIndexOut[0];
        tArr = new Array();
        tEnd = boundCount - upperIndex;
        for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
          tArr[j] = new b2Bound();
          tBound1 = tArr[j];
          tBound2 = bounds[upperIndex + j];
          tBound1.value = tBound2.value;
          tBound1.proxyId = tBound2.proxyId;
          tBound1.stabbingCount = tBound2.stabbingCount;
        }
        tEnd = tArr.length;
        tIndex = upperIndex + 2;
        for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
          tBound2 = tArr[j];
          tBound1 = bounds[tIndex + j];
          tBound1.value = tBound2.value;
          tBound1.proxyId = tBound2.proxyId;
          tBound1.stabbingCount = tBound2.stabbingCount;
        }
        tArr = new Array();
        tEnd = upperIndex - lowerIndex;
        for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
          tArr[j] = new b2Bound();
          tBound1 = tArr[j];
          tBound2 = bounds[lowerIndex + j];
          tBound1.value = tBound2.value;
          tBound1.proxyId = tBound2.proxyId;
          tBound1.stabbingCount = tBound2.stabbingCount;
        }
        tEnd = tArr.length;
        tIndex = lowerIndex + 1;
        for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
          tBound2 = tArr[j];
          tBound1 = bounds[tIndex + j];
          tBound1.value = tBound2.value;
          tBound1.proxyId = tBound2.proxyId;
          tBound1.stabbingCount = tBound2.stabbingCount;
        }
        ++upperIndex;
        bounds[lowerIndex].value = lowerValues[axis];
        bounds[lowerIndex].proxyId = proxyId;
        bounds[upperIndex].value = upperValues[axis];
        bounds[upperIndex].proxyId = proxyId;
        bounds[lowerIndex].stabbingCount = lowerIndex === 0 ? 0 : bounds[lowerIndex - 1].stabbingCount;
        bounds[upperIndex].stabbingCount = bounds[upperIndex - 1].stabbingCount;
        index = lowerIndex;
        while (index < upperIndex) {
          bounds[index].stabbingCount++;
          ++index;
        }
        index = lowerIndex;
        while (index < boundCount + 2) {
          proxy2 = this.m_proxyPool[bounds[index].proxyId];
          if (bounds[index].IsLower()) {
            proxy2.lowerBounds[axis] = index;
          } else {
            proxy2.upperBounds[axis] = index;
          }
          ++index;
        }
      }
      ++this.m_proxyCount;
      for (i = 0, _ref = this.m_queryResultCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.m_pairManager.AddBufferedPair(proxyId, this.m_queryResults[i]);
      }
      this.m_pairManager.Commit();
      this.m_queryResultCount = 0;
      this.IncrementTimeStamp();
      return proxyId;
    };
    b2BroadPhase.prototype.DestroyProxy = function(proxyId) {
      var axis, boundCount, bounds, i, index, index2, j, lowerIndex, lowerValue, proxy, proxy2, tArr, tBound1, tBound2, tEnd, tIndex, upperIndex, upperValue, _ref;
      proxy = this.m_proxyPool[proxyId];
      boundCount = 2 * this.m_proxyCount;
      for (axis = 0; axis < 2; axis++) {
        bounds = this.m_bounds[axis];
        lowerIndex = proxy.lowerBounds[axis];
        upperIndex = proxy.upperBounds[axis];
        lowerValue = bounds[lowerIndex].value;
        upperValue = bounds[upperIndex].value;
        tArr = new Array();
        j = 0;
        tEnd = upperIndex - lowerIndex - 1;
        tBound1;
        tBound2;
        for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
          tArr[j] = new b2Bound();
          tBound1 = tArr[j];
          tBound2 = bounds[lowerIndex + 1 + j];
          tBound1.value = tBound2.value;
          tBound1.proxyId = tBound2.proxyId;
          tBound1.stabbingCount = tBound2.stabbingCount;
        }
        tEnd = tArr.length;
        tIndex = lowerIndex;
        for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
          tBound2 = tArr[j];
          tBound1 = bounds[tIndex + j];
          tBound1.value = tBound2.value;
          tBound1.proxyId = tBound2.proxyId;
          tBound1.stabbingCount = tBound2.stabbingCount;
        }
        tArr = new Array();
        tEnd = boundCount - upperIndex - 1;
        for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
          tArr[j] = new b2Bound();
          tBound1 = tArr[j];
          tBound2 = bounds[upperIndex + 1 + j];
          tBound1.value = tBound2.value;
          tBound1.proxyId = tBound2.proxyId;
          tBound1.stabbingCount = tBound2.stabbingCount;
        }
        tEnd = tArr.length;
        tIndex = upperIndex - 1;
        for (j = 0; 0 <= tEnd ? j < tEnd : j > tEnd; 0 <= tEnd ? j++ : j--) {
          tBound2 = tArr[j];
          tBound1 = bounds[tIndex + j];
          tBound1.value = tBound2.value;
          tBound1.proxyId = tBound2.proxyId;
          tBound1.stabbingCount = tBound2.stabbingCount;
        }
        tEnd = boundCount - 2;
        index = lowerIndex;
        while (index < tEnd) {
          proxy2 = this.m_proxyPool[bounds[index].proxyId];
          if (bounds[index].IsLower()) {
            proxy2.lowerBounds[axis] = index;
          } else {
            proxy2.upperBounds[axis] = index;
          }
          ++index;
        }
        tEnd = upperIndex - 1;
        index2 = lowerIndex;
        while (index2 < tEnd) {
          bounds[index2].stabbingCount--;
          ++index2;
        }
        this.Query([0], [0], lowerValue, upperValue, bounds, boundCount - 2, axis);
      }
      for (i = 0, _ref = this.m_queryResultCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.m_pairManager.RemoveBufferedPair(proxyId, this.m_queryResults[i]);
      }
      this.m_pairManager.Commit();
      this.m_queryResultCount = 0;
      this.IncrementTimeStamp();
      proxy.userData = null;
      proxy.overlapCount = b2BroadPhase.b2_invalid;
      proxy.lowerBounds[0] = b2BroadPhase.b2_invalid;
      proxy.lowerBounds[1] = b2BroadPhase.b2_invalid;
      proxy.upperBounds[0] = b2BroadPhase.b2_invalid;
      proxy.upperBounds[1] = b2BroadPhase.b2_invalid;
      proxy.SetNext(this.m_freeProxy);
      this.m_freeProxy = proxyId;
      return --this.m_proxyCount;
    };
    b2BroadPhase.prototype.MoveProxy = function(proxyId, aabb) {
      var axis, bound, boundCount, bounds, deltaLower, deltaUpper, index, lowerIndex, lowerValue, newValues, nextBound, nextProxy, nextProxyId, oldValues, prevBound, prevProxy, prevProxyId, proxy, upperIndex, upperValue, _results;
      axis = 0;
      index = 0;
      nextProxyId = 0;
      if (proxyId === b2Pair.b2_nullProxy || b2Settings.b2_maxProxies <= proxyId) {
        return;
      }
      if (aabb.IsValid() === false) {
        return;
      }
      boundCount = 2 * this.m_proxyCount;
      proxy = this.m_proxyPool[proxyId];
      newValues = new b2BoundValues();
      this.ComputeBounds(newValues.lowerValues, newValues.upperValues, aabb);
      oldValues = new b2BoundValues();
      for (axis = 0; axis < 2; axis++) {
        oldValues.lowerValues[axis] = this.m_bounds[axis][proxy.lowerBounds[axis]].value;
        oldValues.upperValues[axis] = this.m_bounds[axis][proxy.upperBounds[axis]].value;
      }
      _results = [];
      for (axis = 0; axis < 2; axis++) {
        bounds = this.m_bounds[axis];
        lowerIndex = proxy.lowerBounds[axis];
        upperIndex = proxy.upperBounds[axis];
        lowerValue = newValues.lowerValues[axis];
        upperValue = newValues.upperValues[axis];
        deltaLower = lowerValue - bounds[lowerIndex].value;
        deltaUpper = upperValue - bounds[upperIndex].value;
        bounds[lowerIndex].value = lowerValue;
        bounds[upperIndex].value = upperValue;
        if (deltaLower < 0) {
          index = lowerIndex;
          while (index > 0 && lowerValue < bounds[index - 1].value) {
            bound = bounds[index];
            prevBound = bounds[index - 1];
            prevProxyId = prevBound.proxyId;
            prevProxy = this.m_proxyPool[prevBound.proxyId];
            prevBound.stabbingCount++;
            if (prevBound.IsUpper() === true) {
              if (this.TestOverlap(newValues, prevProxy)) {
                this.m_pairManager.AddBufferedPair(proxyId, prevProxyId);
              }
              prevProxy.upperBounds[axis]++;
              bound.stabbingCount++;
            } else {
              prevProxy.lowerBounds[axis]++;
              bound.stabbingCount--;
            }
            proxy.lowerBounds[axis]--;
            bound.Swap(prevBound);
            --index;
          }
        }
        if (deltaUpper > 0) {
          index = upperIndex;
          while (index < boundCount - 1 && bounds[index + 1].value <= upperValue) {
            bound = bounds[index];
            nextBound = bounds[index + 1];
            nextProxyId = nextBound.proxyId;
            nextProxy = this.m_proxyPool[nextProxyId];
            nextBound.stabbingCount++;
            if (nextBound.IsLower() === true) {
              if (this.TestOverlap(newValues, nextProxy)) {
                this.m_pairManager.AddBufferedPair(proxyId, nextProxyId);
              }
              nextProxy.lowerBounds[axis]--;
              bound.stabbingCount++;
            } else {
              nextProxy.upperBounds[axis]--;
              bound.stabbingCount--;
            }
            proxy.upperBounds[axis]++;
            bound.Swap(nextBound);
            index++;
          }
        }
        if (deltaLower > 0) {
          index = lowerIndex;
          while (index < boundCount - 1 && bounds[index + 1].value <= lowerValue) {
            bound = bounds[index];
            nextBound = bounds[index + 1];
            nextProxyId = nextBound.proxyId;
            nextProxy = this.m_proxyPool[nextProxyId];
            nextBound.stabbingCount--;
            if (nextBound.IsUpper()) {
              if (this.TestOverlap(oldValues, nextProxy)) {
                this.m_pairManager.RemoveBufferedPair(proxyId, nextProxyId);
              }
              nextProxy.upperBounds[axis]--;
              bound.stabbingCount--;
            } else {
              nextProxy.lowerBounds[axis]--;
              bound.stabbingCount++;
            }
            proxy.lowerBounds[axis]++;
            bound.Swap(nextBound);
            index++;
          }
        }
        _results.push((function() {
          var _results2;
          if (deltaUpper < 0) {
            index = upperIndex;
            _results2 = [];
            while (index > 0 && upperValue < bounds[index - 1].value) {
              bound = bounds[index];
              prevBound = bounds[index - 1];
              prevProxyId = prevBound.proxyId;
              prevProxy = this.m_proxyPool[prevProxyId];
              prevBound.stabbingCount--;
              if (prevBound.IsLower() === true) {
                if (this.TestOverlap(oldValues, prevProxy)) {
                  this.m_pairManager.RemoveBufferedPair(proxyId, prevProxyId);
                }
                prevProxy.lowerBounds[axis]++;
                bound.stabbingCount--;
              } else {
                prevProxy.upperBounds[axis]++;
                bound.stabbingCount++;
              }
              proxy.upperBounds[axis]--;
              bound.Swap(prevBound);
              _results2.push(index--);
            }
            return _results2;
          }
        }).call(this));
      }
      return _results;
    };
    b2BroadPhase.prototype.Commit = function() {
      return this.m_pairManager.Commit();
    };
    b2BroadPhase.prototype.ComputeBounds = function(lowerValues, upperValues, aabb) {
      var maxVertexX, maxVertexY, minVertexX, minVertexY;
      minVertexX = aabb.minVertex.x;
      minVertexY = aabb.minVertex.y;
      minVertexX = b2Math.b2Min(minVertexX, this.m_worldAABB.maxVertex.x);
      minVertexY = b2Math.b2Min(minVertexY, this.m_worldAABB.maxVertex.y);
      minVertexX = b2Math.b2Max(minVertexX, this.m_worldAABB.minVertex.x);
      minVertexY = b2Math.b2Max(minVertexY, this.m_worldAABB.minVertex.y);
      maxVertexX = aabb.maxVertex.x;
      maxVertexY = aabb.maxVertex.y;
      maxVertexX = b2Math.b2Min(maxVertexX, this.m_worldAABB.maxVertex.x);
      maxVertexY = b2Math.b2Min(maxVertexY, this.m_worldAABB.maxVertex.y);
      maxVertexX = b2Math.b2Max(maxVertexX, this.m_worldAABB.minVertex.x);
      maxVertexY = b2Math.b2Max(maxVertexY, this.m_worldAABB.minVertex.y);
      lowerValues[0] = (this.m_quantizationFactor.x * (minVertexX - this.m_worldAABB.minVertex.x)) & (b2Settings.USHRT_MAX - 1);
      upperValues[0] = ((this.m_quantizationFactor.x * (maxVertexX - this.m_worldAABB.minVertex.x)) & 0x0000ffff) | 1;
      lowerValues[1] = (this.m_quantizationFactor.y * (minVertexY - this.m_worldAABB.minVertex.y)) & (b2Settings.USHRT_MAX - 1);
      return upperValues[1] = ((this.m_quantizationFactor.y * (maxVertexY - this.m_worldAABB.minVertex.y)) & 0x0000ffff) | 1;
    };
    b2BroadPhase.prototype.TestOverlapValidate = function(p1, p2) {
      var axis, bounds;
      for (axis = 0; axis < 2; axis++) {
        bounds = this.m_bounds[axis];
        if (bounds[p1.lowerBounds[axis]].value > bounds[p2.upperBounds[axis]].value) {
          return false;
        }
        if (bounds[p1.upperBounds[axis]].value < bounds[p2.lowerBounds[axis]].value) {
          return false;
        }
      }
      return true;
    };
    b2BroadPhase.prototype.TestOverlap = function(b, p) {
      var axis, bounds;
      for (axis = 0; axis < 2; axis++) {
        bounds = this.m_bounds[axis];
        if (b.lowerValues[axis] > bounds[p.upperBounds[axis]].value) {
          return false;
        }
        if (b.upperValues[axis] < bounds[p.lowerBounds[axis]].value) {
          return false;
        }
      }
      return true;
    };
    b2BroadPhase.prototype.Query = function(lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis) {
      var i, j, lowerQuery, proxy, s, upperQuery;
      lowerQuery = b2BroadPhase.BinarySearch(bounds, boundCount, lowerValue);
      upperQuery = b2BroadPhase.BinarySearch(bounds, boundCount, upperValue);
      j = lowerQuery;
      while (j < upperQuery) {
        if (bounds[j].IsLower()) {
          this.IncrementOverlapCount(bounds[j].proxyId);
        }
        ++j;
      }
      if (lowerQuery > 0) {
        i = lowerQuery - 1;
        s = bounds[i].stabbingCount;
        while (s) {
          if (bounds[i].IsLower()) {
            proxy = this.m_proxyPool[bounds[i].proxyId];
            if (lowerQuery <= proxy.upperBounds[axis]) {
              this.IncrementOverlapCount(bounds[i].proxyId);
              --s;
            }
          }
          --i;
        }
      }
      lowerQueryOut[0] = lowerQuery;
      return upperQueryOut[0] = upperQuery;
    };
    b2BroadPhase.prototype.IncrementOverlapCount = function(proxyId) {
      var proxy;
      proxy = this.m_proxyPool[proxyId];
      if (proxy.timeStamp < this.m_timeStamp) {
        proxy.timeStamp = this.m_timeStamp;
        return proxy.overlapCount = 1;
      } else {
        proxy.overlapCount = 2;
        this.m_queryResults[this.m_queryResultCount] = proxyId;
        return ++this.m_queryResultCount;
      }
    };
    b2BroadPhase.prototype.IncrementTimeStamp = function() {
      var i, _ref;
      if (this.m_timeStamp === b2Settings.USHRT_MAX) {
        for (i = 0, _ref = b2Settings.b2_maxProxies; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          this.m_proxyPool[i].timeStamp = 0;
        }
        return this.m_timeStamp = 1;
      } else {
        return ++this.m_timeStamp;
      }
    };
    return b2BroadPhase;
  })();
  b2BroadPhase.s_validate = false;
  b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX;
  b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX;
  b2BroadPhase.BinarySearch = function(bounds, count, value) {
    var high, low, mid;
    low = 0;
    high = count - 1;
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      if (bounds[mid].value > value) {
        high = mid - 1;
      } else if (bounds[mid].value < value) {
        low = mid + 1;
      } else {
        return mid;
      }
    }
    return low;
  };
  
  var b2Collision;
  exports.b2Collision = b2Collision = b2Collision = (function() {
    function b2Collision() {}
    return b2Collision;
  })();
  b2Collision.b2_nullFeature = 0x000000ff;
  b2Collision.ClipSegmentToLine = function(vOut, vIn, normal, offset) {
    var distance0, distance1, interp, numOut, tVec, vIn0, vIn1;
    numOut = 0;
    vIn0 = vIn[0].v;
    vIn1 = vIn[1].v;
    distance0 = b2Math.b2Dot(normal, vIn[0].v) - offset;
    distance1 = b2Math.b2Dot(normal, vIn[1].v) - offset;
    if (distance0 <= 0.0) {
      vOut[numOut++] = vIn[0];
    }
    if (distance1 <= 0.0) {
      vOut[numOut++] = vIn[1];
    }
    if (distance0 * distance1 < 0.0) {
      interp = distance0 / (distance0 - distance1);
      tVec = vOut[numOut].v;
      tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
      tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
      if (distance0 > 0.0) {
        vOut[numOut].id = vIn[0].id;
      } else {
        vOut[numOut].id = vIn[1].id;
      }
      ++numOut;
    }
    return numOut;
  };
  b2Collision.EdgeSeparation = function(poly1, edge1, poly2) {
    var count2, dot, i, minDot, normalLocal2X, normalLocal2Y, normalX, normalY, separation, tMat, tVec, tX, v1X, v1Y, v2X, v2Y, vert1s, vert2s, vertexIndex2;
    vert1s = poly1.m_vertices;
    count2 = poly2.m_vertexCount;
    vert2s = poly2.m_vertices;
    normalX = poly1.m_normals[edge1].x;
    normalY = poly1.m_normals[edge1].y;
    tX = normalX;
    tMat = poly1.m_R;
    normalX = tMat.col1.x * tX + tMat.col2.x * normalY;
    normalY = tMat.col1.y * tX + tMat.col2.y * normalY;
    normalLocal2X = normalX;
    normalLocal2Y = normalY;
    tMat = poly2.m_R;
    tX = normalLocal2X * tMat.col1.x + normalLocal2Y * tMat.col1.y;
    normalLocal2Y = normalLocal2X * tMat.col2.x + normalLocal2Y * tMat.col2.y;
    normalLocal2X = tX;
    vertexIndex2 = 0;
    minDot = Number.MAX_VALUE;
    for (i = 0; 0 <= count2 ? i < count2 : i > count2; 0 <= count2 ? i++ : i--) {
      tVec = vert2s[i];
      dot = tVec.x * normalLocal2X + tVec.y * normalLocal2Y;
      if (dot < minDot) {
        minDot = dot;
        vertexIndex2 = i;
      }
    }
    tMat = poly1.m_R;
    v1X = poly1.m_position.x + (tMat.col1.x * vert1s[edge1].x + tMat.col2.x * vert1s[edge1].y);
    v1Y = poly1.m_position.y + (tMat.col1.y * vert1s[edge1].x + tMat.col2.y * vert1s[edge1].y);
    tMat = poly2.m_R;
    v2X = poly2.m_position.x + (tMat.col1.x * vert2s[vertexIndex2].x + tMat.col2.x * vert2s[vertexIndex2].y);
    v2Y = poly2.m_position.y + (tMat.col1.y * vert2s[vertexIndex2].x + tMat.col2.y * vert2s[vertexIndex2].y);
    v2X -= v1X;
    v2Y -= v1Y;
    separation = v2X * normalX + v2Y * normalY;
    return separation;
  };
  b2Collision.FindMaxSeparation = function(edgeIndex, poly1, poly2, conservative) {
    var bestEdge, bestSeparation, count1, dLocal1X, dLocal1Y, dX, dY, dot, edge, i, increment, maxDot, nextEdge, prevEdge, s, sNext, sPrev;
    count1 = poly1.m_vertexCount;
    dX = poly2.m_position.x - poly1.m_position.x;
    dY = poly2.m_position.y - poly1.m_position.y;
    dLocal1X = dX * poly1.m_R.col1.x + dY * poly1.m_R.col1.y;
    dLocal1Y = dX * poly1.m_R.col2.x + dY * poly1.m_R.col2.y;
    edge = 0;
    maxDot = -Number.MAX_VALUE;
    for (i = 0; 0 <= count1 ? i < count1 : i > count1; 0 <= count1 ? i++ : i--) {
      dot = poly1.m_normals[i].x * dLocal1X + poly1.m_normals[i].y * dLocal1Y;
      if (dot > maxDot) {
        maxDot = dot;
        edge = i;
      }
    }
    s = b2Collision.EdgeSeparation(poly1, edge, poly2);
    if (s > 0.0 && conservative === false) {
      return s;
    }
    prevEdge = edge - 1 >= 0 ? edge - 1 : count1 - 1;
    sPrev = b2Collision.EdgeSeparation(poly1, prevEdge, poly2);
    if (sPrev > 0.0 && conservative === false) {
      return sPrev;
    }
    nextEdge = edge + 1 < count1 ? edge + 1 : 0;
    sNext = b2Collision.EdgeSeparation(poly1, nextEdge, poly2);
    if (sNext > 0.0 && conservative === false) {
      return sNext;
    }
    bestEdge = 0;
    increment = 0;
    if (sPrev > s && sPrev > sNext) {
      increment = -1;
      bestEdge = prevEdge;
      bestSeparation = sPrev;
    } else if (sNext > s) {
      increment = 1;
      bestEdge = nextEdge;
      bestSeparation = sNext;
    } else {
      edgeIndex[0] = edge;
      return s;
    }
    while (true) {
      if (increment === -1) {
        edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
      } else {
        edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;
      }
      s = b2Collision.EdgeSeparation(poly1, edge, poly2);
      if (s > 0.0 && conservative === false) {
        return s;
      }
      if (s > bestSeparation) {
        bestEdge = edge;
        bestSeparation = s;
      } else {
        break;
      }
    }
    edgeIndex[0] = bestEdge;
    return bestSeparation;
  };
  b2Collision.FindIncidentEdge = function(c, poly1, edge1, poly2) {
    var count1, count2, dot, i, i1, i2, invLength, minDot, normal1Local1X, normal1Local1Y, normal1Local2X, normal1Local2Y, normal1X, normal1Y, normal2Local2X, normal2Local2Y, tClip, tMat, tVec, tX, vert1s, vert2s, vertex11, vertex12, vertex21, vertex22;
    count1 = poly1.m_vertexCount;
    vert1s = poly1.m_vertices;
    count2 = poly2.m_vertexCount;
    vert2s = poly2.m_vertices;
    vertex11 = edge1;
    vertex12 = edge1 + 1 === count1 ? 0 : edge1 + 1;
    tVec = vert1s[vertex12];
    normal1Local1X = tVec.x;
    normal1Local1Y = tVec.y;
    tVec = vert1s[vertex11];
    normal1Local1X -= tVec.x;
    normal1Local1Y -= tVec.y;
    tX = normal1Local1X;
    normal1Local1X = normal1Local1Y;
    normal1Local1Y = -tX;
    invLength = 1.0 / Math.sqrt(normal1Local1X * normal1Local1X + normal1Local1Y * normal1Local1Y);
    normal1Local1X *= invLength;
    normal1Local1Y *= invLength;
    normal1X = normal1Local1X;
    normal1Y = normal1Local1Y;
    tX = normal1X;
    tMat = poly1.m_R;
    normal1X = tMat.col1.x * tX + tMat.col2.x * normal1Y;
    normal1Y = tMat.col1.y * tX + tMat.col2.y * normal1Y;
    normal1Local2X = normal1X;
    normal1Local2Y = normal1Y;
    tMat = poly2.m_R;
    tX = normal1Local2X * tMat.col1.x + normal1Local2Y * tMat.col1.y;
    normal1Local2Y = normal1Local2X * tMat.col2.x + normal1Local2Y * tMat.col2.y;
    normal1Local2X = tX;
    vertex21 = 0;
    vertex22 = 0;
    minDot = Number.MAX_VALUE;
    for (i = 0; 0 <= count2 ? i < count2 : i > count2; 0 <= count2 ? i++ : i--) {
      i1 = i;
      i2 = i + 1 < count2 ? i + 1 : 0;
      tVec = vert2s[i2];
      normal2Local2X = tVec.x;
      normal2Local2Y = tVec.y;
      tVec = vert2s[i1];
      normal2Local2X -= tVec.x;
      normal2Local2Y -= tVec.y;
      tX = normal2Local2X;
      normal2Local2X = normal2Local2Y;
      normal2Local2Y = -tX;
      invLength = 1.0 / Math.sqrt(normal2Local2X * normal2Local2X + normal2Local2Y * normal2Local2Y);
      normal2Local2X *= invLength;
      normal2Local2Y *= invLength;
      dot = normal2Local2X * normal1Local2X + normal2Local2Y * normal1Local2Y;
      if (dot < minDot) {
        minDot = dot;
        vertex21 = i1;
        vertex22 = i2;
      }
    }
    tClip;
    tClip = c[0];
    tVec = tClip.v;
    tVec.SetV(vert2s[vertex21]);
    tVec.MulM(poly2.m_R);
    tVec.Add(poly2.m_position);
    tClip.id.features.referenceFace = edge1;
    tClip.id.features.incidentEdge = vertex21;
    tClip.id.features.incidentVertex = vertex21;
    tClip = c[1];
    tVec = tClip.v;
    tVec.SetV(vert2s[vertex22]);
    tVec.MulM(poly2.m_R);
    tVec.Add(poly2.m_position);
    tClip.id.features.referenceFace = edge1;
    tClip.id.features.incidentEdge = vertex21;
    return tClip.id.features.incidentVertex = vertex22;
  };
  b2Collision.b2CollidePolyTempVec = new b2Vec2();
  b2Collision.b2CollidePoly = function(manifold, polyA, polyB, conservative) {
    var clipPoints1, clipPoints2, count1, cp, dvX, dvY, edge1, edgeA, edgeAOut, edgeB, edgeBOut, flip, frontNormalX, frontNormalY, frontOffset, i, incidentEdge, invLength, k_absoluteTol, k_relativeTol, np, pointCount, poly1, poly2, separation, separationA, separationB, sideNormalX, sideNormalY, sideOffset1, sideOffset2, tMat, tVec, tX, v11, v11X, v11Y, v12, v12X, v12Y, vert1s, _ref;
    manifold.pointCount = 0;
    edgeA = 0;
    edgeAOut = [edgeA];
    separationA = b2Collision.FindMaxSeparation(edgeAOut, polyA, polyB, conservative);
    edgeA = edgeAOut[0];
    if (separationA > 0.0 && conservative === false) {
      return;
    }
    edgeB = 0;
    edgeBOut = [edgeB];
    separationB = b2Collision.FindMaxSeparation(edgeBOut, polyB, polyA, conservative);
    edgeB = edgeBOut[0];
    if (separationB > 0.0 && conservative === false) {
      return;
    }
    edge1 = 0;
    flip = 0;
    k_relativeTol = 0.98;
    k_absoluteTol = 0.001;
    if (separationB > k_relativeTol * separationA + k_absoluteTol) {
      poly1 = polyB;
      poly2 = polyA;
      edge1 = edgeB;
      flip = 1;
    } else {
      poly1 = polyA;
      poly2 = polyB;
      edge1 = edgeA;
      flip = 0;
    }
    incidentEdge = [new ClipVertex(), new ClipVertex()];
    b2Collision.FindIncidentEdge(incidentEdge, poly1, edge1, poly2);
    count1 = poly1.m_vertexCount;
    vert1s = poly1.m_vertices;
    v11 = vert1s[edge1];
    v12 = edge1 + 1 < count1 ? vert1s[edge1 + 1] : vert1s[0];
    dvX = v12.x - v11.x;
    dvY = v12.y - v11.y;
    sideNormalX = v12.x - v11.x;
    sideNormalY = v12.y - v11.y;
    tX = sideNormalX;
    tMat = poly1.m_R;
    sideNormalX = tMat.col1.x * tX + tMat.col2.x * sideNormalY;
    sideNormalY = tMat.col1.y * tX + tMat.col2.y * sideNormalY;
    invLength = 1.0 / Math.sqrt(sideNormalX * sideNormalX + sideNormalY * sideNormalY);
    sideNormalX *= invLength;
    sideNormalY *= invLength;
    frontNormalX = sideNormalX;
    frontNormalY = sideNormalY;
    tX = frontNormalX;
    frontNormalX = frontNormalY;
    frontNormalY = -tX;
    v11X = v11.x;
    v11Y = v11.y;
    tX = v11X;
    tMat = poly1.m_R;
    v11X = tMat.col1.x * tX + tMat.col2.x * v11Y;
    v11Y = tMat.col1.y * tX + tMat.col2.y * v11Y;
    v11X += poly1.m_position.x;
    v11Y += poly1.m_position.y;
    v12X = v12.x;
    v12Y = v12.y;
    tX = v12X;
    tMat = poly1.m_R;
    v12X = tMat.col1.x * tX + tMat.col2.x * v12Y;
    v12Y = tMat.col1.y * tX + tMat.col2.y * v12Y;
    v12X += poly1.m_position.x;
    v12Y += poly1.m_position.y;
    frontOffset = frontNormalX * v11X + frontNormalY * v11Y;
    sideOffset1 = -(sideNormalX * v11X + sideNormalY * v11Y);
    sideOffset2 = sideNormalX * v12X + sideNormalY * v12Y;
    clipPoints1 = [new ClipVertex(), new ClipVertex()];
    clipPoints2 = [new ClipVertex(), new ClipVertex()];
    np = 0;
    b2Collision.b2CollidePolyTempVec.Set(-sideNormalX, -sideNormalY);
    np = b2Collision.ClipSegmentToLine(clipPoints1, incidentEdge, b2Collision.b2CollidePolyTempVec, sideOffset1);
    if (np < 2) {
      return;
    }
    b2Collision.b2CollidePolyTempVec.Set(sideNormalX, sideNormalY);
    np = b2Collision.ClipSegmentToLine(clipPoints2, clipPoints1, b2Collision.b2CollidePolyTempVec, sideOffset2);
    if (np < 2) {
      return;
    }
    if (flip) {
      manifold.normal.Set(-frontNormalX, -frontNormalY);
    } else {
      manifold.normal.Set(frontNormalX, frontNormalY);
    }
    pointCount = 0;
    for (i = 0, _ref = b2Settings.b2_maxManifoldPoints; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      tVec = clipPoints2[i].v;
      separation = (frontNormalX * tVec.x + frontNormalY * tVec.y) - frontOffset;
      if (separation <= 0.0 || conservative === true) {
        cp = manifold.points[pointCount];
        cp.separation = separation;
        cp.position.SetV(clipPoints2[i].v);
        cp.id.Set(clipPoints2[i].id);
        cp.id.features.flip = flip;
        ++pointCount;
      }
    }
    return manifold.pointCount = pointCount;
  };
  b2Collision.b2CollideCircle = function(manifold, circle1, circle2, conservative) {
    var a, dX, dY, dist, distSqr, radiusSum, separation, tPoint;
    manifold.pointCount = 0;
    dX = circle2.m_position.x - circle1.m_position.x;
    dY = circle2.m_position.y - circle1.m_position.y;
    distSqr = dX * dX + dY * dY;
    radiusSum = circle1.m_radius + circle2.m_radius;
    if (distSqr > radiusSum * radiusSum && conservative === false) {
      return;
    }
    if (distSqr < Number.MIN_VALUE) {
      separation = -radiusSum;
      manifold.normal.Set(0.0, 1.0);
    } else {
      dist = Math.sqrt(distSqr);
      separation = dist - radiusSum;
      a = 1.0 / dist;
      manifold.normal.x = a * dX;
      manifold.normal.y = a * dY;
    }
    manifold.pointCount = 1;
    tPoint = manifold.points[0];
    tPoint.id.set_key(0);
    tPoint.separation = separation;
    tPoint.position.x = circle2.m_position.x - (circle2.m_radius * manifold.normal.x);
    return tPoint.position.y = circle2.m_position.y - (circle2.m_radius * manifold.normal.y);
  };
  b2Collision.b2CollidePolyAndCircle = function(manifold, poly, circle, conservative) {
    var dX, dY, dist, eX, eY, i, length, normalIndex, pX, pY, radius, s, separation, tMat, tPoint, tVec, tX, u, vertIndex1, vertIndex2, xLocalX, xLocalY, _ref;
    manifold.pointCount = 0;
    xLocalX = circle.m_position.x - poly.m_position.x;
    xLocalY = circle.m_position.y - poly.m_position.y;
    tMat = poly.m_R;
    tX = xLocalX * tMat.col1.x + xLocalY * tMat.col1.y;
    xLocalY = xLocalX * tMat.col2.x + xLocalY * tMat.col2.y;
    xLocalX = tX;
    normalIndex = 0;
    separation = -Number.MAX_VALUE;
    radius = circle.m_radius;
    for (i = 0, _ref = poly.m_vertexCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      s = poly.m_normals[i].x * (xLocalX - poly.m_vertices[i].x) + poly.m_normals[i].y * (xLocalY - poly.m_vertices[i].y);
      if (s > radius) {
        return;
      }
      if (s > separation) {
        separation = s;
        normalIndex = i;
      }
    }
    if (separation < Number.MIN_VALUE) {
      manifold.pointCount = 1;
      tVec = poly.m_normals[normalIndex];
      manifold.normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
      manifold.normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
      tPoint = manifold.points[0];
      tPoint.id.features.incidentEdge = normalIndex;
      tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature;
      tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
      tPoint.id.features.flip = 0;
      tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
      tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
      tPoint.separation = separation - radius;
      return;
    }
    vertIndex1 = normalIndex;
    vertIndex2 = vertIndex1 + 1 < poly.m_vertexCount ? vertIndex1 + 1 : 0;
    eX = poly.m_vertices[vertIndex2].x - poly.m_vertices[vertIndex1].x;
    eY = poly.m_vertices[vertIndex2].y - poly.m_vertices[vertIndex1].y;
    length = Math.sqrt(eX * eX + eY * eY);
    eX /= length;
    eY /= length;
    if (length < Number.MIN_VALUE) {
      dX = xLocalX - poly.m_vertices[vertIndex1].x;
      dY = xLocalY - poly.m_vertices[vertIndex1].y;
      dist = Math.sqrt(dX * dX + dY * dY);
      dX /= dist;
      dY /= dist;
      if (dist > radius) {
        return;
      }
      manifold.pointCount = 1;
      manifold.normal.Set(tMat.col1.x * dX + tMat.col2.x * dY, tMat.col1.y * dX + tMat.col2.y * dY);
      tPoint = manifold.points[0];
      tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature;
      tPoint.id.features.incidentVertex = vertIndex1;
      tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
      tPoint.id.features.flip = 0;
      tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
      tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
      tPoint.separation = dist - radius;
      return;
    }
    u = (xLocalX - poly.m_vertices[vertIndex1].x) * eX + (xLocalY - poly.m_vertices[vertIndex1].y) * eY;
    tPoint = manifold.points[0];
    tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature;
    tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature;
    tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
    tPoint.id.features.flip = 0;
    if (u <= 0.0) {
      pX = poly.m_vertices[vertIndex1].x;
      pY = poly.m_vertices[vertIndex1].y;
      tPoint.id.features.incidentVertex = vertIndex1;
    } else if (u >= length) {
      pX = poly.m_vertices[vertIndex2].x;
      pY = poly.m_vertices[vertIndex2].y;
      tPoint.id.features.incidentVertex = vertIndex2;
    } else {
      pX = eX * u + poly.m_vertices[vertIndex1].x;
      pY = eY * u + poly.m_vertices[vertIndex1].y;
      tPoint.id.features.incidentEdge = vertIndex1;
    }
    dX = xLocalX - pX;
    dY = xLocalY - pY;
    dist = Math.sqrt(dX * dX + dY * dY);
    dX /= dist;
    dY /= dist;
    if (dist > radius) {
      return;
    }
    manifold.pointCount = 1;
    manifold.normal.Set(tMat.col1.x * dX + tMat.col2.x * dY, tMat.col1.y * dX + tMat.col2.y * dY);
    tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
    tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
    return tPoint.separation = dist - radius;
  };
  b2Collision.b2TestOverlap = function(a, b) {
    var d1X, d1Y, d2X, d2Y, t1, t2;
    t1 = b.minVertex;
    t2 = a.maxVertex;
    d1X = t1.x - t2.x;
    d1Y = t1.y - t2.y;
    t1 = a.minVertex;
    t2 = b.maxVertex;
    d2X = t1.x - t2.x;
    d2Y = t1.y - t2.y;
    if (d1X > 0.0 || d1Y > 0.0) {
      return false;
    }
    if (d2X > 0.0 || d2Y > 0.0) {
      return false;
    }
    return true;
  };
  
  var Features;
  exports.Features = Features = Features = (function() {
    function Features() {}
    return Features;
  })();
  /*
  // We use contact ids to facilitate warm starting.
  var Features = Class.create();
  Features.prototype = 
  {
  	//
  	set_referenceFace: function(value){
  		this._referenceFace = value;
  		this._m_id._key = (this._m_id._key & 0xffffff00) | (this._referenceFace & 0x000000ff)
  	},
  	get_referenceFace: function(){
  		return this._referenceFace;
  	},
  	_referenceFace: 0,
  	//
  	set_incidentEdge: function(value){
  		this._incidentEdge = value;
  		this._m_id._key = (this._m_id._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00)
  	},
  	get_incidentEdge: function(){
  		return this._incidentEdge;
  	},
  	_incidentEdge: 0,
  	//
  	set_incidentVertex: function(value){
  		this._incidentVertex = value;
  		this._m_id._key = (this._m_id._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000)
  	},
  	get_incidentVertex: function(){
  		return this._incidentVertex;
  	},
  	_incidentVertex: 0,
  	//
  	set_flip: function(value){
  		this._flip = value;
  		this._m_id._key = (this._m_id._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000)
  	},
  	get_flip: function(){
  		return this._flip;
  	},
  	_flip: 0,
  	_m_id: null,
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
  var b2ContactID;
  exports.b2ContactID = b2ContactID = b2ContactID = (function() {
    function b2ContactID() {
      this.features = new Features();
      this.features._m_id = this;
    }
    b2ContactID.prototype.Set = function(id) {
      return this.set_key(id._key);
    };
    b2ContactID.prototype.Copy = function() {
      var id;
      id = new b2ContactID();
      id.set_key(this._key);
      return id;
    };
    b2ContactID.prototype.get_key = function() {
      return this._key;
    };
    b2ContactID.prototype.set_key = function(value) {
      this._key = value;
      this.features._referenceFace = this._key & 0x000000ff;
      this.features._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
      this.features._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
      return this.features._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
    };
    b2ContactID.prototype.features = new Features();
    b2ContactID.prototype._key = 0;
    return b2ContactID;
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
  var b2ContactPoint;
  exports.b2ContactPoint = b2ContactPoint = b2ContactPoint = (function() {
    b2ContactPoint.prototype.position = new b2Vec2();
    b2ContactPoint.prototype.separation = null;
    b2ContactPoint.prototype.normalImpulse = null;
    b2ContactPoint.prototype.tangentImpulse = null;
    b2ContactPoint.prototype.id = new b2ContactID();
    function b2ContactPoint() {
      this.position = new b2Vec2();
      this.id = new b2ContactID();
    }
    return b2ContactPoint;
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
  var b2Distance;
  exports.b2Distance = b2Distance = b2Distance = (function() {
    function b2Distance() {}
    return b2Distance;
  })();
  b2Distance.ProcessTwo = function(p1Out, p2Out, p1s, p2s, points) {
    var dX, dY, lambda, length, rX, rY;
    rX = -points[1].x;
    rY = -points[1].y;
    dX = points[0].x - points[1].x;
    dY = points[0].y - points[1].y;
    length = Math.sqrt(dX * dX + dY * dY);
    dX /= length;
    dY /= length;
    lambda = rX * dX + rY * dY;
    if (lambda <= 0.0 || length < Number.MIN_VALUE) {
      p1Out.SetV(p1s[1]);
      p2Out.SetV(p2s[1]);
      p1s[0].SetV(p1s[1]);
      p2s[0].SetV(p2s[1]);
      points[0].SetV(points[1]);
      return 1;
    }
    lambda /= length;
    p1Out.x = p1s[1].x + lambda * (p1s[0].x - p1s[1].x);
    p1Out.y = p1s[1].y + lambda * (p1s[0].y - p1s[1].y);
    p2Out.x = p2s[1].x + lambda * (p2s[0].x - p2s[1].x);
    p2Out.y = p2s[1].y + lambda * (p2s[0].y - p2s[1].y);
    return 2;
  };
  b2Distance.ProcessThree = function(p1Out, p2Out, p1s, p2s, points) {
    var aX, aY, abX, abY, acX, acY, bX, bY, bcX, bcY, cX, cY, denom, lambda, n, sd, sn, td, tn, u, ud, un, v, va, vb, vc, w;
    aX = points[0].x;
    aY = points[0].y;
    bX = points[1].x;
    bY = points[1].y;
    cX = points[2].x;
    cY = points[2].y;
    abX = bX - aX;
    abY = bY - aY;
    acX = cX - aX;
    acY = cY - aY;
    bcX = cX - bX;
    bcY = cY - bY;
    sn = -(aX * abX + aY * abY);
    sd = bX * abX + bY * abY;
    tn = -(aX * acX + aY * acY);
    td = cX * acX + cY * acY;
    un = -(bX * bcX + bY * bcY);
    ud = cX * bcX + cY * bcY;
    if (td <= 0.0 && ud <= 0.0) {
      p1Out.SetV(p1s[2]);
      p2Out.SetV(p2s[2]);
      p1s[0].SetV(p1s[2]);
      p2s[0].SetV(p2s[2]);
      points[0].SetV(points[2]);
      return 1;
    }
    n = abX * acY - abY * acX;
    vc = n * (aX * bY - aY * bX);
    va = n * (bX * cY - bY * cX);
    if (va <= 0.0 && un >= 0.0 && ud >= 0.0) {
      lambda = un / (un + ud);
      p1Out.x = p1s[1].x + lambda * (p1s[2].x - p1s[1].x);
      p1Out.y = p1s[1].y + lambda * (p1s[2].y - p1s[1].y);
      p2Out.x = p2s[1].x + lambda * (p2s[2].x - p2s[1].x);
      p2Out.y = p2s[1].y + lambda * (p2s[2].y - p2s[1].y);
      p1s[0].SetV(p1s[2]);
      p2s[0].SetV(p2s[2]);
      points[0].SetV(points[2]);
      return 2;
    }
    vb = n * (cX * aY - cY * aX);
    if (vb <= 0.0 && tn >= 0.0 && td >= 0.0) {
      lambda = tn / (tn + td);
      p1Out.x = p1s[0].x + lambda * (p1s[2].x - p1s[0].x);
      p1Out.y = p1s[0].y + lambda * (p1s[2].y - p1s[0].y);
      p2Out.x = p2s[0].x + lambda * (p2s[2].x - p2s[0].x);
      p2Out.y = p2s[0].y + lambda * (p2s[2].y - p2s[0].y);
      p1s[1].SetV(p1s[2]);
      p2s[1].SetV(p2s[2]);
      points[1].SetV(points[2]);
      return 2;
    }
    denom = va + vb + vc;
    denom = 1.0 / denom;
    u = va * denom;
    v = vb * denom;
    w = 1.0 - u - v;
    p1Out.x = u * p1s[0].x + v * p1s[1].x + w * p1s[2].x;
    p1Out.y = u * p1s[0].y + v * p1s[1].y + w * p1s[2].y;
    p2Out.x = u * p2s[0].x + v * p2s[1].x + w * p2s[2].x;
    p2Out.y = u * p2s[0].y + v * p2s[1].y + w * p2s[2].y;
    return 3;
  };
  b2Distance.InPoinsts = function(w, points, pointCount) {
    var i;
    for (i = 0; 0 <= pointCount ? i < pointCount : i > pointCount; 0 <= pointCount ? i++ : i--) {
      if (w.x === points[i].x && w.y === points[i].y) {
        return true;
      }
    }
    return false;
  };
  b2Distance.Distance = function(p1Out, p2Out, shape1, shape2) {
    var i, iter, maxIterations, maxSqr, p1s, p2s, pointCount, points, vSqr, vX, vY, vw, w1, w2, wX, wY;
    p1s = new Array(3);
    p2s = new Array(3);
    points = new Array(3);
    pointCount = 0;
    p1Out.SetV(shape1.m_position);
    p2Out.SetV(shape2.m_position);
    vSqr = 0.0;
    maxIterations = 20;
    for (iter = 0; 0 <= maxIterations ? iter < maxIterations : iter > maxIterations; 0 <= maxIterations ? iter++ : iter--) {
      vX = p2Out.x - p1Out.x;
      vY = p2Out.y - p1Out.y;
      w1 = shape1.Support(vX, vY);
      w2 = shape2.Support(-vX, -vY);
      vSqr = vX * vX + vY * vY;
      wX = w2.x - w1.x;
      wY = w2.y - w1.y;
      vw = vX * wX + vY * wY;
      if (vSqr - b2Dot(vX * wX + vY * wY) <= 0.01 * vSqr) {
        if (pointCount === 0) {
          p1Out.SetV(w1);
          p2Out.SetV(w2);
        }
        b2Distance.g_GJK_Iterations = iter;
        return Math.sqrt(vSqr);
      }
      switch (pointCount) {
        case 0:
          p1s[0].SetV(w1);
          p2s[0].SetV(w2);
          points[0] = w;
          p1Out.SetV(p1s[0]);
          p2Out.SetV(p2s[0]);
          ++pointCount;
          break;
        case 1:
          p1s[1].SetV(w1);
          p2s[1].SetV(w2);
          points[1].x = wX;
          points[1].y = wY;
          pointCount = b2Distance.ProcessTwo(p1Out, p2Out, p1s, p2s, points);
          break;
        case 2:
          p1s[2].SetV(w1);
          p2s[2].SetV(w2);
          points[2].x = wX;
          points[2].y = wY;
          pointCount = b2Distance.ProcessThree(p1Out, p2Out, p1s, p2s, points);
      }
      if (pointCount === 3) {
        b2Distance.g_GJK_Iterations = iter;
        return 0.0;
      }
      maxSqr = -Number.MAX_VALUE;
      for (i = 0; 0 <= pointCount ? i < pointCount : i > pointCount; 0 <= pointCount ? i++ : i--) {
        maxSqr = b2Math.b2Max(maxSqr, points[i].x * points[i].x + points[i].y * points[i].y);
      }
      if (pointCount === 3 || vSqr <= 100.0 * Number.MIN_VALUE * maxSqr) {
        b2Distance.g_GJK_Iterations = iter;
        return Math.sqrt(vSqr);
      }
    }
    b2Distance.g_GJK_Iterations = maxIterations;
    return Math.sqrt(vSqr);
  };
  b2Distance.g_GJK_Iterations = 0;
  
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
  var b2Manifold;
  exports.b2Manifold = b2Manifold = b2Manifold = (function() {
    b2Manifold.prototype.points = null;
    b2Manifold.prototype.normal = null;
    b2Manifold.prototype.pointCount = 0;
    function b2Manifold() {
      var i, _ref;
      this.points = new Array(b2Settings.b2_maxManifoldPoints);
      for (i = 0, _ref = b2Settings.b2_maxManifoldPoints; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.points[i] = new b2ContactPoint();
      }
      this.normal = new b2Vec2();
    }
    return b2Manifold;
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
  var ClipVertex;
  exports.ClipVertex = ClipVertex = ClipVertex = (function() {
    ClipVertex.prototype.v = new b2Vec2();
    ClipVertex.prototype.id = new b2ContactID();
    function ClipVertex() {
      this.v = new b2Vec2();
      this.id = new b2ContactID();
    }
    return ClipVertex;
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
    b2Shape.prototype.DestroyProxy = function() {
      if (this.m_proxyId !== b2Pair.b2_nullProxy) {
        this.m_body.m_world.m_broadPhase.DestroyProxy(this.m_proxyId);
        return this.m_proxyId = b2Pair.b2_nullProxy;
      }
    };
    b2Shape.prototype.Synchronize = function(position1, R1, position2, R2) {};
    b2Shape.prototype.QuickSync = function(position, R) {};
    b2Shape.prototype.Support = function(dX, dY, out) {};
    b2Shape.prototype.GetMaxRadius = function() {
      return this.m_maxRadius;
    };
    b2Shape.prototype.m_next = null;
    b2Shape.prototype.m_R = new b2Mat22();
    b2Shape.prototype.m_position = new b2Vec2();
    b2Shape.prototype.m_type = 0;
    b2Shape.prototype.m_userData = null;
    b2Shape.prototype.m_body = null;
    b2Shape.prototype.m_friction = null;
    b2Shape.prototype.m_restitution = null;
    b2Shape.prototype.m_maxRadius = null;
    b2Shape.prototype.m_proxyId = 0;
    b2Shape.prototype.m_categoryBits = 0;
    b2Shape.prototype.m_maskBits = 0;
    b2Shape.prototype.m_groupIndex = 0;
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
  b2Shape.Destroy = function(shape) {
    if (shape.m_proxyId !== b2Pair.b2_nullProxy) {
      return shape.m_body.m_world.m_broadPhase.DestroyProxy(shape.m_proxyId);
    }
  };
  b2Shape.PolyMass = function(massData, vs, count, rho) {
    var D, I, area, center, e1, e2, ex1, ex2, ey1, ey2, i, intx2, inty2, inv3, p1, p2, p3, pRef, px, py, tVec, triangleArea;
    center = new b2Vec2();
    center.SetZero();
    area = 0.0;
    I = 0.0;
    pRef = new b2Vec2(0.0, 0.0);
    inv3 = 1.0 / 3.0;
    for (i = 0; 0 <= count ? i < count : i > count; 0 <= count ? i++ : i--) {
      p1 = pRef;
      p2 = vs[i];
      p3 = i + 1 < count ? vs[i + 1] : vs[0];
      e1 = b2Math.SubtractVV(p2, p1);
      e2 = b2Math.SubtractVV(p3, p1);
      D = b2Math.b2CrossVV(e1, e2);
      triangleArea = 0.5 * D;
      area += triangleArea;
      tVec = new b2Vec2();
      tVec.SetV(p1);
      tVec.Add(p2);
      tVec.Add(p3);
      tVec.Multiply(inv3 * triangleArea);
      center.Add(tVec);
      px = p1.x;
      py = p1.y;
      ex1 = e1.x;
      ey1 = e1.y;
      ex2 = e2.x;
      ey2 = e2.y;
      intx2 = inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
      inty2 = inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;
      I += D * (intx2 + inty2);
    }
    massData.mass = rho * area;
    center.Multiply(1.0 / area);
    massData.center = center;
    I = rho * (I - area * b2Math.b2Dot(center, center));
    return massData.I = I;
  };
  b2Shape.PolyCentroid = function(vs, count, out) {
    var D, area, cX, cY, e1X, e1Y, e2X, e2Y, i, inv3, p1X, p1Y, p2X, p2Y, p3X, p3Y, pRefX, pRefY, triangleArea;
    cX = 0.0;
    cY = 0.0;
    area = 0.0;
    pRefX = 0.0;
    pRefY = 0.0;
    inv3 = 1.0 / 3.0;
    for (i = 0; 0 <= count ? i < count : i > count; 0 <= count ? i++ : i--) {
      p1X = pRefX;
      p1Y = pRefY;
      p2X = vs[i].x;
      p2Y = vs[i].y;
      p3X = i + 1 < count ? vs[i + 1].x : vs[0].x;
      p3Y = i + 1 < count ? vs[i + 1].y : vs[0].y;
      e1X = p2X - p1X;
      e1Y = p2Y - p1Y;
      e2X = p3X - p1X;
      e2Y = p3Y - p1Y;
      D = e1X * e2Y - e1Y * e2X;
      triangleArea = 0.5 * D;
      area += triangleArea;
      cX += triangleArea * inv3 * (p1X + p2X + p3X);
      cY += triangleArea * inv3 * (p1Y + p2Y + p3Y);
    }
    cX *= 1.0 / area;
    cY *= 1.0 / area;
    return out.Set(cX, cY);
  };
  b2Shape.e_unknownShape = -1;
  b2Shape.e_circleShape = 0;
  b2Shape.e_boxShape = 1;
  b2Shape.e_polyShape = 2;
  b2Shape.e_meshShape = 3;
  b2Shape.e_shapeTypeCount = 4;
  
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
    b2ShapeDef.prototype.categoryBits = 0;
    b2ShapeDef.prototype.maskBits = 0;
    b2ShapeDef.prototype.groupIndex = 0;
    return b2ShapeDef;
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
  var b2CircleDef;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2CircleDef = b2CircleDef = b2CircleDef = (function() {
    __extends(b2CircleDef, b2ShapeDef);
    b2CircleDef.prototype.radius = null;
    function b2CircleDef() {
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
      this.type = b2Shape.e_circleShape;
      this.radius = 1.0;
    }
    return b2CircleDef;
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
    b2CircleShape.prototype.TestPoint = function(p) {
      var d;
      d = new b2Vec2();
      d.SetV(p);
      d.Subtract(this.m_position);
      return b2Math.b2Dot(d, d) <= this.m_radius * this.m_radius;
    };
    b2CircleShape.prototype.Synchronize = function(position1, R1, position2, R2) {
      var aabb, broadPhase, lowerX, lowerY, p1X, p1Y, upperX, upperY;
      this.m_R.SetM(R2);
      this.m_position.x = (R2.col1.x * this.m_localPosition.x + R2.col2.x * this.m_localPosition.y) + position2.x;
      this.m_position.y = (R2.col1.y * this.m_localPosition.x + R2.col2.y * this.m_localPosition.y) + position2.y;
      if (this.m_proxyId === b2Pair.b2_nullProxy) {
        return;
      }
      p1X = position1.x + (R1.col1.x * this.m_localPosition.x + R1.col2.x * this.m_localPosition.y);
      p1Y = position1.y + (R1.col1.y * this.m_localPosition.x + R1.col2.y * this.m_localPosition.y);
      lowerX = Math.min(p1X, this.m_position.x);
      lowerY = Math.min(p1Y, this.m_position.y);
      upperX = Math.max(p1X, this.m_position.x);
      upperY = Math.max(p1Y, this.m_position.y);
      aabb = new b2AABB();
      aabb.minVertex.Set(lowerX - this.m_radius, lowerY - this.m_radius);
      aabb.maxVertex.Set(upperX + this.m_radius, upperY + this.m_radius);
      broadPhase = this.m_body.m_world.m_broadPhase;
      if (broadPhase.InRange(aabb)) {
        return broadPhase.MoveProxy(this.m_proxyId, aabb);
      } else {
        return this.m_body.Freeze();
      }
    };
    b2CircleShape.prototype.QuickSync = function(position, R) {
      this.m_R.SetM(R);
      this.m_position.x = (R.col1.x * this.m_localPosition.x + R.col2.x * this.m_localPosition.y) + position.x;
      return this.m_position.y = (R.col1.y * this.m_localPosition.x + R.col2.y * this.m_localPosition.y) + position.y;
    };
    b2CircleShape.prototype.ResetProxy = function(broadPhase) {
      var aabb, proxy;
      if (this.m_proxyId === b2Pair.b2_nullProxy) {
        return;
      }
      proxy = broadPhase.GetProxy(this.m_proxyId);
      broadPhase.DestroyProxy(this.m_proxyId);
      proxy = null;
      aabb = new b2AABB();
      aabb.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius);
      aabb.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius);
      if (broadPhase.InRange(aabb)) {
        this.m_proxyId = broadPhase.CreateProxy(aabb, this);
      } else {
        this.m_proxyId = b2Pair.b2_nullProxy;
      }
      if (this.m_proxyId === b2Pair.b2_nullProxy) {
        return this.m_body.Freeze();
      }
    };
    b2CircleShape.prototype.Support = function(dX, dY, out) {
      var len;
      len = Math.sqrt(dX * dX + dY * dY);
      dX /= len;
      dY /= len;
      return out.Set(this.m_position.x + this.m_radius * dX, this.m_position.y + this.m_radius * dY);
    };
    b2CircleShape.prototype.m_localPosition = new b2Vec2();
    b2CircleShape.prototype.m_radius = null;
    return b2CircleShape;
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
  var b2PolyDef;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2PolyDef = b2PolyDef = b2PolyDef = (function() {
    __extends(b2PolyDef, b2ShapeDef);
    b2PolyDef.prototype.vertices = new Array(b2Settings.b2_maxPolyVertices);
    b2PolyDef.prototype.vertexCount = 0;
    function b2PolyDef() {
      var i, _ref;
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
      this.vertices = new Array(b2Settings.b2_maxPolyVertices);
      this.type = b2Shape.e_polyShape;
      this.vertexCount = 0;
      for (i = 0, _ref = b2Settings.b2_maxPolyVertices; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.vertices[i] = new b2Vec2();
      }
    }
    return b2PolyDef;
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
    b2PolyShape.prototype.syncAABB = new b2AABB();
    b2PolyShape.prototype.syncMat = new b2Mat22();
    b2PolyShape.prototype.Synchronize = function(position1, R1, position2, R2) {
      var broadPhase, centerX, centerY, hX, hY, v1, v2, v3, v4;
      this.m_R.SetM(R2);
      this.m_position.x = this.m_body.m_position.x + (R2.col1.x * this.m_localCentroid.x + R2.col2.x * this.m_localCentroid.y);
      this.m_position.y = this.m_body.m_position.y + (R2.col1.y * this.m_localCentroid.x + R2.col2.y * this.m_localCentroid.y);
      if (this.m_proxyId === b2Pair.b2_nullProxy) {
        return;
      }
      v1 = R1.col1;
      v2 = R1.col2;
      v3 = this.m_localOBB.R.col1;
      v4 = this.m_localOBB.R.col2;
      this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
      this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
      this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
      this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
      this.syncMat.Abs();
      hX = this.m_localCentroid.x + this.m_localOBB.center.x;
      hY = this.m_localCentroid.y + this.m_localOBB.center.y;
      centerX = position1.x + (R1.col1.x * hX + R1.col2.x * hY);
      centerY = position1.y + (R1.col1.y * hX + R1.col2.y * hY);
      hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
      hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
      this.syncAABB.minVertex.x = centerX - hX;
      this.syncAABB.minVertex.y = centerY - hY;
      this.syncAABB.maxVertex.x = centerX + hX;
      this.syncAABB.maxVertex.y = centerY + hY;
      v1 = R2.col1;
      v2 = R2.col2;
      v3 = this.m_localOBB.R.col1;
      v4 = this.m_localOBB.R.col2;
      this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
      this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
      this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
      this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
      this.syncMat.Abs();
      hX = this.m_localCentroid.x + this.m_localOBB.center.x;
      hY = this.m_localCentroid.y + this.m_localOBB.center.y;
      centerX = position2.x + (R2.col1.x * hX + R2.col2.x * hY);
      centerY = position2.y + (R2.col1.y * hX + R2.col2.y * hY);
      hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
      hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
      this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, centerX - hX);
      this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, centerY - hY);
      this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, centerX + hX);
      this.syncAABB.maxVertex.y = Math.max(this.syncAABB.maxVertex.y, centerY + hY);
      broadPhase = this.m_body.m_world.m_broadPhase;
      if (broadPhase.InRange(this.syncAABB)) {
        return broadPhase.MoveProxy(this.m_proxyId, this.syncAABB);
      } else {
        return this.m_body.Freeze();
      }
    };
    b2PolyShape.prototype.QuickSync = function(position, R) {
      this.m_R.SetM(R);
      this.m_position.x = position.x + (R.col1.x * this.m_localCentroid.x + R.col2.x * this.m_localCentroid.y);
      return this.m_position.y = position.y + (R.col1.y * this.m_localCentroid.x + R.col2.y * this.m_localCentroid.y);
    };
    b2PolyShape.prototype.ResetProxy = function(broadPhase) {
      var R, aabb, absR, h, position, proxy;
      if (this.m_proxyId === b2Pair.b2_nullProxy) {
        return;
      }
      proxy = broadPhase.GetProxy(this.m_proxyId);
      broadPhase.DestroyProxy(this.m_proxyId);
      proxy = null;
      R = b2Math.b2MulMM(this.m_R, this.m_localOBB.R);
      absR = b2Math.b2AbsM(R);
      h = b2Math.b2MulMV(absR, this.m_localOBB.extents);
      position = b2Math.b2MulMV(this.m_R, this.m_localOBB.center);
      position.Add(this.m_position);
      aabb = new b2AABB();
      aabb.minVertex.SetV(position);
      aabb.minVertex.Subtract(h);
      aabb.maxVertex.SetV(position);
      aabb.maxVertex.Add(h);
      if (broadPhase.InRange(aabb)) {
        this.m_proxyId = broadPhase.CreateProxy(aabb, this);
      } else {
        this.m_proxyId = b2Pair.b2_nullProxy;
      }
      if (this.m_proxyId === b2Pair.b2_nullProxy) {
        return this.m_body.Freeze();
      }
    };
    b2PolyShape.prototype.Support = function(dX, dY, out) {
      var bestIndex, bestValue, dLocalX, dLocalY, i, value, _ref;
      dLocalX = dX * this.m_R.col1.x + dY * this.m_R.col1.y;
      dLocalY = dX * this.m_R.col2.x + dY * this.m_R.col2.y;
      bestIndex = 0;
      bestValue = this.m_coreVertices[0].x * dLocalX + this.m_coreVertices[0].y * dLocalY;
      for (i = 0, _ref = this.m_vertexCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        value = this.m_coreVertices[i].x * dLocalX + this.m_coreVertices[i].y * dLocalY;
        if (value > bestValue) {
          bestIndex = i;
          bestValue = value;
        }
      }
      return out.Set(this.m_position.x + (this.m_R.col1.x * this.m_coreVertices[bestIndex].x + this.m_R.col2.x * this.m_coreVertices[bestIndex].y), this.m_position.y + (this.m_R.col1.y * this.m_coreVertices[bestIndex].x + this.m_R.col2.y * this.m_coreVertices[bestIndex].y));
    };
    b2PolyShape.prototype.m_localCentroid = new b2Vec2();
    b2PolyShape.prototype.m_localOBB = new b2OBB();
    b2PolyShape.prototype.m_vertices = null;
    b2PolyShape.prototype.m_coreVertices = null;
    b2PolyShape.prototype.m_vertexCount = 0;
    b2PolyShape.prototype.m_normals = null;
    return b2PolyShape;
  })();
  b2PolyShape.tempVec = new b2Vec2();
  b2PolyShape.tAbsR = new b2Mat22();
  
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
    b2Body.prototype.SetOriginPosition = function(position, rotation) {
      var s;
      if (this.IsFrozen()) {
        return;
      }
      this.m_rotation = rotation;
      this.m_R.Set(this.m_rotation);
      this.m_position = b2Math.AddVV(position, b2Math.b2MulMV(this.m_R, this.m_center));
      this.m_position0.SetV(this.m_position);
      this.m_rotation0 = this.m_rotation;
      s = this.m_shapeList;
      while (s != null) {
        s.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
        s = s.m_next;
      }
      return this.m_world.m_broadPhase.Commit();
    };
    b2Body.prototype.GetOriginPosition = function() {
      return b2Math.SubtractVV(this.m_position, b2Math.b2MulMV(this.m_R, this.m_center));
    };
    b2Body.prototype.SetCenterPosition = function(position, rotation) {
      var s;
      if (this.IsFrozen()) {
        return;
      }
      this.m_rotation = rotation;
      this.m_R.Set(this.m_rotation);
      this.m_position.SetV(position);
      this.m_position0.SetV(this.m_position);
      this.m_rotation0 = this.m_rotation;
      s = this.m_shapeList;
      while (s != null) {
        s.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
        s = s.m_next;
      }
      return this.m_world.m_broadPhase.Commit();
    };
    b2Body.prototype.GetCenterPosition = function() {
      return this.m_position;
    };
    b2Body.prototype.GetRotation = function() {
      return this.m_rotation;
    };
    b2Body.prototype.GetRotationMatrix = function() {
      return this.m_R;
    };
    b2Body.prototype.SetLinearVelocity = function(v) {
      return this.m_linearVelocity.SetV(v);
    };
    b2Body.prototype.GetLinearVelocity = function() {
      return this.m_linearVelocity;
    };
    b2Body.prototype.SetAngularVelocity = function(w) {
      return this.m_angularVelocity = w;
    };
    b2Body.prototype.GetAngularVelocity = function() {
      return this.m_angularVelocity;
    };
    b2Body.prototype.ApplyForce = function(force, point) {
      if (this.IsSleeping() === false) {
        this.m_force.Add(force);
        return this.m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(point, this.m_position), force);
      }
    };
    b2Body.prototype.ApplyTorque = function(torque) {
      if (this.IsSleeping() === false) {
        return this.m_torque += torque;
      }
    };
    b2Body.prototype.ApplyImpulse = function(impulse, point) {
      if (this.IsSleeping() === false) {
        this.m_linearVelocity.Add(b2Math.MulFV(this.m_invMass, impulse));
        return this.m_angularVelocity += this.m_invI * b2Math.b2CrossVV(b2Math.SubtractVV(point, this.m_position), impulse);
      }
    };
    b2Body.prototype.GetMass = function() {
      return this.m_mass;
    };
    b2Body.prototype.GetInertia = function() {
      return this.m_I;
    };
    b2Body.prototype.GetWorldPoint = function(localPoint) {
      return b2Math.AddVV(this.m_position, b2Math.b2MulMV(this.m_R, localPoint));
    };
    b2Body.prototype.GetWorldVector = function(localVector) {
      return b2Math.b2MulMV(this.m_R, localVector);
    };
    b2Body.prototype.GetLocalPoint = function(worldPoint) {
      return b2Math.b2MulTMV(this.m_R, b2Math.SubtractVV(worldPoint, this.m_position));
    };
    b2Body.prototype.GetLocalVector = function(worldVector) {
      return b2Math.b2MulTMV(this.m_R, worldVector);
    };
    b2Body.prototype.IsStatic = function() {
      return (this.m_flags & b2Body.e_staticFlag) === b2Body.e_staticFlag;
    };
    b2Body.prototype.IsFrozen = function() {
      return (this.m_flags & b2Body.e_frozenFlag) === b2Body.e_frozenFlag;
    };
    b2Body.prototype.IsSleeping = function() {
      return (this.m_flags & b2Body.e_sleepFlag) === b2Body.e_sleepFlag;
    };
    b2Body.prototype.AllowSleeping = function(flag) {
      if (flag) {
        return this.m_flags |= b2Body.e_allowSleepFlag;
      } else {
        this.m_flags &= ~b2Body.e_allowSleepFlag;
        return this.WakeUp();
      }
    };
    b2Body.prototype.WakeUp = function() {
      this.m_flags &= ~b2Body.e_sleepFlag;
      return this.m_sleepTime = 0.0;
    };
    b2Body.prototype.GetContactList = function() {
      return this.m_contactList;
    };
    b2Body.prototype.GetJointList = function() {
      return this.m_jointList;
    };
    b2Body.prototype.GetNext = function() {
      return this.m_next;
    };
    b2Body.prototype.GetUserData = function() {
      return this.m_userData;
    };
    b2Body.prototype.GetShapeList = function() {
      return this.m_shapeList;
    };
    b2Body.prototype.Destroy = function() {
      var s, s0, _results;
      s = this.m_shapeList;
      _results = [];
      while (s) {
        s0 = s;
        s = s.m_next;
        _results.push(b2Shape.Destroy(s0));
      }
      return _results;
    };
    b2Body.prototype.sMat0 = new b2Mat22();
    b2Body.prototype.SynchronizeShapes = function() {
      var s, _results;
      this.sMat0.Set(this.m_rotation0);
      s = this.m_shapeList;
      _results = [];
      while (s != null) {
        s.Synchronize(this.m_position0, this.sMat0, this.m_position, this.m_R);
        _results.push(s = s.m_next);
      }
      return _results;
    };
    b2Body.prototype.QuickSyncShapes = function() {
      var s, _results;
      s = this.m_shapeList;
      _results = [];
      while (s != null) {
        s.QuickSync(this.m_position, this.m_R);
        _results.push(s = s.m_next);
      }
      return _results;
    };
    b2Body.prototype.IsConnected = function(other) {
      var jn;
      jn = this.m_jointList;
      while (jn != null) {
        if (jn.other === other) {
          return jn.joint.m_collideConnected === false;
        }
        jn = jn.next;
      }
      return false;
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
    b2Island.prototype.Clear = function() {
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      return this.m_jointCount = 0;
    };
    b2Island.prototype.Solve = function(step, gravity) {
      var b, contactSolver, contactsOkay, i, j, jointOkay, jointsOkay, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _results;
      for (i = 0, _ref = this.m_bodyCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        b = this.m_bodies[i];
        if (b.m_invMass === 0.0) {
          continue;
        }
        b.m_linearVelocity.Add(b2Math.MulFV(step.dt, b2Math.AddVV(gravity, b2Math.MulFV(b.m_invMass, b.m_force))));
        b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
        b.m_linearVelocity.Multiply(b.m_linearDamping);
        b.m_angularVelocity *= b.m_angularDamping;
        b.m_position0.SetV(b.m_position);
        b.m_rotation0 = b.m_rotation;
      }
      contactSolver = new b2ContactSolver(this.m_contacts, this.m_contactCount, this.m_allocator);
      contactSolver.PreSolve();
      for (i = 0, _ref2 = this.m_jointCount; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        this.m_joints[i].PrepareVelocitySolver();
      }
      for (i = 0, _ref3 = step.iterations; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
        contactSolver.SolveVelocityConstraints();
        for (j = 0, _ref4 = this.m_jointCount; 0 <= _ref4 ? j < _ref4 : j > _ref4; 0 <= _ref4 ? j++ : j--) {
          this.m_joints[j].SolveVelocityConstraints(step);
        }
      }
      for (i = 0, _ref5 = this.m_bodyCount; 0 <= _ref5 ? i < _ref5 : i > _ref5; 0 <= _ref5 ? i++ : i--) {
        b = this.m_bodies[i];
        if (b.m_invMass === 0.0) {
          continue;
        }
        b.m_position.x += step.dt * b.m_linearVelocity.x;
        b.m_position.y += step.dt * b.m_linearVelocity.y;
        b.m_rotation += step.dt * b.m_angularVelocity;
        b.m_R.Set(b.m_rotation);
      }
      for (i = 0, _ref6 = this.m_jointCount; 0 <= _ref6 ? i < _ref6 : i > _ref6; 0 <= _ref6 ? i++ : i--) {
        this.m_joints[i].PreparePositionSolver();
      }
      if (b2World.s_enablePositionCorrection) {
        b2Island.m_positionIterationCount = 0;
        while (b2Island.m_positionIterationCount < step.iterations) {
          contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
          jointsOkay = true;
          for (i = 0, _ref7 = this.m_jointCount; 0 <= _ref7 ? i < _ref7 : i > _ref7; 0 <= _ref7 ? i++ : i--) {
            jointOkay = this.m_joints[i].SolvePositionConstraints();
            jointsOkay = jointsOkay && jointOkay;
          }
          if (contactsOkay && jointsOkay) {
            break;
          }
          ++b2Island.m_positionIterationCount;
        }
      }
      contactSolver.PostSolve();
      _results = [];
      for (i = 0, _ref8 = this.m_bodyCount; 0 <= _ref8 ? i < _ref8 : i > _ref8; 0 <= _ref8 ? i++ : i--) {
        b = this.m_bodies[i];
        if (b.m_invMass === 0.0) {
          continue;
        }
        b.m_R.Set(b.m_rotation);
        b.SynchronizeShapes();
        b.m_force.Set(0.0, 0.0);
        _results.push(b.m_torque = 0.0);
      }
      return _results;
    };
    b2Island.prototype.UpdateSleep = function(dt) {
      var angTolSqr, b, i, linTolSqr, minSleepTime, _ref, _ref2, _results;
      minSleepTime = Number.MAX_VALUE;
      linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
      angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;
      for (i = 0, _ref = this.m_bodyCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        b = this.m_bodies[i];
        if (b.m_invMass === 0.0) {
          continue;
        }
        if ((b.m_flags & b2Body.e_allowSleepFlag) === 0) {
          b.m_sleepTime = 0.0;
          minSleepTime = 0.0;
        }
        if ((b.m_flags & b2Body.e_allowSleepFlag) === 0 || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || b2Math.b2Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
          b.m_sleepTime = 0.0;
          minSleepTime = 0.0;
        } else {
          b.m_sleepTime += dt;
          minSleepTime = b2Math.b2Min(minSleepTime, b.m_sleepTime);
        }
      }
      if (minSleepTime >= b2Settings.b2_timeToSleep) {
        _results = [];
        for (i = 0, _ref2 = this.m_bodyCount; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
          b = this.m_bodies[i];
          _results.push(b.m_flags |= b2Body.e_sleepFlag);
        }
        return _results;
      }
    };
    b2Island.prototype.AddBody = function(body) {
      return this.m_bodies[this.m_bodyCount++] = body;
    };
    b2Island.prototype.AddContact = function(contact) {
      return this.m_contacts[this.m_contactCount++] = contact;
    };
    b2Island.prototype.AddJoint = function(joint) {
      return this.m_joints[this.m_jointCount++] = joint;
    };
    b2Island.prototype.m_allocator = null;
    b2Island.prototype.m_bodies = null;
    b2Island.prototype.m_contacts = null;
    b2Island.prototype.m_joints = null;
    b2Island.prototype.m_bodyCount = 0;
    b2Island.prototype.m_jointCount = 0;
    b2Island.prototype.m_contactCount = 0;
    b2Island.prototype.m_bodyCapacity = 0;
    b2Island.prototype.m_contactCapacity = 0;
    b2Island.prototype.m_jointCapacity = 0;
    b2Island.prototype.m_positionError = null;
    return b2Island;
  })();
  b2Island.m_positionIterationCount = 0;
  
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
  var b2ContactConstraint;
  exports.b2ContactConstraint = b2ContactConstraint = b2ContactConstraint = (function() {
    b2ContactConstraint.prototype.points = null;
    b2ContactConstraint.prototype.normal = new b2Vec2();
    b2ContactConstraint.prototype.manifold = null;
    b2ContactConstraint.prototype.body1 = null;
    b2ContactConstraint.prototype.body2 = null;
    b2ContactConstraint.prototype.friction = null;
    b2ContactConstraint.prototype.restitution = null;
    b2ContactConstraint.prototype.pointCount = 0;
    function b2ContactConstraint() {
      var i, _ref;
      this.normal = new b2Vec2();
      this.points = new Array(b2Settings.b2_maxManifoldPoints);
      for (i = 0, _ref = b2Settings.b2_maxManifoldPoints; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.points[i] = new b2ContactConstraintPoint();
      }
    }
    return b2ContactConstraint;
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
  var b2ContactConstraintPoint;
  exports.b2ContactConstraintPoint = b2ContactConstraintPoint = b2ContactConstraintPoint = (function() {
    b2ContactConstraintPoint.prototype.localAnchor1 = new b2Vec2();
    b2ContactConstraintPoint.prototype.localAnchor2 = new b2Vec2();
    b2ContactConstraintPoint.prototype.normalImpulse = null;
    b2ContactConstraintPoint.prototype.tangentImpulse = null;
    b2ContactConstraintPoint.prototype.positionImpulse = null;
    b2ContactConstraintPoint.prototype.normalMass = null;
    b2ContactConstraintPoint.prototype.tangentMass = null;
    b2ContactConstraintPoint.prototype.separation = null;
    b2ContactConstraintPoint.prototype.velocityBias = null;
    function b2ContactConstraintPoint() {
      this.localAnchor1 = new b2Vec2();
      this.localAnchor2 = new b2Vec2();
    }
    return b2ContactConstraintPoint;
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
  var b2ContactRegister;
  exports.b2ContactRegister = b2ContactRegister = b2ContactRegister = (function() {
    function b2ContactRegister() {
      ({
        createFcn: null,
        destroyFcn: null,
        primary: null
      });
    }
    return b2ContactRegister;
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
  var b2ContactSolver;
  exports.b2ContactSolver = b2ContactSolver = b2ContactSolver = (function() {
    b2ContactSolver.prototype.m_allocator = null;
    b2ContactSolver.prototype.m_constraints = new Array();
    b2ContactSolver.prototype.m_constraintCount = 0;
    function b2ContactSolver(contacts, contactCount, allocator) {
      var b1, b2, c, ccp, contact, count, cp, friction, i, j, k, kNormal, kTangent, manifold, manifoldCount, manifolds, normalX, normalY, r1Sqr, r1X, r1Y, r2Sqr, r2X, r2Y, restitution, rn1, rn2, rt1, rt2, tMat, tVec, tX, tY, tangentX, tangentY, v1X, v1Y, v2X, v2Y, vRel, w1, w2, _ref, _ref2;
      this.m_constraints = new Array();
      this.m_allocator = allocator;
      this.m_constraintCount = 0;
      for (i = 0; 0 <= contactCount ? i < contactCount : i > contactCount; 0 <= contactCount ? i++ : i--) {
        this.m_constraintCount += contacts[i].GetManifoldCount();
      }
      for (i = 0, _ref = this.m_constraintCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.m_constraints[i] = new b2ContactConstraint();
      }
      count = 0;
      for (i = 0; 0 <= contactCount ? i < contactCount : i > contactCount; 0 <= contactCount ? i++ : i--) {
        contact = contacts[i];
        b1 = contact.m_shape1.m_body;
        b2 = contact.m_shape2.m_body;
        manifoldCount = contact.GetManifoldCount();
        manifolds = contact.GetManifolds();
        friction = contact.m_friction;
        restitution = contact.m_restitution;
        v1X = b1.m_linearVelocity.x;
        v1Y = b1.m_linearVelocity.y;
        v2X = b2.m_linearVelocity.x;
        v2Y = b2.m_linearVelocity.y;
        w1 = b1.m_angularVelocity;
        w2 = b2.m_angularVelocity;
        for (j = 0; 0 <= manifoldCount ? j < manifoldCount : j > manifoldCount; 0 <= manifoldCount ? j++ : j--) {
          manifold = manifolds[j];
          normalX = manifold.normal.x;
          normalY = manifold.normal.y;
          c = this.m_constraints[count];
          c.body1 = b1;
          c.body2 = b2;
          c.manifold = manifold;
          c.normal.x = normalX;
          c.normal.y = normalY;
          c.pointCount = manifold.pointCount;
          c.friction = friction;
          c.restitution = restitution;
          for (k = 0, _ref2 = c.pointCount; 0 <= _ref2 ? k < _ref2 : k > _ref2; 0 <= _ref2 ? k++ : k--) {
            cp = manifold.points[k];
            ccp = c.points[k];
            ccp.normalImpulse = cp.normalImpulse;
            ccp.tangentImpulse = cp.tangentImpulse;
            ccp.separation = cp.separation;
            r1X = cp.position.x - b1.m_position.x;
            r1Y = cp.position.y - b1.m_position.y;
            r2X = cp.position.x - b2.m_position.x;
            r2Y = cp.position.y - b2.m_position.y;
            tVec = ccp.localAnchor1;
            tMat = b1.m_R;
            tVec.x = r1X * tMat.col1.x + r1Y * tMat.col1.y;
            tVec.y = r1X * tMat.col2.x + r1Y * tMat.col2.y;
            tVec = ccp.localAnchor2;
            tMat = b2.m_R;
            tVec.x = r2X * tMat.col1.x + r2Y * tMat.col1.y;
            tVec.y = r2X * tMat.col2.x + r2Y * tMat.col2.y;
            r1Sqr = r1X * r1X + r1Y * r1Y;
            r2Sqr = r2X * r2X + r2Y * r2Y;
            rn1 = r1X * normalX + r1Y * normalY;
            rn2 = r2X * normalX + r2Y * normalY;
            kNormal = b1.m_invMass + b2.m_invMass;
            kNormal += b1.m_invI * (r1Sqr - rn1 * rn1) + b2.m_invI * (r2Sqr - rn2 * rn2);
            ccp.normalMass = 1.0 / kNormal;
            tangentX = normalY;
            tangentY = -normalX;
            rt1 = r1X * tangentX + r1Y * tangentY;
            rt2 = r2X * tangentX + r2Y * tangentY;
            kTangent = b1.m_invMass + b2.m_invMass;
            kTangent += b1.m_invI * (r1Sqr - rt1 * rt1) + b2.m_invI * (r2Sqr - rt2 * rt2);
            ccp.tangentMass = 1.0 / kTangent;
            ccp.velocityBias = 0.0;
            if (ccp.separation > 0.0) {
              ccp.velocityBias = -60.0 * ccp.separation;
            }
            tX = v2X + (-w2 * r2Y) - v1X - (-w1 * r1Y);
            tY = v2Y + (w2 * r2X) - v1Y - (w1 * r1X);
            vRel = c.normal.x * tX + c.normal.y * tY;
            if (vRel < -b2Settings.b2_velocityThreshold) {
              ccp.velocityBias += -c.restitution * vRel;
            }
          }
          ++count;
        }
      }
    }
    b2ContactSolver.prototype.PreSolve = function() {
      var PX, PY, b1, b2, c, ccp, ccp2, i, invI1, invI2, invMass1, invMass2, j, normalX, normalY, r1X, r1Y, r2X, r2Y, tCount, tMat, tVec, tangentX, tangentY, _ref, _results;
      _results = [];
      for (i = 0, _ref = this.m_constraintCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        c = this.m_constraints[i];
        b1 = c.body1;
        b2 = c.body2;
        invMass1 = b1.m_invMass;
        invI1 = b1.m_invI;
        invMass2 = b2.m_invMass;
        invI2 = b2.m_invI;
        normalX = c.normal.x;
        normalY = c.normal.y;
        tangentX = normalY;
        tangentY = -normalX;
        j = 0;
        tCount = 0;
        _results.push((function() {
          var _results2, _results3;
          if (b2World.s_enableWarmStarting) {
            tCount = c.pointCount;
            _results2 = [];
            for (j = 0; 0 <= tCount ? j < tCount : j > tCount; 0 <= tCount ? j++ : j--) {
              ccp = c.points[j];
              PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
              PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
              tMat = b1.m_R;
              tVec = ccp.localAnchor1;
              r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
              r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
              tMat = b2.m_R;
              tVec = ccp.localAnchor2;
              r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
              r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
              b1.m_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
              b1.m_linearVelocity.x -= invMass1 * PX;
              b1.m_linearVelocity.y -= invMass1 * PY;
              b2.m_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
              b2.m_linearVelocity.x += invMass2 * PX;
              b2.m_linearVelocity.y += invMass2 * PY;
              _results2.push(ccp.positionImpulse = 0.0);
            }
            return _results2;
          } else {
            tCount = c.pointCount;
            _results3 = [];
            for (j = 0; 0 <= tCount ? j < tCount : j > tCount; 0 <= tCount ? j++ : j--) {
              ccp2 = c.points[j];
              ccp2.normalImpulse = 0.0;
              ccp2.tangentImpulse = 0.0;
              _results3.push(ccp2.positionImpulse = 0.0);
            }
            return _results3;
          }
        })());
      }
      return _results;
    };
    b2ContactSolver.prototype.SolveVelocityConstraints = function() {
      var PX, PY, b1, b1_angularVelocity, b1_linearVelocity, b2, b2_angularVelocity, b2_linearVelocity, c, ccp, dvX, dvY, i, invI1, invI2, invMass1, invMass2, j, lambda, maxFriction, newImpulse, normalX, normalY, r1X, r1Y, r2X, r2Y, tCount, tMat, tVec, tangentX, tangentY, vn, vt, _ref, _results;
      _results = [];
      for (i = 0, _ref = this.m_constraintCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        c = this.m_constraints[i];
        b1 = c.body1;
        b2 = c.body2;
        b1_angularVelocity = b1.m_angularVelocity;
        b1_linearVelocity = b1.m_linearVelocity;
        b2_angularVelocity = b2.m_angularVelocity;
        b2_linearVelocity = b2.m_linearVelocity;
        invMass1 = b1.m_invMass;
        invI1 = b1.m_invI;
        invMass2 = b2.m_invMass;
        invI2 = b2.m_invI;
        normalX = c.normal.x;
        normalY = c.normal.y;
        tangentX = normalY;
        tangentY = -normalX;
        tCount = c.pointCount;
        for (j = 0; 0 <= tCount ? j < tCount : j > tCount; 0 <= tCount ? j++ : j--) {
          ccp = c.points[j];
          tMat = b1.m_R;
          tVec = ccp.localAnchor1;
          r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
          r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
          tMat = b2.m_R;
          tVec = ccp.localAnchor2;
          r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
          r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
          dvX = b2_linearVelocity.x + (-b2_angularVelocity * r2Y) - b1_linearVelocity.x - (-b1_angularVelocity * r1Y);
          dvY = b2_linearVelocity.y + (b2_angularVelocity * r2X) - b1_linearVelocity.y - (b1_angularVelocity * r1X);
          vn = dvX * normalX + dvY * normalY;
          lambda = -ccp.normalMass * (vn - ccp.velocityBias);
          newImpulse = b2Math.b2Max(ccp.normalImpulse + lambda, 0.0);
          lambda = newImpulse - ccp.normalImpulse;
          PX = lambda * normalX;
          PY = lambda * normalY;
          b1_linearVelocity.x -= invMass1 * PX;
          b1_linearVelocity.y -= invMass1 * PY;
          b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
          b2_linearVelocity.x += invMass2 * PX;
          b2_linearVelocity.y += invMass2 * PY;
          b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
          ccp.normalImpulse = newImpulse;
          dvX = b2_linearVelocity.x + (-b2_angularVelocity * r2Y) - b1_linearVelocity.x - (-b1_angularVelocity * r1Y);
          dvY = b2_linearVelocity.y + (b2_angularVelocity * r2X) - b1_linearVelocity.y - (b1_angularVelocity * r1X);
          vt = dvX * tangentX + dvY * tangentY;
          lambda = ccp.tangentMass * (-vt);
          maxFriction = c.friction * ccp.normalImpulse;
          newImpulse = b2Math.b2Clamp(ccp.tangentImpulse + lambda, -maxFriction, maxFriction);
          lambda = newImpulse - ccp.tangentImpulse;
          PX = lambda * tangentX;
          PY = lambda * tangentY;
          b1_linearVelocity.x -= invMass1 * PX;
          b1_linearVelocity.y -= invMass1 * PY;
          b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
          b2_linearVelocity.x += invMass2 * PX;
          b2_linearVelocity.y += invMass2 * PY;
          b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
          ccp.tangentImpulse = newImpulse;
        }
        b1.m_angularVelocity = b1_angularVelocity;
        _results.push(b2.m_angularVelocity = b2_angularVelocity);
      }
      return _results;
    };
    b2ContactSolver.prototype.SolvePositionConstraints = function(beta) {
      var C, b1, b1_position, b1_rotation, b2, b2_position, b2_rotation, c, ccp, dImpulse, dpX, dpY, i, impulse0, impulseX, impulseY, invI1, invI2, invMass1, invMass2, j, minSeparation, normalX, normalY, p1X, p1Y, p2X, p2Y, r1X, r1Y, r2X, r2Y, separation, tCount, tMat, tVec, tangentX, tangentY, _ref;
      for (i = 0, _ref = this.m_constraintCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        c = this.m_constraints[i];
        b1 = c.body1;
        b2 = c.body2;
        b1_position = b1.m_position;
        b1_rotation = b1.m_rotation;
        b2_position = b2.m_position;
        b2_rotation = b2.m_rotation;
        invMass1 = b1.m_invMass;
        invI1 = b1.m_invI;
        invMass2 = b2.m_invMass;
        invI2 = b2.m_invI;
        normalX = c.normal.x;
        normalY = c.normal.y;
        tangentX = normalY;
        tangentY = -normalX;
        tCount = c.pointCount;
        for (j = 0; 0 <= tCount ? j < tCount : j > tCount; 0 <= tCount ? j++ : j--) {
          ccp = c.points[j];
          tMat = b1.m_R;
          tVec = ccp.localAnchor1;
          r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
          r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
          tMat = b2.m_R;
          tVec = ccp.localAnchor2;
          r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
          r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
          p1X = b1_position.x + r1X;
          p1Y = b1_position.y + r1Y;
          p2X = b2_position.x + r2X;
          p2Y = b2_position.y + r2Y;
          dpX = p2X - p1X;
          dpY = p2Y - p1Y;
          separation = (dpX * normalX + dpY * normalY) + ccp.separation;
          minSeparation = b2Math.b2Min(minSeparation, separation);
          C = beta * b2Math.b2Clamp(separation + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
          dImpulse = -ccp.normalMass * C;
          impulse0 = ccp.positionImpulse;
          ccp.positionImpulse = b2Math.b2Max(impulse0 + dImpulse, 0.0);
          dImpulse = ccp.positionImpulse - impulse0;
          impulseX = dImpulse * normalX;
          impulseY = dImpulse * normalY;
          b1_position.x -= invMass1 * impulseX;
          b1_position.y -= invMass1 * impulseY;
          b1_rotation -= invI1 * (r1X * impulseY - r1Y * impulseX);
          b1.m_R.Set(b1_rotation);
          b2_position.x += invMass2 * impulseX;
          b2_position.y += invMass2 * impulseY;
          b2_rotation += invI2 * (r2X * impulseY - r2Y * impulseX);
          b2.m_R.Set(b2_rotation);
        }
        b1.m_rotation = b1_rotation;
        b2.m_rotation = b2_rotation;
      }
      return minSeparation >= -b2Settings.b2_linearSlop;
    };
    b2ContactSolver.prototype.PostSolve = function() {
      var c, cPoint, i, j, m, mPoint, _ref, _results;
      _results = [];
      for (i = 0, _ref = this.m_constraintCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        c = this.m_constraints[i];
        m = c.manifold;
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (j = 0, _ref2 = c.pointCount; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
            mPoint = m.points[j];
            cPoint = c.points[j];
            mPoint.normalImpulse = cPoint.normalImpulse;
            _results2.push(mPoint.tangentImpulse = cPoint.tangentImpulse);
          }
          return _results2;
        })());
      }
      return _results;
    };
    return b2ContactSolver;
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
  var b2CircleContact;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2CircleContact = b2CircleContact = b2CircleContact = (function() {
    __extends(b2CircleContact, b2Contact);
    function b2CircleContact(s1, s2) {
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
      this.m_manifold = [new b2Manifold()];
      this.m_manifold[0].pointCount = 0;
      this.m_manifold[0].points[0].normalImpulse = 0.0;
      this.m_manifold[0].points[0].tangentImpulse = 0.0;
    }
    b2CircleContact.prototype.Evaluate = function() {
      b2Collision.b2CollideCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, false);
      if (this.m_manifold[0].pointCount > 0) {
        return this.m_manifoldCount = 1;
      } else {
        return this.m_manifoldCount = 0;
      }
    };
    b2CircleContact.prototype.GetManifolds = function() {
      return this.m_manifold;
    };
    b2CircleContact.prototype.m_manifold = [new b2Manifold()];
    return b2CircleContact;
  })();
  b2CircleContact.Create = function(shape1, shape2, allocator) {
    return new b2CircleContact(shape1, shape2);
  };
  b2CircleContact.Destroy = function(contact, allocator) {};
  
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
  var b2Conservative;
  exports.b2Conservative = b2Conservative = b2Conservative = (function() {
    function b2Conservative() {}
    return b2Conservative;
  })();
  b2Conservative.R1 = new b2Mat22();
  b2Conservative.R2 = new b2Mat22();
  b2Conservative.x1 = new b2Vec2();
  b2Conservative.x2 = new b2Vec2();
  b2Conservative.Conservative = function(shape1, shape2) {
    var a1, a1Start, a2, a2Start, body1, body2, dLen, dX, dY, distance, ds, hit, invRelativeVelocity, iter, length, maxIterations, omega1, omega2, p1StartX, p1StartY, p1X, p1Y, p2StartX, p2StartY, p2X, p2Y, r1, r2, relativeVelocity, s1, s2, v1X, v1Y, v2X, v2Y;
    body1 = shape1.GetBody();
    body2 = shape2.GetBody();
    v1X = body1.m_position.x - body1.m_position0.x;
    v1Y = body1.m_position.y - body1.m_position0.y;
    omega1 = body1.m_rotation - body1.m_rotation0;
    v2X = body2.m_position.x - body2.m_position0.x;
    v2Y = body2.m_position.y - body2.m_position0.y;
    omega2 = body2.m_rotation - body2.m_rotation0;
    r1 = shape1.GetMaxRadius();
    r2 = shape2.GetMaxRadius();
    p1StartX = body1.m_position0.x;
    p1StartY = body1.m_position0.y;
    a1Start = body1.m_rotation0;
    p2StartX = body2.m_position0.x;
    p2StartY = body2.m_position0.y;
    a2Start = body2.m_rotation0;
    p1X = p1StartX;
    p1Y = p1StartY;
    a1 = a1Start;
    p2X = p2StartX;
    p2Y = p2StartY;
    a2 = a2Start;
    b2Conservative.R1.Set(a1);
    b2Conservative.R2.Set(a2);
    shape1.QuickSync(p1, b2Conservative.R1);
    shape2.QuickSync(p2, b2Conservative.R2);
    s1 = 0.0;
    maxIterations = 10;
    invRelativeVelocity = 0.0;
    hit = true;
    for (iter = 0; 0 <= maxIterations ? iter < maxIterations : iter > maxIterations; 0 <= maxIterations ? iter++ : iter--) {
      distance = b2Distance.Distance(b2Conservative.x1, b2Conservative.x2, shape1, shape2);
      if (distance < b2Settings.b2_linearSlop) {
        if (iter === 0) {
          hit = false;
        } else {
          hit = true;
        }
        break;
      }
      if (iter === 0) {
        dX = b2Conservative.x2.x - b2Conservative.x1.x;
        dY = b2Conservative.x2.y - b2Conservative.x1.y;
        dLen = Math.sqrt(dX * dX + dY * dY);
        relativeVelocity = (dX * (v1X - v2X) + dY * (v1Y - v2Y)) + Math.abs(omega1) * r1 + Math.abs(omega2) * r2;
        if (Math.abs(relativeVelocity) < Number.MIN_VALUE) {
          hit = false;
          break;
        }
        invRelativeVelocity = 1.0 / relativeVelocity;
      }
      ds = distance * invRelativeVelocity;
      s2 = s1 + ds;
      if (s2 < 0.0 || 1.0 < s2) {
        hit = false;
        break;
      }
      if (s2 < (1.0 + 100.0 * Number.MIN_VALUE) * s1) {
        hit = true;
        break;
      }
      s1 = s2;
      p1X = p1StartX + s1 * v1.x;
      p1Y = p1StartY + s1 * v1.y;
      a1 = a1Start + s1 * omega1;
      p2X = p2StartX + s1 * v2.x;
      p2Y = p2StartY + s1 * v2.y;
      a2 = a2Start + s1 * omega2;
      b2Conservative.R1.Set(a1);
      b2Conservative.R2.Set(a2);
      shape1.QuickSync(p1, b2Conservative.R1);
      shape2.QuickSync(p2, b2Conservative.R2);
    }
    if (hit) {
      dX = b2Conservative.x2.x - b2Conservative.x1.x;
      dY = b2Conservative.x2.y - b2Conservative.x1.y;
      length = Math.sqrt(dX * dX + dY * dY);
      d *= b2_linearSlop / lengthif(length > FLT_EPSILON);
      if (body1.IsStatic()) {
        body1.m_position.x = p1X;
        body1.m_position.y = p1Y;
      } else {
        body1.m_position.x = p1X - dX;
        body1.m_position.y = p1Y - dY;
      }
      body1.m_rotation = a1;
      body1.m_R.Set(a1);
      body1.QuickSyncShapes();
      if (body2.IsStatic()) {
        body2.m_position.x = p2X;
        body2.m_position.y = p2Y;
      } else {
        body2.m_position.x = p2X + dX;
        body2.m_position.y = p2Y + dY;
      }
      body2.m_position.x = p2X + dX;
      body2.m_position.y = p2Y + dY;
      body2.m_rotation = a2;
      body2.m_R.Set(a2);
      body2.QuickSyncShapes();
      return true;
    }
    shape1.QuickSync(body1.m_position, body1.m_R);
    shape2.QuickSync(body2.m_position, body2.m_R);
    return false;
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
  
  var b2PolyAndCircleContact;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2PolyAndCircleContact = b2PolyAndCircleContact = b2PolyAndCircleContact = (function() {
    __extends(b2PolyAndCircleContact, b2Contact);
    function b2PolyAndCircleContact(s1, s2) {
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
      this.m_manifold = [new b2Manifold()];
      b2Settings.b2Assert(this.m_shape1.m_type === b2Shape.e_polyShape);
      b2Settings.b2Assert(this.m_shape2.m_type === b2Shape.e_circleShape);
      this.m_manifold[0].pointCount = 0;
      this.m_manifold[0].points[0].normalImpulse = 0.0;
      this.m_manifold[0].points[0].tangentImpulse = 0.0;
    }
    b2PolyAndCircleContact.prototype.Evaluate = function() {
      b2Collision.b2CollidePolyAndCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, false);
      if (this.m_manifold[0].pointCount > 0) {
        return this.m_manifoldCount = 1;
      } else {
        return this.m_manifoldCount = 0;
      }
    };
    b2PolyAndCircleContact.prototype.GetManifolds = function() {
      return this.m_manifold;
    };
    b2PolyAndCircleContact.prototype.m_manifold = [new b2Manifold()];
    return b2PolyAndCircleContact;
  })();
  b2PolyAndCircleContact.Create = function(shape1, shape2, allocator) {
    return new b2PolyAndCircleContact(shape1, shape2);
  };
  b2PolyAndCircleContact.Destroy = function(contact, allocator) {};
  
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
  var b2PolyContact;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2PolyContact = b2PolyContact = b2PolyContact = (function() {
    __extends(b2PolyContact, b2Contact);
    function b2PolyContact(s1, s2) {
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
      this.m0 = new b2Manifold();
      this.m_manifold = [new b2Manifold()];
      this.m_manifold[0].pointCount = 0;
    }
    b2PolyContact.prototype.m0 = new b2Manifold();
    b2PolyContact.prototype.Evaluate = function() {
      var cp, cp0, i, id0, idKey, j, k, match, tMani, tPoint, tPoint0, tPoints, _ref, _ref2, _ref3;
      tMani = this.m_manifold[0];
      tPoints = this.m0.points;
      for (k = 0, _ref = tMani.pointCount; 0 <= _ref ? k < _ref : k > _ref; 0 <= _ref ? k++ : k--) {
        tPoint = tPoints[k];
        tPoint0 = tMani.points[k];
        tPoint.normalImpulse = tPoint0.normalImpulse;
        tPoint.tangentImpulse = tPoint0.tangentImpulse;
        tPoint.id = tPoint0.id.Copy();
      }
      this.m0.pointCount = tMani.pointCount;
      b2Collision.b2CollidePoly(tMani, this.m_shape1, this.m_shape2, false);
      if (tMani.pointCount > 0) {
        match = [false, false];
        for (i = 0, _ref2 = tMani.pointCount; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
          cp = tMani.points[i];
          cp.normalImpulse = 0.0;
          cp.tangentImpulse = 0.0;
          idKey = cp.id.key;
          for (j = 0, _ref3 = this.m0.pointCount; 0 <= _ref3 ? j < _ref3 : j > _ref3; 0 <= _ref3 ? j++ : j--) {
            if (match[j] === true) {
              continue;
            }
            cp0 = this.m0.points[j];
            id0 = cp0.id;
            if (id0.key === idKey) {
              match[j] = true;
              cp.normalImpulse = cp0.normalImpulse;
              cp.tangentImpulse = cp0.tangentImpulse;
              break;
            }
          }
        }
        return this.m_manifoldCount = 1;
      } else {
        return this.m_manifoldCount = 0;
      }
    };
    b2PolyContact.prototype.GetManifolds = function() {
      return this.m_manifold;
    };
    b2PolyContact.prototype.m_manifold = [new b2Manifold()];
    return b2PolyContact;
  })();
  b2PolyContact.Create = function(shape1, shape2, allocator) {
    return new b2PolyContact(shape1, shape2);
  };
  b2PolyContact.Destroy = function(contact, allocator) {};
  
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
                cn = cn.next;
              }
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
                }
                jn = jn.next;
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
  b2World.s_enablePositionCorrection = 1;
  b2World.s_enableWarmStarting = 1;
  
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
  var b2WorldListener;
  exports.b2WorldListener = b2WorldListener = b2WorldListener = (function() {
    function b2WorldListener() {}
    b2WorldListener.prototype.NotifyJointDestroyed = function(joint) {};
    b2WorldListener.prototype.NotifyBoundaryViolated = function(body) {
      return b2WorldListener.b2_freezeBody;
    };
    return b2WorldListener;
  })();
  b2WorldListener.b2_freezeBody = 0;
  b2WorldListener.b2_destroyBody = 1;
  
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
  var b2JointNode;
  exports.b2JointNode = b2JointNode = b2JointNode = (function() {
    function b2JointNode() {}
    b2JointNode.prototype.other = null;
    b2JointNode.prototype.joint = null;
    b2JointNode.prototype.prev = null;
    b2JointNode.prototype.next = null;
    return b2JointNode;
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
  var b2Joint;
  exports.b2Joint = b2Joint = b2Joint = (function() {
    function b2Joint(def) {
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = def.body1;
      this.m_body2 = def.body2;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
    }
    b2Joint.prototype.GetType = function() {
      return this.m_type;
    };
    b2Joint.prototype.GetAnchor1 = function() {
      return null;
    };
    b2Joint.prototype.GetAnchor2 = function() {
      return null;
    };
    b2Joint.prototype.GetReactionForce = function(invTimeStep) {
      return null;
    };
    b2Joint.prototype.GetReactionTorque = function(invTimeStep) {
      return 0.0;
    };
    b2Joint.prototype.GetBody1 = function() {
      return this.m_body1;
    };
    b2Joint.prototype.GetBody2 = function() {
      return this.m_body2;
    };
    b2Joint.prototype.GetNext = function() {
      return this.m_next;
    };
    b2Joint.prototype.GetUserData = function() {
      return this.m_userData;
    };
    b2Joint.prototype.PrepareVelocitySolver = function() {};
    b2Joint.prototype.SolveVelocityConstraints = function(step) {};
    b2Joint.prototype.PreparePositionSolver = function() {};
    b2Joint.prototype.SolvePositionConstraints = function() {
      return false;
    };
    b2Joint.prototype.m_type = 0;
    b2Joint.prototype.m_prev = null;
    b2Joint.prototype.m_next = null;
    b2Joint.prototype.m_node1 = new b2JointNode();
    b2Joint.prototype.m_node2 = new b2JointNode();
    b2Joint.prototype.m_body1 = null;
    b2Joint.prototype.m_body2 = null;
    b2Joint.prototype.m_islandFlag = null;
    b2Joint.prototype.m_collideConnected = null;
    b2Joint.prototype.m_userData = null;
    return b2Joint;
  })();
  b2Joint.Create = function(def, allocator) {
    var joint;
    joint = null;
    switch (def.type) {
      case b2Joint.e_distanceJoint:
        joint = new b2DistanceJoint(def);
        break;
      case b2Joint.e_mouseJoint:
        joint = new b2MouseJoint(def);
        break;
      case b2Joint.e_prismaticJoint:
        joint = new b2PrismaticJoint(def);
        break;
      case b2Joint.e_revoluteJoint:
        joint = new b2RevoluteJoint(def);
        break;
      case b2Joint.e_pulleyJoint:
        joint = new b2PulleyJoint(def);
        break;
      case b2Joint.e_gearJoint:
        joint = new b2GearJoint(def);
        break;
      default:
        break;
    }
    return joint;
  };
  b2Joint.Destroy = function(joint, allocator) {
    switch (joint.m_type) {
      case b2Joint.e_distanceJoint:
        return allocator.Free(joint, sizeof(b2DistanceJoint));
      case b2Joint.e_mouseJoint:
        return allocator.Free(joint, sizeof(b2MouseJoint));
      case b2Joint.e_prismaticJoint:
        return allocator.Free(joint, sizeof(e_prismaticJoint));
      case b2Joint.e_revoluteJoint:
        return allocator.Free(joint, sizeof(b2RevoluteJoint));
      case b2Joint.e_pulleyJoint:
        return allocator.Free(joint, sizeof(b2PulleyJoint));
      case b2Joint.e_gearJoint:
        return allocator.Free(joint, sizeof(b2GearJoint));
      default:
        return b2Assert(false);
    }
  };
  b2Joint.e_unknownJoint = 0;
  b2Joint.e_revoluteJoint = 1;
  b2Joint.e_prismaticJoint = 2;
  b2Joint.e_distanceJoint = 3;
  b2Joint.e_pulleyJoint = 4;
  b2Joint.e_mouseJoint = 5;
  b2Joint.e_gearJoint = 6;
  b2Joint.e_inactiveLimit = 0;
  b2Joint.e_atLowerLimit = 1;
  b2Joint.e_atUpperLimit = 2;
  b2Joint.e_equalLimits = 3;
  
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
  var b2JointDef;
  exports.b2JointDef = b2JointDef = b2JointDef = (function() {
    b2JointDef.prototype.type = 0;
    b2JointDef.prototype.userData = null;
    b2JointDef.prototype.body1 = null;
    b2JointDef.prototype.body2 = null;
    b2JointDef.prototype.collideConnected = null;
    function b2JointDef() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
    }
    return b2JointDef;
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
  var b2DistanceJoint;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2DistanceJoint = b2DistanceJoint = b2DistanceJoint = (function() {
    __extends(b2DistanceJoint, b2Joint);
    function b2DistanceJoint() {
      var tMat, tX, tY;
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = def.body1;
      this.m_body2 = def.body2;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u = new b2Vec2();
      tMat = this.m_body1.m_R;
      tX = def.anchorPoint1.x - this.m_body1.m_position.x;
      tY = def.anchorPoint1.y - this.m_body1.m_position.y;
      this.m_localAnchor1.x = tX * tMat.col1.x + tY * tMat.col1.y;
      this.m_localAnchor1.y = tX * tMat.col2.x + tY * tMat.col2.y;
      tMat = this.m_body2.m_R;
      tX = def.anchorPoint2.x - this.m_body2.m_position.x;
      tY = def.anchorPoint2.y - this.m_body2.m_position.y;
      this.m_localAnchor2.x = tX * tMat.col1.x + tY * tMat.col1.y;
      this.m_localAnchor2.y = tX * tMat.col2.x + tY * tMat.col2.y;
      tX = def.anchorPoint2.x - def.anchorPoint1.x;
      tY = def.anchorPoint2.y - def.anchorPoint1.y;
      this.m_length = Math.sqrt(tX * tX + tY * tY);
      this.m_impulse = 0.0;
    }
    b2DistanceJoint.prototype.PrepareVelocitySolver = function() {
      var PX, PY, cr1u, cr2u, length, r1X, r1Y, r2X, r2Y, tMat;
      tMat = this.m_body1.m_R;
      r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
      r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
      tMat = this.m_body2.m_R;
      r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
      r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
      this.m_u.x = this.m_body2.m_position.x + r2X - this.m_body1.m_position.x - r1X;
      this.m_u.y = this.m_body2.m_position.y + r2Y - this.m_body1.m_position.y - r1Y;
      length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
      if (length > b2Settings.b2_linearSlop) {
        this.m_u.Multiply(1.0 / length);
      } else {
        this.m_u.SetZero();
      }
      cr1u = r1X * this.m_u.y - r1Y * this.m_u.x;
      cr2u = r2X * this.m_u.y - r2Y * this.m_u.x;
      this.m_mass = this.m_body1.m_invMass + this.m_body1.m_invI * cr1u * cr1u + this.m_body2.m_invMass + this.m_body2.m_invI * cr2u * cr2u;
      this.m_mass = 1.0 / this.m_mass;
      if (b2World.s_enableWarmStarting) {
        PX = this.m_impulse * this.m_u.x;
        PY = this.m_impulse * this.m_u.y;
        this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * PX;
        this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * PY;
        this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
        this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * PX;
        this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * PY;
        return this.m_body2.m_angularVelocity += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
      } else {
        return this.m_impulse = 0.0;
      }
    };
    b2DistanceJoint.prototype.SolveVelocityConstraints = function(step) {
      var Cdot, PX, PY, impulse, r1X, r1Y, r2X, r2Y, tMat, v1X, v1Y, v2X, v2Y;
      tMat = this.m_body1.m_R;
      r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
      r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
      tMat = this.m_body2.m_R;
      r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
      r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
      v1X = this.m_body1.m_linearVelocity.x + (-this.m_body1.m_angularVelocity * r1Y);
      v1Y = this.m_body1.m_linearVelocity.y + (this.m_body1.m_angularVelocity * r1X);
      v2X = this.m_body2.m_linearVelocity.x + (-this.m_body2.m_angularVelocity * r2Y);
      v2Y = this.m_body2.m_linearVelocity.y + (this.m_body2.m_angularVelocity * r2X);
      Cdot = this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y);
      impulse = -this.m_mass * Cdot;
      this.m_impulse += impulse;
      PX = impulse * this.m_u.x;
      PY = impulse * this.m_u.y;
      this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * PX;
      this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * PY;
      this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
      this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * PX;
      this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * PY;
      return this.m_body2.m_angularVelocity += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
    };
    b2DistanceJoint.prototype.SolvePositionConstraints = function() {
      var C, PX, PY, dX, dY, impulse, length, r1X, r1Y, r2X, r2Y, tMat;
      tMat = this.m_body1.m_R;
      r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
      r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
      tMat = this.m_body2.m_R;
      r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
      r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
      dX = this.m_body2.m_position.x + r2X - this.m_body1.m_position.x - r1X;
      dY = this.m_body2.m_position.y + r2Y - this.m_body1.m_position.y - r1Y;
      length = Math.sqrt(dX * dX + dY * dY);
      dX /= length;
      dY /= length;
      C = length - this.m_length;
      C = b2Math.b2Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
      impulse = -this.m_mass * C;
      this.m_u.Set(dX, dY);
      PX = impulse * this.m_u.x;
      PY = impulse * this.m_u.y;
      this.m_body1.m_position.x -= this.m_body1.m_invMass * PX;
      this.m_body1.m_position.y -= this.m_body1.m_invMass * PY;
      this.m_body1.m_rotation -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
      this.m_body2.m_position.x += this.m_body2.m_invMass * PX;
      this.m_body2.m_position.y += this.m_body2.m_invMass * PY;
      this.m_body2.m_rotation += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
      this.m_body1.m_R.Set(this.m_body1.m_rotation);
      this.m_body2.m_R.Set(this.m_body2.m_rotation);
      return b2Math.b2Abs(C) < b2Settings.b2_linearSlop;
    };
    b2DistanceJoint.prototype.GetAnchor1 = function() {
      return b2Math.AddVV(this.m_body1.m_position, b2Math.b2MulMV(this.m_body1.m_R, this.m_localAnchor1));
    };
    b2DistanceJoint.prototype.GetAnchor2 = function() {
      return b2Math.AddVV(this.m_body2.m_position, b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor2));
    };
    b2DistanceJoint.prototype.GetReactionForce = function(invTimeStep) {
      var F;
      F = new b2Vec2();
      F.SetV(this.m_u);
      F.Multiply(this.m_impulse * invTimeStep);
      return F;
    };
    b2DistanceJoint.prototype.GetReactionTorque = function(invTimeStep) {
      return 0.0;
    };
    b2DistanceJoint.prototype.m_localAnchor1 = new b2Vec2();
    b2DistanceJoint.prototype.m_localAnchor2 = new b2Vec2();
    b2DistanceJoint.prototype.m_u = new b2Vec2();
    b2DistanceJoint.prototype.m_impulse = null;
    b2DistanceJoint.prototype.m_mass = null;
    b2DistanceJoint.prototype.m_length = null;
    return b2DistanceJoint;
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
  var b2DistanceJointDef;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2DistanceJointDef = b2DistanceJointDef = b2DistanceJointDef = (function() {
    __extends(b2DistanceJointDef, b2JointDef);
    b2DistanceJointDef.prototype.anchorPoint1 = new b2Vec2();
    b2DistanceJointDef.prototype.anchorPoint2 = new b2Vec2();
    function b2DistanceJointDef() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.anchorPoint1 = new b2Vec2();
      this.anchorPoint2 = new b2Vec2();
      this.type = b2Joint.e_distanceJoint;
    }
    return b2DistanceJointDef;
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
  var b2Jacobian;
  exports.b2Jacobian = b2Jacobian = b2Jacobian = (function() {
    b2Jacobian.prototype.linear1 = new b2Vec2();
    b2Jacobian.prototype.angular1 = null;
    b2Jacobian.prototype.linear2 = new b2Vec2();
    b2Jacobian.prototype.angular2 = null;
    function b2Jacobian() {
      this.linear1 = new b2Vec2();
      this.linear2 = new b2Vec2();
    }
    b2Jacobian.prototype.SetZero = function() {
      this.linear1.SetZero();
      this.angular1 = 0.0;
      this.linear2.SetZero();
      return this.angular2 = 0.0;
    };
    b2Jacobian.prototype.Set = function(x1, a1, x2, a2) {
      this.linear1.SetV(x1);
      this.angular1 = a1;
      this.linear2.SetV(x2);
      return this.angular2 = a2;
    };
    b2Jacobian.prototype.Compute = function(x1, a1, x2, a2) {
      return (this.linear1.x * x1.x + this.linear1.y * x1.y) + this.angular1 * a1 + (this.linear2.x * x2.x + this.linear2.y * x2.y) + this.angular2 * a2;
    };
    return b2Jacobian;
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
  var b2GearJoint;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2GearJoint = b2GearJoint = b2GearJoint = (function() {
    __extends(b2GearJoint, b2Joint);
    function b2GearJoint() {
      var coordinate1, coordinate2;
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = def.body1;
      this.m_body2 = def.body2;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_J = new b2Jacobian();
      this.m_revolute1 = null;
      this.m_prismatic1 = null;
      this.m_revolute2 = null;
      this.m_prismatic2 = null;
      this.m_ground1 = def.joint1.m_body1;
      this.m_body1 = def.joint1.m_body2;
      if (def.joint1.m_type === b2Joint.e_revoluteJoint) {
        this.m_revolute1 = def.joint1;
        this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
        this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
        coordinate1 = this.m_revolute1.GetJointAngle();
      } else {
        this.m_prismatic1 = def.joint1;
        this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
        this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
        coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      this.m_ground2 = def.joint2.m_body1;
      this.m_body2 = def.joint2.m_body2;
      if (def.joint2.m_type === b2Joint.e_revoluteJoint) {
        this.m_revolute2 = def.joint2;
        this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
        this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
        coordinate2 = this.m_revolute2.GetJointAngle();
      } else {
        this.m_prismatic2 = def.joint2;
        this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
        this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
        coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      this.m_ratio = def.ratio;
      this.m_constant = coordinate1 + this.m_ratio * coordinate2;
      this.m_impulse = 0.0;
    }
    b2GearJoint.prototype.GetAnchor1 = function() {
      var tMat;
      tMat = this.m_body1.m_R;
      return new b2Vec2(this.m_body1.m_position.x + (tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y));
    };
    b2GearJoint.prototype.GetAnchor2 = function() {
      var tMat;
      tMat = this.m_body2.m_R;
      return new b2Vec2(this.m_body2.m_position.x + (tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y));
    };
    b2GearJoint.prototype.GetReactionForce = function(invTimeStep) {
      return new b2Vec2();
    };
    b2GearJoint.prototype.GetReactionTorque = function(invTimeStep) {
      return 0.0;
    };
    b2GearJoint.prototype.GetRatio = function() {
      return this.m_ratio;
    };
    b2GearJoint.prototype.PrepareVelocitySolver = function() {
      var K, b1, b2, crug, g1, g2, rX, rY, tMat, tVec, ugX, ugY;
      g1 = this.m_ground1;
      g2 = this.m_ground2;
      b1 = this.m_body1;
      b2 = this.m_body2;
      K = 0.0;
      this.m_J.SetZero();
      if (this.m_revolute1) {
        this.m_J.angular1 = -1.0;
        K += b1.m_invI;
      } else {
        tMat = g1.m_R;
        tVec = this.m_prismatic1.m_localXAxis1;
        ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tMat = b1.m_R;
        rX = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        rY = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        crug = rX * ugY - rY * ugX;
        this.m_J.linear1.Set(-ugX, -ugY);
        this.m_J.angular1 = -crug;
        K += b1.m_invMass + b1.m_invI * crug * crug;
      }
      if (this.m_revolute2) {
        this.m_J.angular2 = -this.m_ratio;
        K += this.m_ratio * this.m_ratio * b2.m_invI;
      } else {
        tMat = g2.m_R;
        tVec = this.m_prismatic2.m_localXAxis1;
        ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tMat = b2.m_R;
        rX = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        rY = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        crug = rX * ugY - rY * ugX;
        this.m_J.linear2.Set(-this.m_ratio * ugX, -this.m_ratio * ugY);
        this.m_J.angular2 = -this.m_ratio * crug;
        K += this.m_ratio * this.m_ratio * (b2.m_invMass + b2.m_invI * crug * crug);
      }
      this.m_mass = 1.0 / K;
      b1.m_linearVelocity.x += b1.m_invMass * this.m_impulse * this.m_J.linear1.x;
      b1.m_linearVelocity.y += b1.m_invMass * this.m_impulse * this.m_J.linear1.y;
      b1.m_angularVelocity += b1.m_invI * this.m_impulse * this.m_J.angular1;
      b2.m_linearVelocity.x += b2.m_invMass * this.m_impulse * this.m_J.linear2.x;
      b2.m_linearVelocity.y += b2.m_invMass * this.m_impulse * this.m_J.linear2.y;
      return b2.m_angularVelocity += b2.m_invI * this.m_impulse * this.m_J.angular2;
    };
    b2GearJoint.prototype.SolveVelocityConstraints = function(step) {
      var Cdot, b1, b2, impulse;
      b1 = this.m_body1;
      b2 = this.m_body2;
      Cdot = this.m_J.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity);
      impulse = -this.m_mass * Cdot;
      this.m_impulse += impulse;
      b1.m_linearVelocity.x += b1.m_invMass * impulse * this.m_J.linear1.x;
      b1.m_linearVelocity.y += b1.m_invMass * impulse * this.m_J.linear1.y;
      b1.m_angularVelocity += b1.m_invI * impulse * this.m_J.angular1;
      b2.m_linearVelocity.x += b2.m_invMass * impulse * this.m_J.linear2.x;
      b2.m_linearVelocity.y += b2.m_invMass * impulse * this.m_J.linear2.y;
      return b2.m_angularVelocity += b2.m_invI * impulse * this.m_J.angular2;
    };
    b2GearJoint.prototype.SolvePositionConstraints = function() {
      var C, b1, b2, coordinate1, coordinate2, impulse, linearError;
      linearError = 0.0;
      b1 = this.m_body1;
      b2 = this.m_body2;
      if (this.m_revolute1) {
        coordinate1 = this.m_revolute1.GetJointAngle();
      } else {
        coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      if (this.m_revolute2) {
        coordinate2 = this.m_revolute2.GetJointAngle();
      } else {
        coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2);
      impulse = -this.m_mass * C;
      b1.m_position.x += b1.m_invMass * impulse * this.m_J.linear1.x;
      b1.m_position.y += b1.m_invMass * impulse * this.m_J.linear1.y;
      b1.m_rotation += b1.m_invI * impulse * this.m_J.angular1;
      b2.m_position.x += b2.m_invMass * impulse * this.m_J.linear2.x;
      b2.m_position.y += b2.m_invMass * impulse * this.m_J.linear2.y;
      b2.m_rotation += b2.m_invI * impulse * this.m_J.angular2;
      b1.m_R.Set(b1.m_rotation);
      b2.m_R.Set(b2.m_rotation);
      return linearError < b2Settings.b2_linearSlop;
    };
    b2GearJoint.prototype.m_ground1 = null;
    b2GearJoint.prototype.m_ground2 = null;
    b2GearJoint.prototype.m_revolute1 = null;
    b2GearJoint.prototype.m_prismatic1 = null;
    b2GearJoint.prototype.m_revolute2 = null;
    b2GearJoint.prototype.m_prismatic2 = null;
    b2GearJoint.prototype.m_groundAnchor1 = new b2Vec2();
    b2GearJoint.prototype.m_groundAnchor2 = new b2Vec2();
    b2GearJoint.prototype.m_localAnchor1 = new b2Vec2();
    b2GearJoint.prototype.m_localAnchor2 = new b2Vec2();
    b2GearJoint.prototype.m_J = new b2Jacobian();
    b2GearJoint.prototype.m_constant = null;
    b2GearJoint.prototype.m_ratio = null;
    b2GearJoint.prototype.m_mass = null;
    b2GearJoint.prototype.m_impulse = null;
    return b2GearJoint;
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
  var b2GearJointDef;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2GearJointDef = b2GearJointDef = b2GearJointDef = (function() {
    __extends(b2GearJointDef, b2JointDef);
    b2GearJointDef.prototype.joint1 = null;
    b2GearJointDef.prototype.joint2 = null;
    b2GearJointDef.prototype.ratio = null;
    function b2GearJointDef() {
      this.type = b2Joint.e_gearJoint;
      this.joint1 = null;
      this.joint2 = null;
      this.ratio = 1.0;
    }
    return b2GearJointDef;
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
  var b2MouseJoint;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2MouseJoint = b2MouseJoint = b2MouseJoint = (function() {
    __extends(b2MouseJoint, b2Joint);
    function b2MouseJoint() {
      var d, k, mass, omega, tX, tY;
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = def.body1;
      this.m_body2 = def.body2;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.m_localAnchor = new b2Vec2();
      this.m_target = new b2Vec2();
      this.m_impulse = new b2Vec2();
      this.m_ptpMass = new b2Mat22();
      this.m_C = new b2Vec2();
      this.m_target.SetV(def.target);
      tX = this.m_target.x - this.m_body2.m_position.x;
      tY = this.m_target.y - this.m_body2.m_position.y;
      this.m_localAnchor.x = tX * this.m_body2.m_R.col1.x + tY * this.m_body2.m_R.col1.y;
      this.m_localAnchor.y = tX * this.m_body2.m_R.col2.x + tY * this.m_body2.m_R.col2.y;
      this.m_maxForce = def.maxForce;
      this.m_impulse.SetZero();
      mass = this.m_body2.m_mass;
      omega = 2.0 * b2Settings.b2_pi * def.frequencyHz;
      d = 2.0 * mass * def.dampingRatio * omega;
      k = mass * omega * omega;
      this.m_gamma = 1.0 / (d + def.timeStep * k);
      this.m_beta = def.timeStep * k / (d + def.timeStep * k);
      ({
        GetAnchor1: function() {
          return this.m_target;
        },
        GetAnchor2: function() {
          var tVec;
          tVec = b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor);
          tVec.Add(this.m_body2.m_position);
          return tVec;
        },
        GetReactionForce: function(invTimeStep) {
          var F;
          F = new b2Vec2();
          F.SetV(this.m_impulse);
          F.Multiply(invTimeStep);
          return F;
        },
        GetReactionTorque: function(invTimeStep) {
          return 0.0;
        },
        SetTarget: function(target) {
          this.m_body2.WakeUp();
          return this.m_target = target;
        },
        K: new b2Mat22(),
        K1: new b2Mat22(),
        K2: new b2Mat22(),
        PrepareVelocitySolver: function() {
          var PX, PY, b, invI, invMass, rX, rY, tMat;
          b = this.m_body2;
          tMat = b.m_R;
          rX = tMat.col1.x * this.m_localAnchor.x + tMat.col2.x * this.m_localAnchor.y;
          rY = tMat.col1.y * this.m_localAnchor.x + tMat.col2.y * this.m_localAnchor.y;
          invMass = b.m_invMass;
          invI = b.m_invI;
          this.K1.col1.x = invMass;
          this.K1.col2.x = 0.0;
          this.K1.col1.y = 0.0;
          this.K1.col2.y = invMass;
          this.K2.col1.x = invI * rY * rY;
          this.K2.col2.x = -invI * rX * rY;
          this.K2.col1.y = -invI * rX * rY;
          this.K2.col2.y = invI * rX * rX;
          this.K.SetM(this.K1);
          this.K.AddM(this.K2);
          this.K.col1.x += this.m_gamma;
          this.K.col2.y += this.m_gamma;
          this.K.Invert(this.m_ptpMass);
          this.m_C.x = b.m_position.x + rX - this.m_target.x;
          this.m_C.y = b.m_position.y + rY - this.m_target.y;
          b.m_angularVelocity *= 0.98;
          PX = this.m_impulse.x;
          PY = this.m_impulse.y;
          b.m_linearVelocity.x += invMass * PX;
          b.m_linearVelocity.y += invMass * PY;
          return b.m_angularVelocity += invI * (rX * PY - rY * PX);
        },
        SolveVelocityConstraints: function(step) {
          var CdotX, CdotY, body, impulse, impulseX, impulseY, length, oldImpulseX, oldImpulseY, rX, rY, tMat;
          body = this.m_body2;
          tMat = body.m_R;
          rX = tMat.col1.x * this.m_localAnchor.x + tMat.col2.x * this.m_localAnchor.y;
          rY = tMat.col1.y * this.m_localAnchor.x + tMat.col2.y * this.m_localAnchor.y;
          CdotX = body.m_linearVelocity.x + (-body.m_angularVelocity * rY);
          CdotY = body.m_linearVelocity.y + (body.m_angularVelocity * rX);
          tMat = this.m_ptpMass;
          tX = CdotX + (this.m_beta * step.inv_dt) * this.m_C.x + this.m_gamma * this.m_impulse.x;
          tY = CdotY + (this.m_beta * step.inv_dt) * this.m_C.y + this.m_gamma * this.m_impulse.y;
          impulseX = -(tMat.col1.x * tX + tMat.col2.x * tY);
          impulseY = -(tMat.col1.y * tX + tMat.col2.y * tY);
          oldImpulseX = this.m_impulse.x;
          oldImpulseY = this.m_impulse.y;
          this.m_impulse.x += impulseX;
          this.m_impulse.y += impulseY;
          length = this.m_impulse.Length();
          if (length > step.dt * this.m_maxForce) {
            this.m_impulse.Multiply(step.dt * this.m_maxForce / length);
          }
          impulse = this.m_impulse - oldImpulse;
          impulseX = this.m_impulse.x - oldImpulseX;
          impulseY = this.m_impulse.y - oldImpulseY;
          body.m_linearVelocity.x += body.m_invMass * impulseX;
          body.m_linearVelocity.y += body.m_invMass * impulseY;
          return body.m_angularVelocity += body.m_invI * (rX * impulseY - rY * impulseX);
        },
        SolvePositionConstraints: function() {
          return true;
        },
        m_localAnchor: new b2Vec2(),
        m_target: new b2Vec2(),
        m_impulse: new b2Vec2(),
        m_ptpMass: new b2Mat22(),
        m_C: new b2Vec2(),
        m_maxForce: null,
        m_beta: null,
        m_gamma: null
      });
    }
    return b2MouseJoint;
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
  var b2MouseJointDef;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2MouseJointDef = b2MouseJointDef = b2MouseJointDef = (function() {
    __extends(b2MouseJointDef, b2JointDef);
    b2MouseJointDef.prototype.target = new b2Vec2();
    b2MouseJointDef.prototype.maxForce = null;
    b2MouseJointDef.prototype.frequencyHz = null;
    b2MouseJointDef.prototype.dampingRatio = null;
    b2MouseJointDef.prototype.timeStep = null;
    function b2MouseJointDef() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.target = new b2Vec2();
      this.type = b2Joint.e_mouseJoint;
      this.maxForce = 0.0;
      this.frequencyHz = 5.0;
      this.dampingRatio = 0.7;
      this.timeStep = 1.0 / 60.0;
    }
    return b2MouseJointDef;
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
  var b2PrismaticJoint;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2PrismaticJoint = b2PrismaticJoint = b2PrismaticJoint = (function() {
    __extends(b2PrismaticJoint, b2Joint);
    function b2PrismaticJoint() {
      var tMat, tX, tY;
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = def.body1;
      this.m_body2 = def.body2;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_localXAxis1 = new b2Vec2();
      this.m_localYAxis1 = new b2Vec2();
      this.m_linearJacobian = new b2Jacobian();
      this.m_motorJacobian = new b2Jacobian();
      tMat = this.m_body1.m_R;
      tX = def.anchorPoint.x - this.m_body1.m_position.x;
      tY = def.anchorPoint.y - this.m_body1.m_position.y;
      this.m_localAnchor1.Set(tX * tMat.col1.x + tY * tMat.col1.y, tX * tMat.col2.x + tY * tMat.col2.y);
      tMat = this.m_body2.m_R;
      tX = def.anchorPoint.x - this.m_body2.m_position.x;
      tY = def.anchorPoint.y - this.m_body2.m_position.y;
      this.m_localAnchor2.Set(tX * tMat.col1.x + tY * tMat.col1.y, tX * tMat.col2.x + tY * tMat.col2.y);
      tMat = this.m_body1.m_R;
      tX = def.axis.x;
      tY = def.axis.y;
      this.m_localXAxis1.Set(tX * tMat.col1.x + tY * tMat.col1.y, tX * tMat.col2.x + tY * tMat.col2.y);
      this.m_localYAxis1.x = -this.m_localXAxis1.y;
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_initialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
      this.m_linearJacobian.SetZero();
      this.m_linearMass = 0.0;
      this.m_linearImpulse = 0.0;
      this.m_angularMass = 0.0;
      this.m_angularImpulse = 0.0;
      this.m_motorJacobian.SetZero();
      this.m_motorMass = 0.0;
      this.m_motorImpulse = 0.0;
      this.m_limitImpulse = 0.0;
      this.m_limitPositionImpulse = 0.0;
      this.m_lowerTranslation = def.lowerTranslation;
      this.m_upperTranslation = def.upperTranslation;
      this.m_maxMotorForce = def.motorForce;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
    }
    return b2PrismaticJoint;
  })();
  /*
  
  // Linear constraint (point-to-line)
  // d = p2 - p1 = x2 + r2 - x1 - r1
  // C = dot(ay1, d)
  // Cdot = dot(d, cross(w1, ay1)) + dot(ay1, v2 + cross(w2, r2) - v1 - cross(w1, r1))
  //      = -dot(ay1, v1) - dot(cross(d + r1, ay1), w1) + dot(ay1, v2) + dot(cross(r2, ay1), v2)
  // J = [-ay1 -cross(d+r1,ay1) ay1 cross(r2,ay1)]
  //
  // Angular constraint
  // C = a2 - a1 + a_initial
  // Cdot = w2 - w1
  // J = [0 0 -1 0 0 1]
  
  // Motor/Limit linear constraint
  // C = dot(ax1, d)
  // Cdot = = -dot(ax1, v1) - dot(cross(d + r1, ax1), w1) + dot(ax1, v2) + dot(cross(r2, ax1), v2)
  // J = [-ax1 -cross(d+r1,ax1) ax1 cross(r2,ax1)]
  
  
  var b2PrismaticJoint = Class.create()
  Object.extend(b2PrismaticJoint.prototype, b2Joint.prototype)
  Object.extend(b2PrismaticJoint.prototype, 
  {
  	GetAnchor1: function(){
  		var b1 = @m_body1
  		//return b2Math.AddVV(b1.m_position, b2Math.b2MulMV(b1.m_R, @m_localAnchor1))
  		var tVec = new b2Vec2()
  		tVec.SetV(@m_localAnchor1)
  		tVec.MulM(b1.m_R)
  		tVec.Add(b1.m_position)
  		return tVec
  	},
  	GetAnchor2: function(){
  		var b2 = @m_body2
  		//return b2Math.AddVV(b2.m_position, b2Math.b2MulMV(b2.m_R, @m_localAnchor2))
  		var tVec = new b2Vec2()
  		tVec.SetV(@m_localAnchor2)
  		tVec.MulM(b2.m_R)
  		tVec.Add(b2.m_position)
  		return tVec
  	},
  	GetJointTranslation: function(){
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var tMat
  
  		//var r1 = b2Math.b2MulMV(b1.m_R, @m_localAnchor1)
  		tMat = b1.m_R
  		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  		//var r2 = b2Math.b2MulMV(b2.m_R, @m_localAnchor2)
  		tMat = b2.m_R
  		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  		//var p1 = b2Math.AddVV(b1.m_position , r1)
  		var p1X = b1.m_position.x + r1X
  		var p1Y = b1.m_position.y + r1Y
  		//var p2 = b2Math.AddVV(b2.m_position , r2)
  		var p2X = b2.m_position.x + r2X
  		var p2Y = b2.m_position.y + r2Y
  		//var d = b2Math.SubtractVV(p2, p1)
  		var dX = p2X - p1X
  		var dY = p2Y - p1Y
  		//var ax1 = b2Math.b2MulMV(b1.m_R, @m_localXAxis1)
  		tMat = b1.m_R
  		var ax1X = tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y
  		var ax1Y = tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y
  
  		//var translation = b2Math.b2Dot(ax1, d)
  		var translation = ax1X*dX + ax1Y*dY
  		return translation
  	},
  	GetJointSpeed: function(){
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var tMat
  
  		//var r1 = b2Math.b2MulMV(b1.m_R, @m_localAnchor1)
  		tMat = b1.m_R
  		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  		//var r2 = b2Math.b2MulMV(b2.m_R, @m_localAnchor2)
  		tMat = b2.m_R
  		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  		//var p1 = b2Math.AddVV(b1.m_position , r1)
  		var p1X = b1.m_position.x + r1X
  		var p1Y = b1.m_position.y + r1Y
  		//var p2 = b2Math.AddVV(b2.m_position , r2)
  		var p2X = b2.m_position.x + r2X
  		var p2Y = b2.m_position.y + r2Y
  		//var d = b2Math.SubtractVV(p2, p1)
  		var dX = p2X - p1X
  		var dY = p2Y - p1Y
  		//var ax1 = b2Math.b2MulMV(b1.m_R, @m_localXAxis1)
  		tMat = b1.m_R
  		var ax1X = tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y
  		var ax1Y = tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y
  
  		var v1 = b1.m_linearVelocity
  		var v2 = b2.m_linearVelocity
  		var w1 = b1.m_angularVelocity
  		var w2 = b2.m_angularVelocity
  
  		//var speed = b2Math.b2Dot(d, b2Math.b2CrossFV(w1, ax1)) + b2Math.b2Dot(ax1, b2Math.SubtractVV( b2Math.SubtractVV( b2Math.AddVV( v2 , b2Math.b2CrossFV(w2, r2)) , v1) , b2Math.b2CrossFV(w1, r1)))
  		//var b2D = (dX*(-w1 * ax1Y) + dY*(w1 * ax1X))
  		//var b2D2 = (ax1X * ((( v2.x + (-w2 * r2Y)) - v1.x) - (-w1 * r1Y)) + ax1Y * ((( v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)))
  		var speed = (dX*(-w1 * ax1Y) + dY*(w1 * ax1X)) + (ax1X * ((( v2.x + (-w2 * r2Y)) - v1.x) - (-w1 * r1Y)) + ax1Y * ((( v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)))
  
  		return speed
  	},
  	GetMotorForce: function(invTimeStep){
  		return invTimeStep * @m_motorImpulse
  	},
  
  	SetMotorSpeed: function(speed)
  	{
  		@m_motorSpeed = speed
  	},
  
  	SetMotorForce: function(force)
  	{
  		@m_maxMotorForce = force
  	},
  
  	GetReactionForce: function(invTimeStep)
  	{
  		var tImp = invTimeStep * @m_limitImpulse
  		var tMat
  
  		//var ax1 = b2Math.b2MulMV(@m_body1.m_R, @m_localXAxis1)
  		tMat = @m_body1.m_R
  		var ax1X = tImp * (tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y)
  		var ax1Y = tImp * (tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y)
  		//var ay1 = b2Math.b2MulMV(@m_body1.m_R, @m_localYAxis1)
  		var ay1X = tImp * (tMat.col1.x * @m_localYAxis1.x + tMat.col2.x * @m_localYAxis1.y)
  		var ay1Y = tImp * (tMat.col1.y * @m_localYAxis1.x + tMat.col2.y * @m_localYAxis1.y)
  
  		//return (invTimeStep * @m_limitImpulse) * ax1 + (invTimeStep * @m_linearImpulse) * ay1
  
  		return new b2Vec2(ax1X+ay1X, ax1Y+ay1Y)
  	},
  
  	GetReactionTorque: function(invTimeStep)
  	{
  		return invTimeStep * @m_angularImpulse
  	},
  
  
  	//--------------- Internals Below -------------------
  
  	initialize: function(def){
  		// The constructor for b2Joint
  		// initialize instance variables for references
  		@m_node1 = new b2JointNode()
  		@m_node2 = new b2JointNode()
  		//
  		@m_type = def.type
  		@m_prev = null
  		@m_next = null
  		@m_body1 = def.body1
  		@m_body2 = def.body2
  		@m_collideConnected = def.collideConnected
  		@m_islandFlag = false
  		@m_userData = def.userData
  		//
  
  		// initialize instance variables for references
  		@m_localAnchor1 = new b2Vec2()
  		@m_localAnchor2 = new b2Vec2()
  		@m_localXAxis1 = new b2Vec2()
  		@m_localYAxis1 = new b2Vec2()
  		@m_linearJacobian = new b2Jacobian()
  		@m_motorJacobian = new b2Jacobian()
  		//
  
  		//super(def)
  
  		var tMat
  		var tX
  		var tY
  
  		//@m_localAnchor1 = b2Math.b2MulTMV(@m_body1.m_R, b2Math.SubtractVV(def.anchorPoint , @m_body1.m_position))
  		tMat = @m_body1.m_R
  		tX = (def.anchorPoint.x - @m_body1.m_position.x)
  		tY = (def.anchorPoint.y - @m_body1.m_position.y)
  		@m_localAnchor1.Set((tX*tMat.col1.x + tY*tMat.col1.y), (tX*tMat.col2.x + tY*tMat.col2.y))
  
  		//@m_localAnchor2 = b2Math.b2MulTMV(@m_body2.m_R, b2Math.SubtractVV(def.anchorPoint , @m_body2.m_position))
  		tMat = @m_body2.m_R
  		tX = (def.anchorPoint.x - @m_body2.m_position.x)
  		tY = (def.anchorPoint.y - @m_body2.m_position.y)
  		@m_localAnchor2.Set((tX*tMat.col1.x + tY*tMat.col1.y), (tX*tMat.col2.x + tY*tMat.col2.y))
  
  		//@m_localXAxis1 = b2Math.b2MulTMV(@m_body1.m_R, def.axis)
  		tMat = @m_body1.m_R
  		tX = def.axis.x
  		tY = def.axis.y
  		@m_localXAxis1.Set((tX*tMat.col1.x + tY*tMat.col1.y), (tX*tMat.col2.x + tY*tMat.col2.y))
  
  		//@m_localYAxis1 = b2Math.b2CrossFV(1.0, @m_localXAxis1)
  		@m_localYAxis1.x = -@m_localXAxis1.y
  		@m_localYAxis1.y = @m_localXAxis1.x
  
  		@m_initialAngle = @m_body2.m_rotation - @m_body1.m_rotation
  
  		@m_linearJacobian.SetZero()
  		@m_linearMass = 0.0
  		@m_linearImpulse = 0.0
  
  		@m_angularMass = 0.0
  		@m_angularImpulse = 0.0
  
  		@m_motorJacobian.SetZero()
  		@m_motorMass = 0.0
  		@m_motorImpulse = 0.0
  		@m_limitImpulse = 0.0
  		@m_limitPositionImpulse = 0.0
  
  		@m_lowerTranslation = def.lowerTranslation
  		@m_upperTranslation = def.upperTranslation
  		@m_maxMotorForce = def.motorForce
  		@m_motorSpeed = def.motorSpeed
  		@m_enableLimit = def.enableLimit
  		@m_enableMotor = def.enableMotor
  	},
  
  	PrepareVelocitySolver: function(){
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var tMat
  
  		// Compute the effective masses.
  		//b2Vec2 r1 = b2Mul(b1->m_R, @m_localAnchor1)
  		tMat = b1.m_R
  		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  		//b2Vec2 r2 = b2Mul(b2->m_R, @m_localAnchor2)
  		tMat = b2.m_R
  		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  
  		//float32 invMass1 = b1->m_invMass, invMass2 = b2->m_invMass
  		var invMass1 = b1.m_invMass
  		var invMass2 = b2.m_invMass
  		//float32 invI1 = b1->m_invI, invI2 = b2->m_invI
  		var invI1 = b1.m_invI
  		var invI2 = b2.m_invI
  
  		// Compute point to line constraint effective mass.
  		// J = [-ay1 -cross(d+r1,ay1) ay1 cross(r2,ay1)]
  		//b2Vec2 ay1 = b2Mul(b1->m_R, @m_localYAxis1)
  		tMat = b1.m_R
  		var ay1X = tMat.col1.x * @m_localYAxis1.x + tMat.col2.x * @m_localYAxis1.y
  		var ay1Y = tMat.col1.y * @m_localYAxis1.x + tMat.col2.y * @m_localYAxis1.y
  		//b2Vec2 e = b2->m_position + r2 - b1->m_position
  		var eX = b2.m_position.x + r2X - b1.m_position.x
  		var eY = b2.m_position.y + r2Y - b1.m_position.y
  
  		//@m_linearJacobian.Set(-ay1, -b2Math.b2Cross(e, ay1), ay1, b2Math.b2Cross(r2, ay1))
  		@m_linearJacobian.linear1.x = -ay1X
  		@m_linearJacobian.linear1.y = -ay1Y
  		@m_linearJacobian.linear2.x = ay1X
  		@m_linearJacobian.linear2.y = ay1Y
  		@m_linearJacobian.angular1 = -(eX * ay1Y - eY * ay1X)
  		@m_linearJacobian.angular2 = r2X * ay1Y - r2Y * ay1X
  
  		@m_linearMass =	invMass1 + invI1 * @m_linearJacobian.angular1 * @m_linearJacobian.angular1 +
  						invMass2 + invI2 * @m_linearJacobian.angular2 * @m_linearJacobian.angular2
  		//b2Settings.b2Assert(@m_linearMass > Number.MIN_VALUE)
  		@m_linearMass = 1.0 / @m_linearMass
  
  		// Compute angular constraint effective mass.
  		@m_angularMass = 1.0 / (invI1 + invI2)
  
  		// Compute motor and limit terms.
  		if (@m_enableLimit || @m_enableMotor)
  		{
  			// The motor and limit share a Jacobian and effective mass.
  			//b2Vec2 ax1 = b2Mul(b1->m_R, @m_localXAxis1)
  			tMat = b1.m_R
  			var ax1X = tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y
  			var ax1Y = tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y
  			//@m_motorJacobian.Set(-ax1, -b2Cross(e, ax1), ax1, b2Cross(r2, ax1))
  			@m_motorJacobian.linear1.x = -ax1X @m_motorJacobian.linear1.y = -ax1Y
  			@m_motorJacobian.linear2.x = ax1X @m_motorJacobian.linear2.y = ax1Y
  			@m_motorJacobian.angular1 = -(eX * ax1Y - eY * ax1X)
  			@m_motorJacobian.angular2 = r2X * ax1Y - r2Y * ax1X
  
  			@m_motorMass =	invMass1 + invI1 * @m_motorJacobian.angular1 * @m_motorJacobian.angular1 +
  							invMass2 + invI2 * @m_motorJacobian.angular2 * @m_motorJacobian.angular2
  			//b2Settings.b2Assert(@m_motorMass > Number.MIN_VALUE)
  			@m_motorMass = 1.0 / @m_motorMass
  
  			if (@m_enableLimit)
  			{
  				//b2Vec2 d = e - r1
  				var dX = eX - r1X
  				var dY = eY - r1Y
  				//float32 jointTranslation = b2Dot(ax1, d)
  				var jointTranslation = ax1X * dX + ax1Y * dY
  				if (b2Math.b2Abs(@m_upperTranslation - @m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop)
  				{
  					@m_limitState = b2Joint.e_equalLimits
  				}
  				else if (jointTranslation <= @m_lowerTranslation)
  				{
  					if (@m_limitState != b2Joint.e_atLowerLimit)
  					{
  						@m_limitImpulse = 0.0
  					}
  					@m_limitState = b2Joint.e_atLowerLimit
  				}
  				else if (jointTranslation >= @m_upperTranslation)
  				{
  					if (@m_limitState != b2Joint.e_atUpperLimit)
  					{
  						@m_limitImpulse = 0.0
  					}
  					@m_limitState = b2Joint.e_atUpperLimit
  				}
  				else
  				{
  					@m_limitState = b2Joint.e_inactiveLimit
  					@m_limitImpulse = 0.0
  				}
  			}
  		}
  
  		if (@m_enableMotor == false)
  		{
  			@m_motorImpulse = 0.0
  		}
  
  		if (@m_enableLimit == false)
  		{
  			@m_limitImpulse = 0.0
  		}
  
  		if (b2World.s_enableWarmStarting)
  		{
  			//b2Vec2 P1 = @m_linearImpulse * @m_linearJacobian.linear1 + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear1
  			var P1X = @m_linearImpulse * @m_linearJacobian.linear1.x + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear1.x
  			var P1Y = @m_linearImpulse * @m_linearJacobian.linear1.y + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear1.y
  			//b2Vec2 P2 = @m_linearImpulse * @m_linearJacobian.linear2 + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear2
  			var P2X = @m_linearImpulse * @m_linearJacobian.linear2.x + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear2.x
  			var P2Y = @m_linearImpulse * @m_linearJacobian.linear2.y + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.linear2.y
  			//float32 L1 = @m_linearImpulse * @m_linearJacobian.angular1 - @m_angularImpulse + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.angular1
  			var L1 = @m_linearImpulse * @m_linearJacobian.angular1 - @m_angularImpulse + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.angular1
  			//float32 L2 = @m_linearImpulse * @m_linearJacobian.angular2 + @m_angularImpulse + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.angular2
  			var L2 = @m_linearImpulse * @m_linearJacobian.angular2 + @m_angularImpulse + (@m_motorImpulse + @m_limitImpulse) * @m_motorJacobian.angular2
  
  			//b1->m_linearVelocity += invMass1 * P1
  			b1.m_linearVelocity.x += invMass1 * P1X
  			b1.m_linearVelocity.y += invMass1 * P1Y
  			//b1->m_angularVelocity += invI1 * L1
  			b1.m_angularVelocity += invI1 * L1
  
  			//b2->m_linearVelocity += invMass2 * P2
  			b2.m_linearVelocity.x += invMass2 * P2X
  			b2.m_linearVelocity.y += invMass2 * P2Y
  			//b2->m_angularVelocity += invI2 * L2
  			b2.m_angularVelocity += invI2 * L2
  		}
  		else
  		{
  			@m_linearImpulse = 0.0
  			@m_angularImpulse = 0.0
  			@m_limitImpulse = 0.0
  			@m_motorImpulse = 0.0
  		}
  
  		@m_limitPositionImpulse = 0.0
  
  	},
  
  	SolveVelocityConstraints: function(step){
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var invMass1 = b1.m_invMass
  		var invMass2 = b2.m_invMass
  		var invI1 = b1.m_invI
  		var invI2 = b2.m_invI
  
  		var oldLimitImpulse
  
  		// Solve linear constraint.
  		var linearCdot = @m_linearJacobian.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity)
  		var linearImpulse = -@m_linearMass * linearCdot
  		@m_linearImpulse += linearImpulse
  
  		//b1->m_linearVelocity += (invMass1 * linearImpulse) * @m_linearJacobian.linear1
  		b1.m_linearVelocity.x += (invMass1 * linearImpulse) * @m_linearJacobian.linear1.x
  		b1.m_linearVelocity.y += (invMass1 * linearImpulse) * @m_linearJacobian.linear1.y
  		//b1->m_angularVelocity += invI1 * linearImpulse * @m_linearJacobian.angular1
  		b1.m_angularVelocity += invI1 * linearImpulse * @m_linearJacobian.angular1
  
  		//b2->m_linearVelocity += (invMass2 * linearImpulse) * @m_linearJacobian.linear2
  		b2.m_linearVelocity.x += (invMass2 * linearImpulse) * @m_linearJacobian.linear2.x
  		b2.m_linearVelocity.y += (invMass2 * linearImpulse) * @m_linearJacobian.linear2.y
  		//b2.m_angularVelocity += invI2 * linearImpulse * @m_linearJacobian.angular2
  		b2.m_angularVelocity += invI2 * linearImpulse * @m_linearJacobian.angular2
  
  		// Solve angular constraint.
  		var angularCdot = b2.m_angularVelocity - b1.m_angularVelocity
  		var angularImpulse = -@m_angularMass * angularCdot
  		@m_angularImpulse += angularImpulse
  
  		b1.m_angularVelocity -= invI1 * angularImpulse
  		b2.m_angularVelocity += invI2 * angularImpulse
  
  		// Solve linear motor constraint.
  		if (@m_enableMotor && @m_limitState != b2Joint.e_equalLimits)
  		{
  			var motorCdot = @m_motorJacobian.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity) - @m_motorSpeed
  			var motorImpulse = -@m_motorMass * motorCdot
  			var oldMotorImpulse = @m_motorImpulse
  			@m_motorImpulse = b2Math.b2Clamp(@m_motorImpulse + motorImpulse, -step.dt * @m_maxMotorForce, step.dt * @m_maxMotorForce)
  			motorImpulse = @m_motorImpulse - oldMotorImpulse
  
  			//b1.m_linearVelocity += (invMass1 * motorImpulse) * @m_motorJacobian.linear1
  			b1.m_linearVelocity.x += (invMass1 * motorImpulse) * @m_motorJacobian.linear1.x
  			b1.m_linearVelocity.y += (invMass1 * motorImpulse) * @m_motorJacobian.linear1.y
  			//b1.m_angularVelocity += invI1 * motorImpulse * @m_motorJacobian.angular1
  			b1.m_angularVelocity += invI1 * motorImpulse * @m_motorJacobian.angular1
  
  			//b2->m_linearVelocity += (invMass2 * motorImpulse) * @m_motorJacobian.linear2
  			b2.m_linearVelocity.x += (invMass2 * motorImpulse) * @m_motorJacobian.linear2.x
  			b2.m_linearVelocity.y += (invMass2 * motorImpulse) * @m_motorJacobian.linear2.y
  			//b2->m_angularVelocity += invI2 * motorImpulse * @m_motorJacobian.angular2
  			b2.m_angularVelocity += invI2 * motorImpulse * @m_motorJacobian.angular2
  		}
  
  		// Solve linear limit constraint.
  		if (@m_enableLimit && @m_limitState != b2Joint.e_inactiveLimit)
  		{
  			var limitCdot = @m_motorJacobian.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity)
  			var limitImpulse = -@m_motorMass * limitCdot
  
  			if (@m_limitState == b2Joint.e_equalLimits)
  			{
  				@m_limitImpulse += limitImpulse
  			}
  			else if (@m_limitState == b2Joint.e_atLowerLimit)
  			{
  				oldLimitImpulse = @m_limitImpulse
  				@m_limitImpulse = b2Math.b2Max(@m_limitImpulse + limitImpulse, 0.0)
  				limitImpulse = @m_limitImpulse - oldLimitImpulse
  			}
  			else if (@m_limitState == b2Joint.e_atUpperLimit)
  			{
  				oldLimitImpulse = @m_limitImpulse
  				@m_limitImpulse = b2Math.b2Min(@m_limitImpulse + limitImpulse, 0.0)
  				limitImpulse = @m_limitImpulse - oldLimitImpulse
  			}
  
  			//b1->m_linearVelocity += (invMass1 * limitImpulse) * @m_motorJacobian.linear1
  			b1.m_linearVelocity.x += (invMass1 * limitImpulse) * @m_motorJacobian.linear1.x
  			b1.m_linearVelocity.y += (invMass1 * limitImpulse) * @m_motorJacobian.linear1.y
  			//b1->m_angularVelocity += invI1 * limitImpulse * @m_motorJacobian.angular1
  			b1.m_angularVelocity += invI1 * limitImpulse * @m_motorJacobian.angular1
  
  			//b2->m_linearVelocity += (invMass2 * limitImpulse) * @m_motorJacobian.linear2
  			b2.m_linearVelocity.x += (invMass2 * limitImpulse) * @m_motorJacobian.linear2.x
  			b2.m_linearVelocity.y += (invMass2 * limitImpulse) * @m_motorJacobian.linear2.y
  			//b2->m_angularVelocity += invI2 * limitImpulse * @m_motorJacobian.angular2
  			b2.m_angularVelocity += invI2 * limitImpulse * @m_motorJacobian.angular2
  		}
  	},
  
  
  
  	SolvePositionConstraints: function(){
  
  		var limitC
  		var oldLimitImpulse
  
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var invMass1 = b1.m_invMass
  		var invMass2 = b2.m_invMass
  		var invI1 = b1.m_invI
  		var invI2 = b2.m_invI
  
  		var tMat
  
  		//b2Vec2 r1 = b2Mul(b1->m_R, @m_localAnchor1)
  		tMat = b1.m_R
  		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  		//b2Vec2 r2 = b2Mul(b2->m_R, @m_localAnchor2)
  		tMat = b2.m_R
  		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  		//b2Vec2 p1 = b1->m_position + r1
  		var p1X = b1.m_position.x + r1X
  		var p1Y = b1.m_position.y + r1Y
  		//b2Vec2 p2 = b2->m_position + r2
  		var p2X = b2.m_position.x + r2X
  		var p2Y = b2.m_position.y + r2Y
  		//b2Vec2 d = p2 - p1
  		var dX = p2X - p1X
  		var dY = p2Y - p1Y
  		//b2Vec2 ay1 = b2Mul(b1->m_R, @m_localYAxis1)
  		tMat = b1.m_R
  		var ay1X = tMat.col1.x * @m_localYAxis1.x + tMat.col2.x * @m_localYAxis1.y
  		var ay1Y = tMat.col1.y * @m_localYAxis1.x + tMat.col2.y * @m_localYAxis1.y
  
  		// Solve linear (point-to-line) constraint.
  		//float32 linearC = b2Dot(ay1, d)
  		var linearC = ay1X*dX + ay1Y*dY
  		// Prevent overly large corrections.
  		linearC = b2Math.b2Clamp(linearC, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection)
  		var linearImpulse = -@m_linearMass * linearC
  
  		//b1->m_position += (invMass1 * linearImpulse) * @m_linearJacobian.linear1
  		b1.m_position.x += (invMass1 * linearImpulse) * @m_linearJacobian.linear1.x
  		b1.m_position.y += (invMass1 * linearImpulse) * @m_linearJacobian.linear1.y
  		//b1->m_rotation += invI1 * linearImpulse * @m_linearJacobian.angular1
  		b1.m_rotation += invI1 * linearImpulse * @m_linearJacobian.angular1
  		//b1->m_R.Set(b1->m_rotation)
  		//b2->m_position += (invMass2 * linearImpulse) * @m_linearJacobian.linear2
  		b2.m_position.x += (invMass2 * linearImpulse) * @m_linearJacobian.linear2.x
  		b2.m_position.y += (invMass2 * linearImpulse) * @m_linearJacobian.linear2.y
  		b2.m_rotation += invI2 * linearImpulse * @m_linearJacobian.angular2
  		//b2->m_R.Set(b2->m_rotation)
  
  		var positionError = b2Math.b2Abs(linearC)
  
  		// Solve angular constraint.
  		var angularC = b2.m_rotation - b1.m_rotation - @m_initialAngle
  		// Prevent overly large corrections.
  		angularC = b2Math.b2Clamp(angularC, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection)
  		var angularImpulse = -@m_angularMass * angularC
  
  		b1.m_rotation -= b1.m_invI * angularImpulse
  		b1.m_R.Set(b1.m_rotation)
  		b2.m_rotation += b2.m_invI * angularImpulse
  		b2.m_R.Set(b2.m_rotation)
  
  		var angularError = b2Math.b2Abs(angularC)
  
  		// Solve linear limit constraint.
  		if (@m_enableLimit && @m_limitState != b2Joint.e_inactiveLimit)
  		{
  
  			//b2Vec2 r1 = b2Mul(b1->m_R, @m_localAnchor1)
  			tMat = b1.m_R
  			r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  			r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  			//b2Vec2 r2 = b2Mul(b2->m_R, @m_localAnchor2)
  			tMat = b2.m_R
  			r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  			r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  			//b2Vec2 p1 = b1->m_position + r1
  			p1X = b1.m_position.x + r1X
  			p1Y = b1.m_position.y + r1Y
  			//b2Vec2 p2 = b2->m_position + r2
  			p2X = b2.m_position.x + r2X
  			p2Y = b2.m_position.y + r2Y
  			//b2Vec2 d = p2 - p1
  			dX = p2X - p1X
  			dY = p2Y - p1Y
  			//b2Vec2 ax1 = b2Mul(b1->m_R, @m_localXAxis1)
  			tMat = b1.m_R
  			var ax1X = tMat.col1.x * @m_localXAxis1.x + tMat.col2.x * @m_localXAxis1.y
  			var ax1Y = tMat.col1.y * @m_localXAxis1.x + tMat.col2.y * @m_localXAxis1.y
  
  			//float32 translation = b2Dot(ax1, d)
  			var translation = (ax1X*dX + ax1Y*dY)
  			var limitImpulse = 0.0
  
  			if (@m_limitState == b2Joint.e_equalLimits)
  			{
  				// Prevent large angular corrections
  				limitC = b2Math.b2Clamp(translation, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection)
  				limitImpulse = -@m_motorMass * limitC
  				positionError = b2Math.b2Max(positionError, b2Math.b2Abs(angularC))
  			}
  			else if (@m_limitState == b2Joint.e_atLowerLimit)
  			{
  				limitC = translation - @m_lowerTranslation
  				positionError = b2Math.b2Max(positionError, -limitC)
  
  				// Prevent large linear corrections and allow some slop.
  				limitC = b2Math.b2Clamp(limitC + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0)
  				limitImpulse = -@m_motorMass * limitC
  				oldLimitImpulse = @m_limitPositionImpulse
  				@m_limitPositionImpulse = b2Math.b2Max(@m_limitPositionImpulse + limitImpulse, 0.0)
  				limitImpulse = @m_limitPositionImpulse - oldLimitImpulse
  			}
  			else if (@m_limitState == b2Joint.e_atUpperLimit)
  			{
  				limitC = translation - @m_upperTranslation
  				positionError = b2Math.b2Max(positionError, limitC)
  
  				// Prevent large linear corrections and allow some slop.
  				limitC = b2Math.b2Clamp(limitC - b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection)
  				limitImpulse = -@m_motorMass * limitC
  				oldLimitImpulse = @m_limitPositionImpulse
  				@m_limitPositionImpulse = b2Math.b2Min(@m_limitPositionImpulse + limitImpulse, 0.0)
  				limitImpulse = @m_limitPositionImpulse - oldLimitImpulse
  			}
  
  			//b1->m_position += (invMass1 * limitImpulse) * @m_motorJacobian.linear1
  			b1.m_position.x += (invMass1 * limitImpulse) * @m_motorJacobian.linear1.x
  			b1.m_position.y += (invMass1 * limitImpulse) * @m_motorJacobian.linear1.y
  			//b1->m_rotation += invI1 * limitImpulse * @m_motorJacobian.angular1
  			b1.m_rotation += invI1 * limitImpulse * @m_motorJacobian.angular1
  			b1.m_R.Set(b1.m_rotation)
  			//b2->m_position += (invMass2 * limitImpulse) * @m_motorJacobian.linear2
  			b2.m_position.x += (invMass2 * limitImpulse) * @m_motorJacobian.linear2.x
  			b2.m_position.y += (invMass2 * limitImpulse) * @m_motorJacobian.linear2.y
  			//b2->m_rotation += invI2 * limitImpulse * @m_motorJacobian.angular2
  			b2.m_rotation += invI2 * limitImpulse * @m_motorJacobian.angular2
  			b2.m_R.Set(b2.m_rotation)
  		}
  
  		return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop
  
  	},
  
  	m_localAnchor1: new b2Vec2(),
  	m_localAnchor2: new b2Vec2(),
  	m_localXAxis1: new b2Vec2(),
  	m_localYAxis1: new b2Vec2(),
  	m_initialAngle: null,
  
  	m_linearJacobian: new b2Jacobian(),
  	m_linearMass: null,
  	m_linearImpulse: null,
  
  	m_angularMass: null,
  	m_angularImpulse: null,
  
  	m_motorJacobian: new b2Jacobian(),
  	m_motorMass: null,
  	m_motorImpulse: null,
  	m_limitImpulse: null,
  	m_limitPositionImpulse: null,
  
  	m_lowerTranslation: null,
  	m_upperTranslation: null,
  	m_maxMotorForce: null,
  	m_motorSpeed: null,
  
  	m_enableLimit: null,
  	m_enableMotor: null,
  	m_limitState: 0})*/
  
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
  var b2PrismaticJointDef;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2PrismaticJointDef = b2PrismaticJointDef = b2PrismaticJointDef = (function() {
    __extends(b2PrismaticJointDef, b2JointDef);
    b2PrismaticJointDef.prototype.anchorPoint = null;
    b2PrismaticJointDef.prototype.axis = null;
    b2PrismaticJointDef.prototype.lowerTranslation = null;
    b2PrismaticJointDef.prototype.upperTranslation = null;
    b2PrismaticJointDef.prototype.motorForce = null;
    b2PrismaticJointDef.prototype.motorSpeed = null;
    b2PrismaticJointDef.prototype.enableLimit = null;
    b2PrismaticJointDef.prototype.enableMotor = null;
    function b2PrismaticJointDef() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.type = b2Joint.e_prismaticJoint;
      this.anchorPoint = new b2Vec2(0.0, 0.0);
      this.axis = new b2Vec2(0.0, 0.0);
      this.lowerTranslation = 0.0;
      this.upperTranslation = 0.0;
      this.motorForce = 0.0;
      this.motorSpeed = 0.0;
      this.enableLimit = false;
      this.enableMotor = false;
    }
    return b2PrismaticJointDef;
  })();
  
  var b2PulleyJoint;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2PulleyJoint = b2PulleyJoint = b2PulleyJoint = (function() {
    __extends(b2PulleyJoint, b2Joint);
    function b2PulleyJoint() {
      var d1Len, d2Len, length1, length2, tMat, tX, tY;
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = def.body1;
      this.m_body2 = def.body2;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u1 = new b2Vec2();
      this.m_u2 = new b2Vec2();
      this.m_ground = this.m_body1.m_world.m_groundBody;
      this.m_groundAnchor1.x = def.groundPoint1.x - this.m_ground.m_position.x;
      this.m_groundAnchor1.y = def.groundPoint1.y - this.m_ground.m_position.y;
      this.m_groundAnchor2.x = def.groundPoint2.x - this.m_ground.m_position.x;
      this.m_groundAnchor2.y = def.groundPoint2.y - this.m_ground.m_position.y;
      tMat = this.m_body1.m_R;
      tX = def.anchorPoint1.x - this.m_body1.m_position.x;
      tY = def.anchorPoint1.y - this.m_body1.m_position.y;
      this.m_localAnchor1.x = tX * tMat.col1.x + tY * tMat.col1.y;
      this.m_localAnchor1.y = tX * tMat.col2.x + tY * tMat.col2.y;
      tMat = this.m_body2.m_R;
      tX = def.anchorPoint2.x - this.m_body2.m_position.x;
      tY = def.anchorPoint2.y - this.m_body2.m_position.y;
      this.m_localAnchor2.x = tX * tMat.col1.x + tY * tMat.col1.y;
      this.m_localAnchor2.y = tX * tMat.col2.x + tY * tMat.col2.y;
      this.m_ratio = def.ratio;
      tX = def.groundPoint1.x - def.anchorPoint1.x;
      tY = def.groundPoint1.y - def.anchorPoint1.y;
      d1Len = Math.sqrt(tX * tX + tY * tY);
      tX = def.groundPoint2.x - def.anchorPoint2.x;
      tY = def.groundPoint2.y - def.anchorPoint2.y;
      d2Len = Math.sqrt(tX * tX + tY * tY);
      length1 = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, d1Len);
      length2 = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, d2Len);
      this.m_constant = length1 + this.m_ratio * length2;
      this.m_maxLength1 = b2Math.b2Clamp(def.maxLength1, length1, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
      this.m_maxLength2 = b2Math.b2Clamp(def.maxLength2, length2, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
      this.m_pulleyImpulse = 0.0;
      this.m_limitImpulse1 = 0.0;
      this.m_limitImpulse2 = 0.0;
    }
    return b2PulleyJoint;
  })();
  b2PulleyJoint.b2_minPulleyLength = b2Settings.b2_lengthUnitsPerMeter;
  /*
  var b2PulleyJoint = Class.create()
  Object.extend(b2PulleyJoint.prototype, b2Joint.prototype)
  Object.extend(b2PulleyJoint.prototype, 
  {
  	GetAnchor1: function(){
  		//return @m_body1->m_position + b2Mul(@m_body1->m_R, @m_localAnchor1)
  		var tMat = @m_body1.m_R
  		return new b2Vec2(	@m_body1.m_position.x + (tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y),
  							@m_body1.m_position.y + (tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y))
  	},
  	GetAnchor2: function(){
  		//return @m_body2->m_position + b2Mul(@m_body2->m_R, @m_localAnchor2)
  		var tMat = @m_body2.m_R
  		return new b2Vec2(	@m_body2.m_position.x + (tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y),
  							@m_body2.m_position.y + (tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y))
  	},
  
  	GetGroundPoint1: function(){
  		//return @m_ground->m_position + @m_groundAnchor1
  		return new b2Vec2(@m_ground.m_position.x + @m_groundAnchor1.x, @m_ground.m_position.y + @m_groundAnchor1.y)
  	},
  	GetGroundPoint2: function(){
  		return new b2Vec2(@m_ground.m_position.x + @m_groundAnchor2.x, @m_ground.m_position.y + @m_groundAnchor2.y)
  	},
  
  	GetReactionForce: function(invTimeStep){
  		//b2Vec2 F(0.0f, 0.0f)
  		return new b2Vec2()
  	},
  	GetReactionTorque: function(invTimeStep){
  		return 0.0
  	},
  
  	GetLength1: function(){
  		var tMat
  		//b2Vec2 p = @m_body1->m_position + b2Mul(@m_body1->m_R, @m_localAnchor1)
  		tMat = @m_body1.m_R
  		var pX = @m_body1.m_position.x + (tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y)
  		var pY = @m_body1.m_position.y + (tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y)
  		//b2Vec2 s = @m_ground->m_position + @m_groundAnchor1
  		//b2Vec2 d = p - s
  		var dX = pX - (@m_ground.m_position.x + @m_groundAnchor1.x)
  		var dY = pY - (@m_ground.m_position.y + @m_groundAnchor1.y)
  		return Math.sqrt(dX*dX + dY*dY)
  	},
  	GetLength2: function(){
  		var tMat
  		//b2Vec2 p = @m_body2->m_position + b2Mul(@m_body2->m_R, @m_localAnchor2)
  		tMat = @m_body2.m_R
  		var pX = @m_body2.m_position.x + (tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y)
  		var pY = @m_body2.m_position.y + (tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y)
  		//b2Vec2 s = @m_ground->m_position + @m_groundAnchor2
  		//b2Vec2 d = p - s
  		var dX = pX - (@m_ground.m_position.x + @m_groundAnchor2.x)
  		var dY = pY - (@m_ground.m_position.y + @m_groundAnchor2.y)
  		return Math.sqrt(dX*dX + dY*dY)
  	},
  
  	GetRatio: function(){
  		return @m_ratio
  	},
  
  	//--------------- Internals Below -------------------
  
  	initialize: function(def){
  		// The constructor for b2Joint
  		// initialize instance variables for references
  		@m_node1 = new b2JointNode()
  		@m_node2 = new b2JointNode()
  		//
  		@m_type = def.type
  		@m_prev = null
  		@m_next = null
  		@m_body1 = def.body1
  		@m_body2 = def.body2
  		@m_collideConnected = def.collideConnected
  		@m_islandFlag = false
  		@m_userData = def.userData
  		//
  
  		// initialize instance variables for references
  		@m_groundAnchor1 = new b2Vec2()
  		@m_groundAnchor2 = new b2Vec2()
  		@m_localAnchor1 = new b2Vec2()
  		@m_localAnchor2 = new b2Vec2()
  		@m_u1 = new b2Vec2()
  		@m_u2 = new b2Vec2()
  		//
  
  
  		// parent
  		//super(def)
  
  		var tMat
  		var tX
  		var tY
  
  		@m_ground = @m_body1.m_world.m_groundBody
  		//@m_groundAnchor1 = def.groundPoint1 - @m_ground.m_position
  		@m_groundAnchor1.x = def.groundPoint1.x - @m_ground.m_position.x
  		@m_groundAnchor1.y = def.groundPoint1.y - @m_ground.m_position.y
  		//@m_groundAnchor2 = def.groundPoint2 - @m_ground.m_position
  		@m_groundAnchor2.x = def.groundPoint2.x - @m_ground.m_position.x
  		@m_groundAnchor2.y = def.groundPoint2.y - @m_ground.m_position.y
  		//@m_localAnchor1 = b2MulT(@m_body1.m_R, def.anchorPoint1 - @m_body1.m_position)
  		tMat = @m_body1.m_R
  		tX = def.anchorPoint1.x - @m_body1.m_position.x
  		tY = def.anchorPoint1.y - @m_body1.m_position.y
  		@m_localAnchor1.x = tX*tMat.col1.x + tY*tMat.col1.y
  		@m_localAnchor1.y = tX*tMat.col2.x + tY*tMat.col2.y
  		//@m_localAnchor2 = b2MulT(@m_body2.m_R, def.anchorPoint2 - @m_body2.m_position)
  		tMat = @m_body2.m_R
  		tX = def.anchorPoint2.x - @m_body2.m_position.x
  		tY = def.anchorPoint2.y - @m_body2.m_position.y
  		@m_localAnchor2.x = tX*tMat.col1.x + tY*tMat.col1.y
  		@m_localAnchor2.y = tX*tMat.col2.x + tY*tMat.col2.y
  
  		@m_ratio = def.ratio
  
  		//var d1 = def.groundPoint1 - def.anchorPoint1
  		tX = def.groundPoint1.x - def.anchorPoint1.x
  		tY = def.groundPoint1.y - def.anchorPoint1.y
  		var d1Len = Math.sqrt(tX*tX + tY*tY)
  		//var d2 = def.groundPoint2 - def.anchorPoint2
  		tX = def.groundPoint2.x - def.anchorPoint2.x
  		tY = def.groundPoint2.y - def.anchorPoint2.y
  		var d2Len = Math.sqrt(tX*tX + tY*tY)
  
  		var length1 = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, d1Len)
  		var length2 = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, d2Len)
  
  		@m_constant = length1 + @m_ratio * length2
  
  		@m_maxLength1 = b2Math.b2Clamp(def.maxLength1, length1, @m_constant - @m_ratio * b2PulleyJoint.b2_minPulleyLength)
  		@m_maxLength2 = b2Math.b2Clamp(def.maxLength2, length2, (@m_constant - b2PulleyJoint.b2_minPulleyLength) / @m_ratio)
  
  		@m_pulleyImpulse = 0.0
  		@m_limitImpulse1 = 0.0
  		@m_limitImpulse2 = 0.0
  
  	},
  
  	PrepareVelocitySolver: function(){
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var tMat
  
  		//b2Vec2 r1 = b2Mul(b1->m_R, @m_localAnchor1)
  		tMat = b1.m_R
  		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  		//b2Vec2 r2 = b2Mul(b2->m_R, @m_localAnchor2)
  		tMat = b2.m_R
  		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  
  		//b2Vec2 p1 = b1->m_position + r1
  		var p1X = b1.m_position.x + r1X
  		var p1Y = b1.m_position.y + r1Y
  		//b2Vec2 p2 = b2->m_position + r2
  		var p2X = b2.m_position.x + r2X
  		var p2Y = b2.m_position.y + r2Y
  
  		//b2Vec2 s1 = @m_ground->m_position + @m_groundAnchor1
  		var s1X = @m_ground.m_position.x + @m_groundAnchor1.x
  		var s1Y = @m_ground.m_position.y + @m_groundAnchor1.y
  		//b2Vec2 s2 = @m_ground->m_position + @m_groundAnchor2
  		var s2X = @m_ground.m_position.x + @m_groundAnchor2.x
  		var s2Y = @m_ground.m_position.y + @m_groundAnchor2.y
  
  		// Get the pulley axes.
  		//@m_u1 = p1 - s1
  		@m_u1.Set(p1X - s1X, p1Y - s1Y)
  		//@m_u2 = p2 - s2
  		@m_u2.Set(p2X - s2X, p2Y - s2Y)
  
  		var length1 = @m_u1.Length()
  		var length2 = @m_u2.Length()
  
  		if (length1 > b2Settings.b2_linearSlop)
  		{
  			//@m_u1 *= 1.0f / length1
  			@m_u1.Multiply(1.0 / length1)
  		}
  		else
  		{
  			@m_u1.SetZero()
  		}
  
  		if (length2 > b2Settings.b2_linearSlop)
  		{
  			//@m_u2 *= 1.0f / length2
  			@m_u2.Multiply(1.0 / length2)
  		}
  		else
  		{
  			@m_u2.SetZero()
  		}
  
  		if (length1 < @m_maxLength1)
  		{
  			@m_limitState1 = b2Joint.e_inactiveLimit
  			@m_limitImpulse1 = 0.0
  		}
  		else
  		{
  			@m_limitState1 = b2Joint.e_atUpperLimit
  			@m_limitPositionImpulse1 = 0.0
  		}
  
  		if (length2 < @m_maxLength2)
  		{
  			@m_limitState2 = b2Joint.e_inactiveLimit
  			@m_limitImpulse2 = 0.0
  		}
  		else
  		{
  			@m_limitState2 = b2Joint.e_atUpperLimit
  			@m_limitPositionImpulse2 = 0.0
  		}
  
  		// Compute effective mass.
  		//var cr1u1 = b2Cross(r1, @m_u1)
  		var cr1u1 = r1X * @m_u1.y - r1Y * @m_u1.x
  		//var cr2u2 = b2Cross(r2, @m_u2)
  		var cr2u2 = r2X * @m_u2.y - r2Y * @m_u2.x
  
  		@m_limitMass1 = b1.m_invMass + b1.m_invI * cr1u1 * cr1u1
  		@m_limitMass2 = b2.m_invMass + b2.m_invI * cr2u2 * cr2u2
  		@m_pulleyMass = @m_limitMass1 + @m_ratio * @m_ratio * @m_limitMass2
  		//b2Settings.b2Assert(@m_limitMass1 > Number.MIN_VALUE)
  		//b2Settings.b2Assert(@m_limitMass2 > Number.MIN_VALUE)
  		//b2Settings.b2Assert(@m_pulleyMass > Number.MIN_VALUE)
  		@m_limitMass1 = 1.0 / @m_limitMass1
  		@m_limitMass2 = 1.0 / @m_limitMass2
  		@m_pulleyMass = 1.0 / @m_pulleyMass
  
  		// Warm starting.
  		//b2Vec2 P1 = (-@m_pulleyImpulse - @m_limitImpulse1) * @m_u1
  		var P1X = (-@m_pulleyImpulse - @m_limitImpulse1) * @m_u1.x
  		var P1Y = (-@m_pulleyImpulse - @m_limitImpulse1) * @m_u1.y
  		//b2Vec2 P2 = (-@m_ratio * @m_pulleyImpulse - @m_limitImpulse2) * @m_u2
  		var P2X = (-@m_ratio * @m_pulleyImpulse - @m_limitImpulse2) * @m_u2.x
  		var P2Y = (-@m_ratio * @m_pulleyImpulse - @m_limitImpulse2) * @m_u2.y
  		//b1.m_linearVelocity += b1.m_invMass * P1
  		b1.m_linearVelocity.x += b1.m_invMass * P1X
  		b1.m_linearVelocity.y += b1.m_invMass * P1Y
  		//b1.m_angularVelocity += b1.m_invI * b2Cross(r1, P1)
  		b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X)
  		//b2.m_linearVelocity += b2.m_invMass * P2
  		b2.m_linearVelocity.x += b2.m_invMass * P2X
  		b2.m_linearVelocity.y += b2.m_invMass * P2Y
  		//b2.m_angularVelocity += b2.m_invI * b2Cross(r2, P2)
  		b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X)
  	},
  
  	SolveVelocityConstraints: function(step){
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var tMat
  
  		//var r1 = b2Mul(b1.m_R, @m_localAnchor1)
  		tMat = b1.m_R
  		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  		//var r2 = b2Mul(b2.m_R, @m_localAnchor2)
  		tMat = b2.m_R
  		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  
  		// temp vars
  		var v1X
  		var v1Y
  		var v2X
  		var v2Y
  		var P1X
  		var P1Y
  		var P2X
  		var P2Y
  		var Cdot
  		var impulse
  		var oldLimitImpulse
  
  		//{
  			//b2Vec2 v1 = b1->m_linearVelocity + b2Cross(b1->m_angularVelocity, r1)
  			v1X = b1.m_linearVelocity.x + (-b1.m_angularVelocity * r1Y)
  			v1Y = b1.m_linearVelocity.y + (b1.m_angularVelocity * r1X)
  			//b2Vec2 v2 = b2->m_linearVelocity + b2Cross(b2->m_angularVelocity, r2)
  			v2X = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y)
  			v2Y = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X)
  
  			//Cdot = -b2Dot(@m_u1, v1) - @m_ratio * b2Dot(@m_u2, v2)
  			Cdot = -(@m_u1.x * v1X + @m_u1.y * v1Y) - @m_ratio * (@m_u2.x * v2X + @m_u2.y * v2Y)
  			impulse = -@m_pulleyMass * Cdot
  			@m_pulleyImpulse += impulse
  
  			//b2Vec2 P1 = -impulse * @m_u1
  			P1X = -impulse * @m_u1.x
  			P1Y = -impulse * @m_u1.y
  			//b2Vec2 P2 = -@m_ratio * impulse * @m_u2
  			P2X = -@m_ratio * impulse * @m_u2.x
  			P2Y = -@m_ratio * impulse * @m_u2.y
  			//b1.m_linearVelocity += b1.m_invMass * P1
  			b1.m_linearVelocity.x += b1.m_invMass * P1X
  			b1.m_linearVelocity.y += b1.m_invMass * P1Y
  			//b1.m_angularVelocity += b1.m_invI * b2Cross(r1, P1)
  			b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X)
  			//b2.m_linearVelocity += b2.m_invMass * P2
  			b2.m_linearVelocity.x += b2.m_invMass * P2X
  			b2.m_linearVelocity.y += b2.m_invMass * P2Y
  			//b2.m_angularVelocity += b2.m_invI * b2Cross(r2, P2)
  			b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X)
  		//}
  
  		if (@m_limitState1 == b2Joint.e_atUpperLimit)
  		{
  			//b2Vec2 v1 = b1->m_linearVelocity + b2Cross(b1->m_angularVelocity, r1)
  			v1X = b1.m_linearVelocity.x + (-b1.m_angularVelocity * r1Y)
  			v1Y = b1.m_linearVelocity.y + (b1.m_angularVelocity * r1X)
  
  			//float32 Cdot = -b2Dot(@m_u1, v1)
  			Cdot = -(@m_u1.x * v1X + @m_u1.y * v1Y)
  			impulse = -@m_limitMass1 * Cdot
  			oldLimitImpulse = @m_limitImpulse1
  			@m_limitImpulse1 = b2Math.b2Max(0.0, @m_limitImpulse1 + impulse)
  			impulse = @m_limitImpulse1 - oldLimitImpulse
  			//b2Vec2 P1 = -impulse * @m_u1
  			P1X = -impulse * @m_u1.x
  			P1Y = -impulse * @m_u1.y
  			//b1.m_linearVelocity += b1->m_invMass * P1
  			b1.m_linearVelocity.x += b1.m_invMass * P1X
  			b1.m_linearVelocity.y += b1.m_invMass * P1Y
  			//b1.m_angularVelocity += b1->m_invI * b2Cross(r1, P1)
  			b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X)
  		}
  
  		if (@m_limitState2 == b2Joint.e_atUpperLimit)
  		{
  			//b2Vec2 v2 = b2->m_linearVelocity + b2Cross(b2->m_angularVelocity, r2)
  			v2X = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y)
  			v2Y = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X)
  
  			//float32 Cdot = -b2Dot(@m_u2, v2)
  			Cdot = -(@m_u2.x * v2X + @m_u2.y * v2Y)
  			impulse = -@m_limitMass2 * Cdot
  			oldLimitImpulse = @m_limitImpulse2
  			@m_limitImpulse2 = b2Math.b2Max(0.0, @m_limitImpulse2 + impulse)
  			impulse = @m_limitImpulse2 - oldLimitImpulse
  			//b2Vec2 P2 = -impulse * @m_u2
  			P2X = -impulse * @m_u2.x
  			P2Y = -impulse * @m_u2.y
  			//b2->m_linearVelocity += b2->m_invMass * P2
  			b2.m_linearVelocity.x += b2.m_invMass * P2X
  			b2.m_linearVelocity.y += b2.m_invMass * P2Y
  			//b2->m_angularVelocity += b2->m_invI * b2Cross(r2, P2)
  			b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X)
  		}
  	},
  
  
  
  	SolvePositionConstraints: function(){
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var tMat
  
  		//b2Vec2 s1 = @m_ground->m_position + @m_groundAnchor1
  		var s1X = @m_ground.m_position.x + @m_groundAnchor1.x
  		var s1Y = @m_ground.m_position.y + @m_groundAnchor1.y
  		//b2Vec2 s2 = @m_ground->m_position + @m_groundAnchor2
  		var s2X = @m_ground.m_position.x + @m_groundAnchor2.x
  		var s2Y = @m_ground.m_position.y + @m_groundAnchor2.y
  
  		// temp vars
  		var r1X
  		var r1Y
  		var r2X
  		var r2Y
  		var p1X
  		var p1Y
  		var p2X
  		var p2Y
  		var length1
  		var length2
  		var C
  		var impulse
  		var oldLimitPositionImpulse
  
  		var linearError = 0.0
  
  		{
  			//var r1 = b2Mul(b1.m_R, @m_localAnchor1)
  			tMat = b1.m_R
  			r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  			r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  			//var r2 = b2Mul(b2.m_R, @m_localAnchor2)
  			tMat = b2.m_R
  			r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  			r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  
  			//b2Vec2 p1 = b1->m_position + r1
  			p1X = b1.m_position.x + r1X
  			p1Y = b1.m_position.y + r1Y
  			//b2Vec2 p2 = b2->m_position + r2
  			p2X = b2.m_position.x + r2X
  			p2Y = b2.m_position.y + r2Y
  
  			// Get the pulley axes.
  			//@m_u1 = p1 - s1
  			@m_u1.Set(p1X - s1X, p1Y - s1Y)
  			//@m_u2 = p2 - s2
  			@m_u2.Set(p2X - s2X, p2Y - s2Y)
  
  			length1 = @m_u1.Length()
  			length2 = @m_u2.Length()
  
  			if (length1 > b2Settings.b2_linearSlop)
  			{
  				//@m_u1 *= 1.0f / length1
  				@m_u1.Multiply( 1.0 / length1 )
  			}
  			else
  			{
  				@m_u1.SetZero()
  			}
  
  			if (length2 > b2Settings.b2_linearSlop)
  			{
  				//@m_u2 *= 1.0f / length2
  				@m_u2.Multiply( 1.0 / length2 )
  			}
  			else
  			{
  				@m_u2.SetZero()
  			}
  
  			C = @m_constant - length1 - @m_ratio * length2
  			linearError = b2Math.b2Max(linearError, Math.abs(C))
  			C = b2Math.b2Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection)
  			impulse = -@m_pulleyMass * C
  
  			p1X = -impulse * @m_u1.x
  			p1Y = -impulse * @m_u1.y
  			p2X = -@m_ratio * impulse * @m_u2.x
  			p2Y = -@m_ratio * impulse * @m_u2.y
  
  			b1.m_position.x += b1.m_invMass * p1X
  			b1.m_position.y += b1.m_invMass * p1Y
  			b1.m_rotation += b1.m_invI * (r1X * p1Y - r1Y * p1X)
  			b2.m_position.x += b2.m_invMass * p2X
  			b2.m_position.y += b2.m_invMass * p2Y
  			b2.m_rotation += b2.m_invI * (r2X * p2Y - r2Y * p2X)
  
  			b1.m_R.Set(b1.m_rotation)
  			b2.m_R.Set(b2.m_rotation)
  		}
  
  		if (@m_limitState1 == b2Joint.e_atUpperLimit)
  		{
  			//b2Vec2 r1 = b2Mul(b1->m_R, @m_localAnchor1)
  			tMat = b1.m_R
  			r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  			r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  			//b2Vec2 p1 = b1->m_position + r1
  			p1X = b1.m_position.x + r1X
  			p1Y = b1.m_position.y + r1Y
  
  			//@m_u1 = p1 - s1
  			@m_u1.Set(p1X - s1X, p1Y - s1Y)
  
  			length1 = @m_u1.Length()
  
  			if (length1 > b2Settings.b2_linearSlop)
  			{
  				//@m_u1 *= 1.0 / length1
  				@m_u1.x *= 1.0 / length1
  				@m_u1.y *= 1.0 / length1
  			}
  			else
  			{
  				@m_u1.SetZero()
  			}
  
  			C = @m_maxLength1 - length1
  			linearError = b2Math.b2Max(linearError, -C)
  			C = b2Math.b2Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0)
  			impulse = -@m_limitMass1 * C
  			oldLimitPositionImpulse = @m_limitPositionImpulse1
  			@m_limitPositionImpulse1 = b2Math.b2Max(0.0, @m_limitPositionImpulse1 + impulse)
  			impulse = @m_limitPositionImpulse1 - oldLimitPositionImpulse
  
  			//P1 = -impulse * @m_u1
  			p1X = -impulse * @m_u1.x
  			p1Y = -impulse * @m_u1.y
  
  			b1.m_position.x += b1.m_invMass * p1X
  			b1.m_position.y += b1.m_invMass * p1Y
  			//b1.m_rotation += b1.m_invI * b2Cross(r1, P1)
  			b1.m_rotation += b1.m_invI * (r1X * p1Y - r1Y * p1X)
  			b1.m_R.Set(b1.m_rotation)
  		}
  
  		if (@m_limitState2 == b2Joint.e_atUpperLimit)
  		{
  			//b2Vec2 r2 = b2Mul(b2->m_R, @m_localAnchor2)
  			tMat = b2.m_R
  			r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  			r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  			//b2Vec2 p2 = b2->m_position + r2
  			p2X = b2.m_position.x + r2X
  			p2Y = b2.m_position.y + r2Y
  
  			//@m_u2 = p2 - s2
  			@m_u2.Set(p2X - s2X, p2Y - s2Y)
  
  			length2 = @m_u2.Length()
  
  			if (length2 > b2Settings.b2_linearSlop)
  			{
  				//@m_u2 *= 1.0 / length2
  				@m_u2.x *= 1.0 / length2
  				@m_u2.y *= 1.0 / length2
  			}
  			else
  			{
  				@m_u2.SetZero()
  			}
  
  			C = @m_maxLength2 - length2
  			linearError = b2Math.b2Max(linearError, -C)
  			C = b2Math.b2Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0)
  			impulse = -@m_limitMass2 * C
  			oldLimitPositionImpulse = @m_limitPositionImpulse2
  			@m_limitPositionImpulse2 = b2Math.b2Max(0.0, @m_limitPositionImpulse2 + impulse)
  			impulse = @m_limitPositionImpulse2 - oldLimitPositionImpulse
  
  			//P2 = -impulse * @m_u2
  			p2X = -impulse * @m_u2.x
  			p2Y = -impulse * @m_u2.y
  
  			//b2.m_position += b2.m_invMass * P2
  			b2.m_position.x += b2.m_invMass * p2X
  			b2.m_position.y += b2.m_invMass * p2Y
  			//b2.m_rotation += b2.m_invI * b2Cross(r2, P2)
  			b2.m_rotation += b2.m_invI * (r2X * p2Y - r2Y * p2X)
  			b2.m_R.Set(b2.m_rotation)
  		}
  
  		return linearError < b2Settings.b2_linearSlop
  	},
  
  
  
  	m_ground: null,
  	m_groundAnchor1: new b2Vec2(),
  	m_groundAnchor2: new b2Vec2(),
  	m_localAnchor1: new b2Vec2(),
  	m_localAnchor2: new b2Vec2(),
  
  	m_u1: new b2Vec2(),
  	m_u2: new b2Vec2(),
  
  	m_constant: null,
  	m_ratio: null,
  
  	m_maxLength1: null,
  	m_maxLength2: null,
  
  	// Effective masses
  	m_pulleyMass: null,
  	m_limitMass1: null,
  	m_limitMass2: null,
  
  	// Impulses for accumulation/warm starting.
  	m_pulleyImpulse: null,
  	m_limitImpulse1: null,
  	m_limitImpulse2: null,
  
  	// Position impulses for accumulation.
  	m_limitPositionImpulse1: null,
  	m_limitPositionImpulse2: null,
  
  	m_limitState1: 0,
  	m_limitState2: 0
  
  	// static
  })
  
  
  
  b2PulleyJoint.b2_minPulleyLength = b2Settings.b2_lengthUnitsPerMeter*/
  
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
  var b2PulleyJointDef;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2PulleyJointDef = b2PulleyJointDef = b2PulleyJointDef = (function() {
    __extends(b2PulleyJointDef, b2JointDef);
    b2PulleyJointDef.prototype.groundPoint1 = new b2Vec2();
    b2PulleyJointDef.prototype.groundPoint2 = new b2Vec2();
    b2PulleyJointDef.prototype.anchorPoint1 = new b2Vec2();
    b2PulleyJointDef.prototype.anchorPoint2 = new b2Vec2();
    b2PulleyJointDef.prototype.maxLength1 = null;
    b2PulleyJointDef.prototype.maxLength2 = null;
    b2PulleyJointDef.prototype.ratio = null;
    function b2PulleyJointDef() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.groundPoint1 = new b2Vec2();
      this.groundPoint2 = new b2Vec2();
      this.anchorPoint1 = new b2Vec2();
      this.anchorPoint2 = new b2Vec2();
      this.type = b2Joint.e_pulleyJoint;
      this.groundPoint1.Set(-1.0, 1.0);
      this.groundPoint2.Set(1.0, 1.0);
      this.anchorPoint1.Set(-1.0, 0.0);
      this.anchorPoint2.Set(1.0, 0.0);
      this.maxLength1 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
      this.maxLength2 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
      this.ratio = 1.0;
      this.collideConnected = true;
    }
    return b2PulleyJointDef;
  })();
  
  var b2RevoluteJoint;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2RevoluteJoint = b2RevoluteJoint = b2RevoluteJoint = (function() {
    __extends(b2RevoluteJoint, b2Joint);
    function b2RevoluteJoint() {
      var tMat, tX, tY;
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = def.body1;
      this.m_body2 = def.body2;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.K3 = new b2Mat22();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_ptpImpulse = new b2Vec2();
      this.m_ptpMass = new b2Mat22();
      tMat = this.m_body1.m_R;
      tX = def.anchorPoint.x - this.m_body1.m_position.x;
      tY = def.anchorPoint.y - this.m_body1.m_position.y;
      this.m_localAnchor1.x = tX * tMat.col1.x + tY * tMat.col1.y;
      this.m_localAnchor1.y = tX * tMat.col2.x + tY * tMat.col2.y;
      tMat = this.m_body2.m_R;
      tX = def.anchorPoint.x - this.m_body2.m_position.x;
      tY = def.anchorPoint.y - this.m_body2.m_position.y;
      this.m_localAnchor2.x = tX * tMat.col1.x + tY * tMat.col1.y;
      this.m_localAnchor2.y = tX * tMat.col2.x + tY * tMat.col2.y;
      this.m_intialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
      this.m_ptpImpulse.Set(0.0, 0.0);
      this.m_motorImpulse = 0.0;
      this.m_limitImpulse = 0.0;
      this.m_limitPositionImpulse = 0.0;
      this.m_lowerAngle = def.lowerAngle;
      this.m_upperAngle = def.upperAngle;
      this.m_maxMotorTorque = def.motorTorque;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
    }
    return b2RevoluteJoint;
  })();
  b2RevoluteJoint.tImpulse = new b2Vec2();
  /*
  
  // Point-to-point constraint
  // C = p2 - p1
  // Cdot = v2 - v1
  //      = v2 + cross(w2, r2) - v1 - cross(w1, r1)
  // J = [-I -r1_skew I r2_skew ]
  // Identity used:
  // w k % (rx i + ry j) = w * (-ry i + rx j)
  
  // Motor constraint
  // Cdot = w2 - w1
  // J = [0 0 -1 0 0 1]
  // K = invI1 + invI2
  
  var b2RevoluteJoint = Class.create()
  Object.extend(b2RevoluteJoint.prototype, b2Joint.prototype)
  Object.extend(b2RevoluteJoint.prototype, 
  {
  	GetAnchor1: function(){
  		var tMat = @m_body1.m_R
  		return new b2Vec2(	@m_body1.m_position.x + (tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y),
  							@m_body1.m_position.y + (tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y))
  	},
  	GetAnchor2: function(){
  		var tMat = @m_body2.m_R
  		return new b2Vec2(	@m_body2.m_position.x + (tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y),
  							@m_body2.m_position.y + (tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y))
  	},
  	GetJointAngle: function(){
  		return @m_body2.m_rotation - @m_body1.m_rotation
  	},
  	GetJointSpeed: function(){
  		return @m_body2.m_angularVelocity - @m_body1.m_angularVelocity
  	},
  	GetMotorTorque: function(invTimeStep){
  		return  invTimeStep * @m_motorImpulse
  	},
  
  	SetMotorSpeed: function(speed)
  	{
  		@m_motorSpeed = speed
  	},
  
  	SetMotorTorque: function(torque)
  	{
  		@m_maxMotorTorque = torque
  	},
  
  	GetReactionForce: function(invTimeStep)
  	{
  		var tVec = @m_ptpImpulse.Copy()
  		tVec.Multiply(invTimeStep)
  		//return invTimeStep * @m_ptpImpulse
  		return tVec
  	},
  
  	GetReactionTorque: function(invTimeStep)
  	{
  		return invTimeStep * @m_limitImpulse
  	},
  
  	//--------------- Internals Below -------------------
  
  	initialize: function(def){
  		// The constructor for b2Joint
  		// initialize instance variables for references
  		@m_node1 = new b2JointNode()
  		@m_node2 = new b2JointNode()
  		//
  		@m_type = def.type
  		@m_prev = null
  		@m_next = null
  		@m_body1 = def.body1
  		@m_body2 = def.body2
  		@m_collideConnected = def.collideConnected
  		@m_islandFlag = false
  		@m_userData = def.userData
  		//
  
  		// initialize instance variables for references
  		@K = new b2Mat22()
  		@K1 = new b2Mat22()
  		@K2 = new b2Mat22()
  		@K3 = new b2Mat22()
  		@m_localAnchor1 = new b2Vec2()
  		@m_localAnchor2 = new b2Vec2()
  		@m_ptpImpulse = new b2Vec2()
  		@m_ptpMass = new b2Mat22()
  		//
  
  		//super(def)
  
  		var tMat
  		var tX
  		var tY
  
  		//@m_localAnchor1 = b2Math.b2MulTMV(@m_body1.m_R, b2Math.SubtractVV( def.anchorPoint, @m_body1.m_position))
  		tMat = @m_body1.m_R
  		tX = def.anchorPoint.x - @m_body1.m_position.x
  		tY = def.anchorPoint.y - @m_body1.m_position.y
  		@m_localAnchor1.x = tX * tMat.col1.x + tY * tMat.col1.y
  		@m_localAnchor1.y = tX * tMat.col2.x + tY * tMat.col2.y
  		//@m_localAnchor2 = b2Math.b2MulTMV(@m_body2.m_R, b2Math.SubtractVV( def.anchorPoint, @m_body2.m_position))
  		tMat = @m_body2.m_R
  		tX = def.anchorPoint.x - @m_body2.m_position.x
  		tY = def.anchorPoint.y - @m_body2.m_position.y
  		@m_localAnchor2.x = tX * tMat.col1.x + tY * tMat.col1.y
  		@m_localAnchor2.y = tX * tMat.col2.x + tY * tMat.col2.y
  
  		@m_intialAngle = @m_body2.m_rotation - @m_body1.m_rotation
  
  		@m_ptpImpulse.Set(0.0, 0.0)
  		@m_motorImpulse = 0.0
  		@m_limitImpulse = 0.0
  		@m_limitPositionImpulse = 0.0
  
  		@m_lowerAngle = def.lowerAngle
  		@m_upperAngle = def.upperAngle
  		@m_maxMotorTorque = def.motorTorque
  		@m_motorSpeed = def.motorSpeed
  		@m_enableLimit = def.enableLimit
  		@m_enableMotor = def.enableMotor
  	},
  
  	// internal vars
  	K: new b2Mat22(),
  	K1: new b2Mat22(),
  	K2: new b2Mat22(),
  	K3: new b2Mat22(),
  	PrepareVelocitySolver: function(){
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var tMat
  
  		// Compute the effective mass matrix.
  		//b2Vec2 r1 = b2Mul(b1->m_R, @m_localAnchor1)
  		tMat = b1.m_R
  		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  		//b2Vec2 r2 = b2Mul(b2->m_R, @m_localAnchor2)
  		tMat = b2.m_R
  		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  
  		// @K    = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) * invI2 * skew(r2)]
  		//      = [1/m1+1/m2     0    ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y -r1.x*r1.y]
  		//        [    0     1/m1+1/m2]           [-r1.x*r1.y r1.x*r1.x]           [-r1.x*r1.y r1.x*r1.x]
  		var invMass1 = b1.m_invMass
  		var invMass2 = b2.m_invMass
  		var invI1 = b1.m_invI
  		var invI2 = b2.m_invI
  
  		//var @K1 = new b2Mat22()
  		@K1.col1.x = invMass1 + invMass2	@K1.col2.x = 0.0
  		@K1.col1.y = 0.0					@K1.col2.y = invMass1 + invMass2
  
  		//var @K2 = new b2Mat22()
  		@K2.col1.x =  invI1 * r1Y * r1Y	@K2.col2.x = -invI1 * r1X * r1Y
  		@K2.col1.y = -invI1 * r1X * r1Y	@K2.col2.y =  invI1 * r1X * r1X
  
  		//var @K3 = new b2Mat22()
  		@K3.col1.x =  invI2 * r2Y * r2Y	@K3.col2.x = -invI2 * r2X * r2Y
  		@K3.col1.y = -invI2 * r2X * r2Y	@K3.col2.y =  invI2 * r2X * r2X
  
  		//var @K = b2Math.AddMM(b2Math.AddMM(@K1, @K2), @K3)
  		@K.SetM(@K1)
  		@K.AddM(@K2)
  		@K.AddM(@K3)
  
  		//@m_ptpMass = @K.Invert()
  		@K.Invert(@m_ptpMass)
  
  		@m_motorMass = 1.0 / (invI1 + invI2)
  
  		if (@m_enableMotor == false)
  		{
  			@m_motorImpulse = 0.0
  		}
  
  		if (@m_enableLimit)
  		{
  			var jointAngle = b2.m_rotation - b1.m_rotation - @m_intialAngle
  			if (b2Math.b2Abs(@m_upperAngle - @m_lowerAngle) < 2.0 * b2Settings.b2_angularSlop)
  			{
  				@m_limitState = b2Joint.e_equalLimits
  			}
  			else if (jointAngle <= @m_lowerAngle)
  			{
  				if (@m_limitState != b2Joint.e_atLowerLimit)
  				{
  					@m_limitImpulse = 0.0
  				}
  				@m_limitState = b2Joint.e_atLowerLimit
  			}
  			else if (jointAngle >= @m_upperAngle)
  			{
  				if (@m_limitState != b2Joint.e_atUpperLimit)
  				{
  					@m_limitImpulse = 0.0
  				}
  				@m_limitState = b2Joint.e_atUpperLimit
  			}
  			else
  			{
  				@m_limitState = b2Joint.e_inactiveLimit
  				@m_limitImpulse = 0.0
  			}
  		}
  		else
  		{
  			@m_limitImpulse = 0.0
  		}
  
  		// Warm starting.
  		if (b2World.s_enableWarmStarting)
  		{
  			//b1.m_linearVelocity.Subtract( b2Math.MulFV( invMass1, @m_ptpImpulse) )
  			b1.m_linearVelocity.x -= invMass1 * @m_ptpImpulse.x
  			b1.m_linearVelocity.y -= invMass1 * @m_ptpImpulse.y
  			//b1.m_angularVelocity -= invI1 * (b2Math.b2CrossVV(r1, @m_ptpImpulse) + @m_motorImpulse + @m_limitImpulse)
  			b1.m_angularVelocity -= invI1 * ((r1X * @m_ptpImpulse.y - r1Y * @m_ptpImpulse.x) + @m_motorImpulse + @m_limitImpulse)
  
  			//b2.m_linearVelocity.Add( b2Math.MulFV( invMass2 , @m_ptpImpulse ))
  			b2.m_linearVelocity.x += invMass2 * @m_ptpImpulse.x
  			b2.m_linearVelocity.y += invMass2 * @m_ptpImpulse.y
  			//b2.m_angularVelocity += invI2 * (b2Math.b2CrossVV(r2, @m_ptpImpulse) + @m_motorImpulse + @m_limitImpulse)
  			b2.m_angularVelocity += invI2 * ((r2X * @m_ptpImpulse.y - r2Y * @m_ptpImpulse.x) + @m_motorImpulse + @m_limitImpulse)
  		}
  		else{
  			@m_ptpImpulse.SetZero()
  			@m_motorImpulse = 0.0
  			@m_limitImpulse = 0.0
  		}
  
  		@m_limitPositionImpulse = 0.0
  	},
  
  
  	SolveVelocityConstraints: function(step){
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var tMat
  
  		//var r1 = b2Math.b2MulMV(b1.m_R, @m_localAnchor1)
  		tMat = b1.m_R
  		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  		//var r2 = b2Math.b2MulMV(b2.m_R, @m_localAnchor2)
  		tMat = b2.m_R
  		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  
  		var oldLimitImpulse
  
  		// Solve point-to-point constraint
  		//b2Vec2 ptpCdot = b2.m_linearVelocity + b2Cross(b2.m_angularVelocity, r2) - b1.m_linearVelocity - b2Cross(b1.m_angularVelocity, r1)
  		var ptpCdotX = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y) - b1.m_linearVelocity.x - (-b1.m_angularVelocity * r1Y)
  		var ptpCdotY = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X) - b1.m_linearVelocity.y - (b1.m_angularVelocity * r1X)
  
  		//b2Vec2 ptpImpulse = -b2Mul(@m_ptpMass, ptpCdot)
  		var ptpImpulseX = -(@m_ptpMass.col1.x * ptpCdotX + @m_ptpMass.col2.x * ptpCdotY)
  		var ptpImpulseY = -(@m_ptpMass.col1.y * ptpCdotX + @m_ptpMass.col2.y * ptpCdotY)
  		@m_ptpImpulse.x += ptpImpulseX
  		@m_ptpImpulse.y += ptpImpulseY
  
  		//b1->m_linearVelocity -= b1->m_invMass * ptpImpulse
  		b1.m_linearVelocity.x -= b1.m_invMass * ptpImpulseX
  		b1.m_linearVelocity.y -= b1.m_invMass * ptpImpulseY
  		//b1->m_angularVelocity -= b1->m_invI * b2Cross(r1, ptpImpulse)
  		b1.m_angularVelocity -= b1.m_invI * (r1X * ptpImpulseY - r1Y * ptpImpulseX)
  
  		//b2->m_linearVelocity += b2->m_invMass * ptpImpulse
  		b2.m_linearVelocity.x += b2.m_invMass * ptpImpulseX
  		b2.m_linearVelocity.y += b2.m_invMass * ptpImpulseY
  		//b2->m_angularVelocity += b2->m_invI * b2Cross(r2, ptpImpulse)
  		b2.m_angularVelocity += b2.m_invI * (r2X * ptpImpulseY - r2Y * ptpImpulseX)
  
  		if (@m_enableMotor && @m_limitState != b2Joint.e_equalLimits)
  		{
  			var motorCdot = b2.m_angularVelocity - b1.m_angularVelocity - @m_motorSpeed
  			var motorImpulse = -@m_motorMass * motorCdot
  			var oldMotorImpulse = @m_motorImpulse
  			@m_motorImpulse = b2Math.b2Clamp(@m_motorImpulse + motorImpulse, -step.dt * @m_maxMotorTorque, step.dt * @m_maxMotorTorque)
  			motorImpulse = @m_motorImpulse - oldMotorImpulse
  			b1.m_angularVelocity -= b1.m_invI * motorImpulse
  			b2.m_angularVelocity += b2.m_invI * motorImpulse
  		}
  
  		if (@m_enableLimit && @m_limitState != b2Joint.e_inactiveLimit)
  		{
  			var limitCdot = b2.m_angularVelocity - b1.m_angularVelocity
  			var limitImpulse = -@m_motorMass * limitCdot
  
  			if (@m_limitState == b2Joint.e_equalLimits)
  			{
  				@m_limitImpulse += limitImpulse
  			}
  			else if (@m_limitState == b2Joint.e_atLowerLimit)
  			{
  				oldLimitImpulse = @m_limitImpulse
  				@m_limitImpulse = b2Math.b2Max(@m_limitImpulse + limitImpulse, 0.0)
  				limitImpulse = @m_limitImpulse - oldLimitImpulse
  			}
  			else if (@m_limitState == b2Joint.e_atUpperLimit)
  			{
  				oldLimitImpulse = @m_limitImpulse
  				@m_limitImpulse = b2Math.b2Min(@m_limitImpulse + limitImpulse, 0.0)
  				limitImpulse = @m_limitImpulse - oldLimitImpulse
  			}
  
  			b1.m_angularVelocity -= b1.m_invI * limitImpulse
  			b2.m_angularVelocity += b2.m_invI * limitImpulse
  		}
  	},
  
  
  	SolvePositionConstraints: function(){
  
  		var oldLimitImpulse
  		var limitC
  
  		var b1 = @m_body1
  		var b2 = @m_body2
  
  		var positionError = 0.0
  
  		var tMat
  
  		// Solve point-to-point position error.
  		//var r1 = b2Math.b2MulMV(b1.m_R, @m_localAnchor1)
  		tMat = b1.m_R
  		var r1X = tMat.col1.x * @m_localAnchor1.x + tMat.col2.x * @m_localAnchor1.y
  		var r1Y = tMat.col1.y * @m_localAnchor1.x + tMat.col2.y * @m_localAnchor1.y
  		//var r2 = b2Math.b2MulMV(b2.m_R, @m_localAnchor2)
  		tMat = b2.m_R
  		var r2X = tMat.col1.x * @m_localAnchor2.x + tMat.col2.x * @m_localAnchor2.y
  		var r2Y = tMat.col1.y * @m_localAnchor2.x + tMat.col2.y * @m_localAnchor2.y
  
  		//b2Vec2 p1 = b1->m_position + r1
  		var p1X = b1.m_position.x + r1X
  		var p1Y = b1.m_position.y + r1Y
  		//b2Vec2 p2 = b2->m_position + r2
  		var p2X = b2.m_position.x + r2X
  		var p2Y = b2.m_position.y + r2Y
  
  		//b2Vec2 ptpC = p2 - p1
  		var ptpCX = p2X - p1X
  		var ptpCY = p2Y - p1Y
  
  		//float32 positionError = ptpC.Length()
  		positionError = Math.sqrt(ptpCX*ptpCX + ptpCY*ptpCY)
  
  		// Prevent overly large corrections.
  		//b2Vec2 dpMax(b2_maxLinearCorrection, b2_maxLinearCorrection)
  		//ptpC = b2Clamp(ptpC, -dpMax, dpMax)
  
  		//float32 invMass1 = b1->m_invMass, invMass2 = b2->m_invMass
  		var invMass1 = b1.m_invMass
  		var invMass2 = b2.m_invMass
  		//float32 invI1 = b1->m_invI, invI2 = b2->m_invI
  		var invI1 = b1.m_invI
  		var invI2 = b2.m_invI
  
  		//b2Mat22 @K1
  		@K1.col1.x = invMass1 + invMass2	@K1.col2.x = 0.0
  		@K1.col1.y = 0.0					@K1.col2.y = invMass1 + invMass2
  
  		//b2Mat22 @K2
  		@K2.col1.x =  invI1 * r1Y * r1Y	@K2.col2.x = -invI1 * r1X * r1Y
  		@K2.col1.y = -invI1 * r1X * r1Y	@K2.col2.y =  invI1 * r1X * r1X
  
  		//b2Mat22 @K3
  		@K3.col1.x =  invI2 * r2Y * r2Y		@K3.col2.x = -invI2 * r2X * r2Y
  		@K3.col1.y = -invI2 * r2X * r2Y		@K3.col2.y =  invI2 * r2X * r2X
  
  		//b2Mat22 @K = @K1 + @K2 + @K3
  		@K.SetM(@K1)
  		@K.AddM(@K2)
  		@K.AddM(@K3)
  		//b2Vec2 impulse = @K.Solve(-ptpC)
  		@K.Solve(b2RevoluteJoint.tImpulse, -ptpCX, -ptpCY)
  		var impulseX = b2RevoluteJoint.tImpulse.x
  		var impulseY = b2RevoluteJoint.tImpulse.y
  
  		//b1.m_position -= b1.m_invMass * impulse
  		b1.m_position.x -= b1.m_invMass * impulseX
  		b1.m_position.y -= b1.m_invMass * impulseY
  		//b1.m_rotation -= b1.m_invI * b2Cross(r1, impulse)
  		b1.m_rotation -= b1.m_invI * (r1X * impulseY - r1Y * impulseX)
  		b1.m_R.Set(b1.m_rotation)
  
  		//b2.m_position += b2.m_invMass * impulse
  		b2.m_position.x += b2.m_invMass * impulseX
  		b2.m_position.y += b2.m_invMass * impulseY
  		//b2.m_rotation += b2.m_invI * b2Cross(r2, impulse)
  		b2.m_rotation += b2.m_invI * (r2X * impulseY - r2Y * impulseX)
  		b2.m_R.Set(b2.m_rotation)
  
  
  		// Handle limits.
  		var angularError = 0.0
  
  		if (@m_enableLimit && @m_limitState != b2Joint.e_inactiveLimit)
  		{
  			var angle = b2.m_rotation - b1.m_rotation - @m_intialAngle
  			var limitImpulse = 0.0
  
  			if (@m_limitState == b2Joint.e_equalLimits)
  			{
  				// Prevent large angular corrections
  				limitC = b2Math.b2Clamp(angle, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection)
  				limitImpulse = -@m_motorMass * limitC
  				angularError = b2Math.b2Abs(limitC)
  			}
  			else if (@m_limitState == b2Joint.e_atLowerLimit)
  			{
  				limitC = angle - @m_lowerAngle
  				angularError = b2Math.b2Max(0.0, -limitC)
  
  				// Prevent large angular corrections and allow some slop.
  				limitC = b2Math.b2Clamp(limitC + b2Settings.b2_angularSlop, -b2Settings.b2_maxAngularCorrection, 0.0)
  				limitImpulse = -@m_motorMass * limitC
  				oldLimitImpulse = @m_limitPositionImpulse
  				@m_limitPositionImpulse = b2Math.b2Max(@m_limitPositionImpulse + limitImpulse, 0.0)
  				limitImpulse = @m_limitPositionImpulse - oldLimitImpulse
  			}
  			else if (@m_limitState == b2Joint.e_atUpperLimit)
  			{
  				limitC = angle - @m_upperAngle
  				angularError = b2Math.b2Max(0.0, limitC)
  
  				// Prevent large angular corrections and allow some slop.
  				limitC = b2Math.b2Clamp(limitC - b2Settings.b2_angularSlop, 0.0, b2Settings.b2_maxAngularCorrection)
  				limitImpulse = -@m_motorMass * limitC
  				oldLimitImpulse = @m_limitPositionImpulse
  				@m_limitPositionImpulse = b2Math.b2Min(@m_limitPositionImpulse + limitImpulse, 0.0)
  				limitImpulse = @m_limitPositionImpulse - oldLimitImpulse
  			}
  
  			b1.m_rotation -= b1.m_invI * limitImpulse
  			b1.m_R.Set(b1.m_rotation)
  			b2.m_rotation += b2.m_invI * limitImpulse
  			b2.m_R.Set(b2.m_rotation)
  		}
  
  		return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop
  	},
  
  	m_localAnchor1: new b2Vec2(),
  	m_localAnchor2: new b2Vec2(),
  	m_ptpImpulse: new b2Vec2(),
  	m_motorImpulse: null,
  	m_limitImpulse: null,
  	m_limitPositionImpulse: null,
  
  	m_ptpMass: new b2Mat22(),
  	m_motorMass: null,
  	m_intialAngle: null,
  	m_lowerAngle: null,
  	m_upperAngle: null,
  	m_maxMotorTorque: null,
  	m_motorSpeed: null,
  
  	m_enableLimit: null,
  	m_enableMotor: null,
  	m_limitState: 0})
  
  b2RevoluteJoint.tImpulse = new b2Vec2()*/
  
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
  var b2RevoluteJointDef;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  exports.b2RevoluteJointDef = b2RevoluteJointDef = b2RevoluteJointDef = (function() {
    __extends(b2RevoluteJointDef, b2JointDef);
    b2RevoluteJointDef.prototype.anchorPoint = null;
    b2RevoluteJointDef.prototype.lowerAngle = null;
    b2RevoluteJointDef.prototype.upperAngle = null;
    b2RevoluteJointDef.prototype.motorTorque = null;
    b2RevoluteJointDef.prototype.motorSpeed = null;
    b2RevoluteJointDef.prototype.enableLimit = null;
    b2RevoluteJointDef.prototype.enableMotor = null;
    function b2RevoluteJointDef() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.type = b2Joint.e_revoluteJoint;
      this.anchorPoint = new b2Vec2(0.0, 0.0);
      this.lowerAngle = 0.0;
      this.upperAngle = 0.0;
      this.motorTorque = 0.0;
      this.motorSpeed = 0.0;
      this.enableLimit = false;
      this.enableMotor = false;
    }
    return b2RevoluteJointDef;
  })();

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