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