var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
window.escapeRegExp = function(str) {
  return str.replace(/[.*+?#^$|(){},\[\]\-\s\\]/g, '\\$&');
};
window.jsonify = function(ob) {
  var name, result, value;
  if (ob == null) {
    ob = {};
  }
  result = {};
  for (name in ob) {
    value = ob[name];
    result[name] = JSON.stringify(value);
  }
  return result;
};
window.zeroPad = function(n, width) {
  var i, s, zeros;
  s = n.toString();
  zeros = width - s.length;
  for (i = 0; 0 <= zeros ? i < zeros : i > zeros; 0 <= zeros ? i++ : i--) {
    s = '0' + s;
  }
  return s;
};
String.prototype.startsWith = function(str) {
  return this.substr(0, str.length) === str;
};
String.prototype.endsWith = function(str) {
  return this.substr(this.length - str.length, str.length) === str;
};
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
String.prototype.toTitleCase = function() {
  var i, str, words, _ref;
  str = "";
  words = this.split(" ");
  for (i = 0, _ref = words.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    str += (i != null ? i : {
      " ": ""
    }) + words[i].capitalize();
  }
  return str;
};
Date.prototype.longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Date.prototype.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
Date.prototype.longDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
Date.prototype.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
Date.prototype.strftime = function(format) {
  var day, hours, minutes, month, seconds, weekday, year;
  year = this.getFullYear();
  month = this.getMonth();
  day = this.getDate();
  weekday = this.getDay();
  hours = this.getHours();
  minutes = this.getMinutes();
  seconds = this.getSeconds();
  return format.replace(/\%([aAbBcdDHiImMpSwyY])/g, __bind(function(part) {
    var _ref, _ref2, _ref3;
    switch (part[1]) {
      case 'a':
        return this.shortDays[weekday];
      case 'A':
        return this.longDays[weekday];
      case 'b':
        return this.shortMonths[month];
      case 'B':
        return this.longMonths[month];
      case 'c':
        return this.toString();
      case 'd':
        return day;
      case 'D':
        return zeroPad(day, 2);
      case 'H':
        return zeroPad(hours, 2);
      case 'i':
        return (_ref = hours === 12 || hours === 0) != null ? _ref : {
          12: (hours + 12) % 12
        };
      case 'I':
        return zeroPad((_ref2 = hours === 12 || hours === 0) != null ? _ref2 : {
          12: (hours + 12) % 12
        }, 2);
      case 'm':
        return zeroPad(month + 1, 2);
      case 'M':
        return zeroPad(minutes, 2);
      case 'p':
        return (_ref3 = hours > 11) != null ? _ref3 : {
          "PM": "AM"
        };
      case 'S':
        return zeroPad(seconds, 2);
      case 'w':
        return weekday;
      case 'y':
        return zeroPad(year % 100);
      case 'Y':
        return year;
    }
  }, this));
};