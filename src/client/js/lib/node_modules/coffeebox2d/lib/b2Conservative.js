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