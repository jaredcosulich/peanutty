var ImageStore, child_process, cropResize, gm, maxSize, riak;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
child_process = require('child_process');
riak = require('riak-js');
exports.gm = gm = function(photo, _args, callback) {
  var args, child, chunks;
  args = ['convert', '+profile', '"*"', '-', 'jpeg:-'];
  [].splice.apply(args, [1, 0].concat(_args)), _args;
  chunks = [];
  child = child_process.spawn('gm', args);
  child.stdin.end(photo);
  child.stdout.on('data', function(chunk) {
    return chunks.push(chunk);
  });
  return child.on('exit', function(code) {
    var chunk, data, size, _i, _j, _len, _len2;
    size = 0;
    for (_i = 0, _len = chunks.length; _i < _len; _i++) {
      chunk = chunks[_i];
      size += chunk.length;
    }
    data = new Buffer(size);
    size = 0;
    for (_j = 0, _len2 = chunks.length; _j < _len2; _j++) {
      chunk = chunks[_j];
      chunk.copy(data, size, 0);
      size += chunk.length;
    }
    return callback(data);
  });
};
exports.cropResize = cropResize = function(photo, size, coords, callback) {
  var args;
  args = ['-quality', '90', '-crop', "" + coords.width + "x" + coords.height + "+" + coords.left + "+" + coords.top, '-resize', "" + size.width + "x" + size.height];
  return gm(photo, args, callback);
};
exports.maxSize = maxSize = function(photo, size, callback) {
  var args;
  args = ['-quality', '90', '-resize', "" + size.width + "x" + size.height + ">"];
  return gm(photo, args, callback);
};
ImageStore = (function() {
  function ImageStore() {
    this.db = riak.getClient();
  }
  ImageStore.prototype.put = function(s) {
    return this.db.get('users', s.uid, __bind(function(err, user, user_meta) {
      if (err && err.statusCode === 404) {
        user = {};
        user_meta = {};
        err = null;
      }
      if (err) {
        return s.error(err);
      }
      return this.db.saveLarge(null, s.photo, __bind(function(err, _, photo_meta) {
        var _ref;
        if (err) {
          return s.error(err);
        }
        if ((_ref = user.photo) == null) {
          user.photo = {};
        }
        user.photo[s.type] = photo_meta.key;
        return this.db.save('users', s.uid, user, __bind(function(err, _, user_meta) {
          if (err) {
            return s.error(err);
          }
          return s.success(user_meta.key);
        }, this));
      }, this));
    }, this));
  };
  ImageStore.prototype.get = function(s) {
    return this.db.get('users', s.uid, __bind(function(err, user, user_meta) {
      if (err) {
        return s.error(err);
      }
      if (!user) {
        s.error('No user');
      }
      if (!user.photo || !s.type in user.photo) {
        s.error('Not found');
      }
      return this.db.getLarge(user.photo[s.type], __bind(function(err, photo, photo_meta) {
        if (err) {
          return s.error(err);
        }
        return s.success(photo);
      }, this));
    }, this));
  };
  ImageStore.prototype.getKey = function(s) {
    return this.db.getLarge(s.key, __bind(function(err, photo, photo_meta) {
      if (err) {
        return s.error(err);
      }
      return s.success(photo);
    }, this));
  };
  return ImageStore;
})();
exports.ImageStore = ImageStore;