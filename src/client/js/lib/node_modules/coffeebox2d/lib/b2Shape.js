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