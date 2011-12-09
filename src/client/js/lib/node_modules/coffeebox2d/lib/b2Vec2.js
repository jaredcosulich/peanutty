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