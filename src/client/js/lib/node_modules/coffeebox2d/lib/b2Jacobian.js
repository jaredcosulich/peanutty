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