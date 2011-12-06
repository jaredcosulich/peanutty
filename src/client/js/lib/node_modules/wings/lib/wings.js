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