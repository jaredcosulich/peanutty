var Buffer, C, EventEmitter, F, MultipartParser, S, f, lower, s;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
EventEmitter = require('events').EventEmitter;
Buffer = require('buffer').Buffer;
s = 0;
S = {
  PARSER_UNINITIALIZED: s++,
  START: s++,
  START_BOUNDARY: s++,
  HEADER_FIELD_START: s++,
  HEADER_FIELD: s++,
  HEADER_VALUE_START: s++,
  HEADER_VALUE: s++,
  HEADER_VALUE_ALMOST_DONE: s++,
  HEADERS_ALMOST_DONE: s++,
  PART_DATA_START: s++,
  PART_DATA: s++,
  PART_END: s++,
  END: s++
};
f = 1;
F = {
  PART_BOUNDARY: f,
  LAST_BOUNDARY: f *= 2
};
C = {
  LF: 10,
  CR: 13,
  SPACE: 32,
  HYPHEN: 45,
  COLON: 58,
  A: 97,
  Z: 122
};
lower = function(c) {
  return c | 0x20;
};
for (s in S) {
  exports[s] = S[s];
}
MultipartParser = (function() {
  __extends(MultipartParser, EventEmitter);
  function MultipartParser(str) {
    EventEmitter.call(this);
    if (str != null) {
      this.initWithBoundary(str);
    }
  }
  MultipartParser.prototype.initWithBoundary = function(str) {
    var i, _ref, _results;
    this.boundary = new Buffer(str.length + 4);
    this.boundary.write('\r\n--', 'ascii', 0);
    this.boundary.write(str, 'ascii', 4);
    this.lookbehind = new Buffer(this.boundary.length + 8);
    this.state = S.START_BOUNDARY;
    this.index = 0;
    this.flags = 0;
    this.boundaryChars = {};
    _results = [];
    for (i = 0, _ref = this.boundary.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      _results.push(this.boundaryChars[this.boundary[i]] = true);
    }
    return _results;
  };
  MultipartParser.prototype.end = function() {
    if (this.state !== S.END) {
      return new Error('MultipartParser.end(): stream ended unexpectedly');
    }
  };
  MultipartParser.prototype.write = function(buffer) {
    var boundary, boundaryChars, boundaryLength, bufferLength, c, callback, clear, dataCallback, flags, i, index, lookbehind, mark, prevIndex, state, _ref;
    i = 0;
    prevIndex = this.index;
    index = this.index;
    state = this.state;
    flags = this.flags;
    lookbehind = this.lookbehind;
    boundary = this.boundary;
    boundaryChars = this.boundaryChars;
    boundaryLength = boundary.length;
    bufferLength = buffer.length;
    mark = __bind(function(name) {
      return this["" + name + "Mark"] = i;
    }, this);
    clear = __bind(function(name) {
      return delete this["" + name + "Mark"];
    }, this);
    callback = __bind(function(name, buffer, start, end) {
      if ((start != null) && start === end) {
        return;
      }
      return this.emit(name, buffer, start, end);
    }, this);
    dataCallback = __bind(function(name) {
      var markSymbol;
      markSymbol = "" + name + "Mark";
      if (!this.hasOwnProperty(markSymbol)) {
        return;
      }
      callback(name, buffer, this[markSymbol], i);
      return this[markSymbol] = 0;
    }, this);
    for (i = 0; 0 <= bufferLength ? i < bufferLength : i > bufferLength; 0 <= bufferLength ? i++ : i--) {
      c = buffer[i];
      switch (state) {
        case S.PARSER_UNINITIALIZED:
          return i;
        case S.START_BOUNDARY:
          if (index === boundaryLength - 2) {
            if (c !== C.CR) {
              return i;
            }
            index++;
          } else if (index - 1 === boundaryLength - 2) {
            if (c !== C.LF) {
              return i;
            }
            index = 0;
            callback('partBegin');
            state = S.HEADER_FIELD_START;
          } else {
            if (c !== boundary[index + 2]) {
              return i;
            }
            index++;
          }
          break;
        case S.HEADER_FIELD_START:
        case S.HEADER_FIELD:
          if (state === S.HEADER_FIELD_START) {
            state = S.HEADER_FIELD;
            mark('headerField');
            index = 0;
          }
          if (c === C.CR) {
            clear('headerField');
            state = S.HEADERS_ALMOST_DONE;
          } else {
            index++;
            if (c === C.HYPHEN) {} else if (c === C.COLON) {
              if (index === 1) {
                return i;
              }
              dataCallback('headerField');
              clear('headerField');
              state = S.HEADER_VALUE_START;
            } else {
              if (!((C.A <= (_ref = lower(c)) && _ref <= C.Z))) {
                return i;
              }
            }
          }
          break;
        case S.HEADER_VALUE_START:
        case S.HEADER_VALUE:
          if (state === S.HEADER_VALUE_START) {
            if (c === C.SPACE) {
              break;
            }
            mark('headerValue');
            state = S.HEADER_VALUE;
          }
          if (c === C.CR) {
            dataCallback('headerValue');
            clear('headerValue');
            callback('headerEnd');
            state = S.HEADER_VALUE_ALMOST_DONE;
          }
          break;
        case S.HEADER_VALUE_ALMOST_DONE:
          if (c !== C.LF) {
            return i;
          }
          state = S.HEADER_FIELD_START;
          break;
        case S.HEADERS_ALMOST_DONE:
          if (c !== C.LF) {
            return i;
          }
          callback('headersEnd');
          state = S.PART_DATA_START;
          break;
        case S.PART_DATA_START:
        case S.PART_DATA:
          if (state === S.PART_DATA_START) {
            state = S.PART_DATA;
            mark('partData');
          }
          prevIndex = index;
          if (index === 0) {
            while (i + boundaryLength <= bufferLength && !buffer[i + boundaryLength - 1] in boundaryChars) {
              i += boundaryLength;
            }
            c = buffer[i];
          }
          if (index < boundaryLength) {
            if (boundary[index] === c) {
              if (index === 0) {
                dataCallback('partData');
                clear('partData');
              }
              index++;
            } else {
              index = 0;
            }
          } else if (index === boundaryLength) {
            index++;
            if (c === C.CR) {
              flags |= F.PART_BOUNDARY;
            } else if (c === C.HYPHEN) {
              flags |= F.LAST_BOUNDARY;
            } else {
              index = 0;
            }
          } else if (index - 1 === boundaryLength) {
            if (flags & F.PART_BOUNDARY) {
              index = 0;
              if (c === C.LF) {
                flags &= ~F.PART_BOUNDARY;
                callback('partEnd');
                callback('partBegin');
                state = S.HEADER_FIELD_START;
                break;
              }
            } else if (flags & F.LAST_BOUNDARY) {
              if (c === C.HYPHEN) {
                callback('partEnd');
                callback('end');
                state = S.END;
              } else {
                index = 0;
              }
            } else {
              index = 0;
            }
          }
          if (index > 0) {
            lookbehind[index - 1] = c;
          } else if (prevIndex > 0) {
            callback('partData', lookbehind, 0, prevIndex);
            prevIndex = 0;
            mark('partData');
            i--;
          }
          break;
        case S.END:
          i = bufferLength;
          break;
        default:
          return i;
      }
    }
    dataCallback('headerField');
    dataCallback('headerValue');
    dataCallback('partData');
    this.index = index;
    this.state = state;
    this.flags = flags;
    return bufferLength;
  };
  return MultipartParser;
})();
exports.MultipartParser = MultipartParser;