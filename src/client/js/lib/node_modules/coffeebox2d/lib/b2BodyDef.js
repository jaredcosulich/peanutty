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