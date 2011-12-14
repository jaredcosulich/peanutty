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
var b2PolyShape;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2PolyShape = b2PolyShape = b2PolyShape = (function() {
  __extends(b2PolyShape, b2Shape);
  function b2PolyShape(def, body, newOrigin) {
    var aabb, box, broadPhase, centroidX, centroidY, hX, hY, hcX, hcY, i, i1, i2, length, localR, maxVertexX, maxVertexY, minVertexX, minVertexY, poly, positionX, positionY, tVec, uX, uY, v, _ref, _ref2, _ref3, _ref4;
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
    this.syncAABB = new b2AABB();
    this.syncMat = new b2Mat22();
    this.m_localCentroid = new b2Vec2();
    this.m_localOBB = new b2OBB();
    aabb = new b2AABB();
    this.m_vertices = new Array(b2Settings.b2_maxPolyVertices);
    this.m_coreVertices = new Array(b2Settings.b2_maxPolyVertices);
    this.m_normals = new Array(b2Settings.b2_maxPolyVertices);
    this.m_type = b2Shape.e_polyShape;
    localR = new b2Mat22(def.localRotation);
    if (def.type === b2Shape.e_boxShape) {
      this.m_localCentroid.x = def.localPosition.x - newOrigin.x;
      this.m_localCentroid.y = def.localPosition.y - newOrigin.y;
      box = def;
      this.m_vertexCount = 4;
      hX = box.extents.x;
      hY = box.extents.y;
      hcX = Math.max(0.0, hX - 2.0 * b2Settings.b2_linearSlop);
      hcY = Math.max(0.0, hY - 2.0 * b2Settings.b2_linearSlop);
      tVec = this.m_vertices[0] = new b2Vec2();
      tVec.x = localR.col1.x * hX + localR.col2.x * hY;
      tVec.y = localR.col1.y * hX + localR.col2.y * hY;
      tVec = this.m_vertices[1] = new b2Vec2();
      tVec.x = localR.col1.x * -hX + localR.col2.x * hY;
      tVec.y = localR.col1.y * -hX + localR.col2.y * hY;
      tVec = this.m_vertices[2] = new b2Vec2();
      tVec.x = localR.col1.x * -hX + localR.col2.x * -hY;
      tVec.y = localR.col1.y * -hX + localR.col2.y * -hY;
      tVec = this.m_vertices[3] = new b2Vec2();
      tVec.x = localR.col1.x * hX + localR.col2.x * -hY;
      tVec.y = localR.col1.y * hX + localR.col2.y * -hY;
      tVec = this.m_coreVertices[0] = new b2Vec2();
      tVec.x = localR.col1.x * hcX + localR.col2.x * hcY;
      tVec.y = localR.col1.y * hcX + localR.col2.y * hcY;
      tVec = this.m_coreVertices[1] = new b2Vec2();
      tVec.x = localR.col1.x * -hcX + localR.col2.x * hcY;
      tVec.y = localR.col1.y * -hcX + localR.col2.y * hcY;
      tVec = this.m_coreVertices[2] = new b2Vec2();
      tVec.x = localR.col1.x * -hcX + localR.col2.x * -hcY;
      tVec.y = localR.col1.y * -hcX + localR.col2.y * -hcY;
      tVec = this.m_coreVertices[3] = new b2Vec2();
      tVec.x = localR.col1.x * hcX + localR.col2.x * -hcY;
      tVec.y = localR.col1.y * hcX + localR.col2.y * -hcY;
    } else {
      poly = def;
      this.m_vertexCount = poly.vertexCount;
      b2Shape.PolyCentroid(poly.vertices, poly.vertexCount, b2PolyShape.tempVec);
      centroidX = b2PolyShape.tempVec.x;
      centroidY = b2PolyShape.tempVec.y;
      this.m_localCentroid.x = def.localPosition.x + (localR.col1.x * centroidX + localR.col2.x * centroidY) - newOrigin.x;
      this.m_localCentroid.y = def.localPosition.y + (localR.col1.y * centroidX + localR.col2.y * centroidY) - newOrigin.y;
      for (i = 0, _ref = this.m_vertexCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        this.m_vertices[i] = new b2Vec2();
        this.m_coreVertices[i] = new b2Vec2();
        hX = poly.vertices[i].x - centroidX;
        hY = poly.vertices[i].y - centroidY;
        this.m_vertices[i].x = localR.col1.x * hX + localR.col2.x * hY;
        this.m_vertices[i].y = localR.col1.y * hX + localR.col2.y * hY;
        uX = this.m_vertices[i].x;
        uY = this.m_vertices[i].y;
        length = Math.sqrt(uX * uX + uY * uY);
        if (length > Number.MIN_VALUE) {
          uX *= 1.0 / length;
          uY *= 1.0 / length;
        }
        this.m_coreVertices[i].x = this.m_vertices[i].x - 2.0 * b2Settings.b2_linearSlop * uX;
        this.m_coreVertices[i].y = this.m_vertices[i].y - 2.0 * b2Settings.b2_linearSlop * uY;
      }
    }
    minVertexX = Number.MAX_VALUE;
    minVertexY = Number.MAX_VALUE;
    maxVertexX = -Number.MAX_VALUE;
    maxVertexY = -Number.MAX_VALUE;
    this.m_maxRadius = 0.0;
    for (i = 0, _ref2 = this.m_vertexCount; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      v = this.m_vertices[i];
      minVertexX = Math.min(minVertexX, v.x);
      minVertexY = Math.min(minVertexY, v.y);
      maxVertexX = Math.max(maxVertexX, v.x);
      maxVertexY = Math.max(maxVertexY, v.y);
      this.m_maxRadius = Math.max(this.m_maxRadius, v.Length());
    }
    this.m_localOBB.R.SetIdentity();
    this.m_localOBB.center.Set((minVertexX + maxVertexX) * 0.5, (minVertexY + maxVertexY) * 0.5);
    this.m_localOBB.extents.Set((maxVertexX - minVertexX) * 0.5, (maxVertexY - minVertexY) * 0.5);
    i1 = 0;
    i2 = 0;
    for (i = 0, _ref3 = this.m_vertexCount; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      this.m_normals[i] = new b2Vec2();
      i1 = i;
      i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
      this.m_normals[i].x = this.m_vertices[i2].y - this.m_vertices[i1].y;
      this.m_normals[i].y = -(this.m_vertices[i2].x - this.m_vertices[i1].x);
      this.m_normals[i].Normalize();
    }
    for (i = 0, _ref4 = this.m_vertexCount; 0 <= _ref4 ? i < _ref4 : i > _ref4; 0 <= _ref4 ? i++ : i--) {
      i1 = i;
      i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
    }
    this.m_R.SetM(this.m_body.m_R);
    this.m_position.x = this.m_body.m_position.x + (this.m_R.col1.x * this.m_localCentroid.x + this.m_R.col2.x * this.m_localCentroid.y);
    this.m_position.y = this.m_body.m_position.y + (this.m_R.col1.y * this.m_localCentroid.x + this.m_R.col2.y * this.m_localCentroid.y);
    b2PolyShape.tAbsR.col1.x = this.m_R.col1.x * this.m_localOBB.R.col1.x + this.m_R.col2.x * this.m_localOBB.R.col1.y;
    b2PolyShape.tAbsR.col1.y = this.m_R.col1.y * this.m_localOBB.R.col1.x + this.m_R.col2.y * this.m_localOBB.R.col1.y;
    b2PolyShape.tAbsR.col2.x = this.m_R.col1.x * this.m_localOBB.R.col2.x + this.m_R.col2.x * this.m_localOBB.R.col2.y;
    b2PolyShape.tAbsR.col2.y = this.m_R.col1.y * this.m_localOBB.R.col2.x + this.m_R.col2.y * this.m_localOBB.R.col2.y;
    b2PolyShape.tAbsR.Abs();
    hX = b2PolyShape.tAbsR.col1.x * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * this.m_localOBB.extents.y;
    hY = b2PolyShape.tAbsR.col1.y * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * this.m_localOBB.extents.y;
    positionX = this.m_position.x + (this.m_R.col1.x * this.m_localOBB.center.x + this.m_R.col2.x * this.m_localOBB.center.y);
    positionY = this.m_position.y + (this.m_R.col1.y * this.m_localOBB.center.x + this.m_R.col2.y * this.m_localOBB.center.y);
    aabb.minVertex.x = positionX - hX;
    aabb.minVertex.y = positionY - hY;
    aabb.maxVertex.x = positionX + hX;
    aabb.maxVertex.y = positionY + hY;
    broadPhase = this.m_body.m_world.m_broadPhase;
    if (broadPhase.InRange(aabb)) {
      this.m_proxyId = broadPhase.CreateProxy(aabb, this);
    } else {
      this.m_proxyId = b2Pair.b2_nullProxy;
    }
    if (this.m_proxyId === b2Pair.b2_nullProxy) {
      this.m_body.Freeze();
    }
  }
  b2PolyShape.prototype.syncAABB = new b2AABB();
  b2PolyShape.prototype.syncMat = new b2Mat22();
  b2PolyShape.prototype.Synchronize = function(position1, R1, position2, R2) {
    var broadPhase, centerX, centerY, hX, hY, v1, v2, v3, v4;
    this.m_R.SetM(R2);
    this.m_position.x = this.m_body.m_position.x + (R2.col1.x * this.m_localCentroid.x + R2.col2.x * this.m_localCentroid.y);
    this.m_position.y = this.m_body.m_position.y + (R2.col1.y * this.m_localCentroid.x + R2.col2.y * this.m_localCentroid.y);
    if (this.m_proxyId === b2Pair.b2_nullProxy) {
      return;
    }
    v1 = R1.col1;
    v2 = R1.col2;
    v3 = this.m_localOBB.R.col1;
    v4 = this.m_localOBB.R.col2;
    this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
    this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
    this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
    this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
    this.syncMat.Abs();
    hX = this.m_localCentroid.x + this.m_localOBB.center.x;
    hY = this.m_localCentroid.y + this.m_localOBB.center.y;
    centerX = position1.x + (R1.col1.x * hX + R1.col2.x * hY);
    centerY = position1.y + (R1.col1.y * hX + R1.col2.y * hY);
    hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
    hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
    this.syncAABB.minVertex.x = centerX - hX;
    this.syncAABB.minVertex.y = centerY - hY;
    this.syncAABB.maxVertex.x = centerX + hX;
    this.syncAABB.maxVertex.y = centerY + hY;
    v1 = R2.col1;
    v2 = R2.col2;
    v3 = this.m_localOBB.R.col1;
    v4 = this.m_localOBB.R.col2;
    this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
    this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
    this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
    this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
    this.syncMat.Abs();
    hX = this.m_localCentroid.x + this.m_localOBB.center.x;
    hY = this.m_localCentroid.y + this.m_localOBB.center.y;
    centerX = position2.x + (R2.col1.x * hX + R2.col2.x * hY);
    centerY = position2.y + (R2.col1.y * hX + R2.col2.y * hY);
    hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
    hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
    this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, centerX - hX);
    this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, centerY - hY);
    this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, centerX + hX);
    this.syncAABB.maxVertex.y = Math.max(this.syncAABB.maxVertex.y, centerY + hY);
    broadPhase = this.m_body.m_world.m_broadPhase;
    if (broadPhase.InRange(this.syncAABB)) {
      return broadPhase.MoveProxy(this.m_proxyId, this.syncAABB);
    } else {
      return this.m_body.Freeze();
    }
  };
  b2PolyShape.prototype.QuickSync = function(position, R) {
    this.m_R.SetM(R);
    this.m_position.x = position.x + (R.col1.x * this.m_localCentroid.x + R.col2.x * this.m_localCentroid.y);
    return this.m_position.y = position.y + (R.col1.y * this.m_localCentroid.x + R.col2.y * this.m_localCentroid.y);
  };
  b2PolyShape.prototype.ResetProxy = function(broadPhase) {
    var R, aabb, absR, h, position, proxy;
    if (this.m_proxyId === b2Pair.b2_nullProxy) {
      return;
    }
    proxy = broadPhase.GetProxy(this.m_proxyId);
    broadPhase.DestroyProxy(this.m_proxyId);
    proxy = null;
    R = b2Math.b2MulMM(this.m_R, this.m_localOBB.R);
    absR = b2Math.b2AbsM(R);
    h = b2Math.b2MulMV(absR, this.m_localOBB.extents);
    position = b2Math.b2MulMV(this.m_R, this.m_localOBB.center);
    position.Add(this.m_position);
    aabb = new b2AABB();
    aabb.minVertex.SetV(position);
    aabb.minVertex.Subtract(h);
    aabb.maxVertex.SetV(position);
    aabb.maxVertex.Add(h);
    if (broadPhase.InRange(aabb)) {
      this.m_proxyId = broadPhase.CreateProxy(aabb, this);
    } else {
      this.m_proxyId = b2Pair.b2_nullProxy;
    }
    if (this.m_proxyId === b2Pair.b2_nullProxy) {
      return this.m_body.Freeze();
    }
  };
  b2PolyShape.prototype.Support = function(dX, dY, out) {
    var bestIndex, bestValue, dLocalX, dLocalY, i, value, _ref;
    dLocalX = dX * this.m_R.col1.x + dY * this.m_R.col1.y;
    dLocalY = dX * this.m_R.col2.x + dY * this.m_R.col2.y;
    bestIndex = 0;
    bestValue = this.m_coreVertices[0].x * dLocalX + this.m_coreVertices[0].y * dLocalY;
    for (i = 0, _ref = this.m_vertexCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      value = this.m_coreVertices[i].x * dLocalX + this.m_coreVertices[i].y * dLocalY;
      if (value > bestValue) {
        bestIndex = i;
        bestValue = value;
      }
    }
    return out.Set(this.m_position.x + (this.m_R.col1.x * this.m_coreVertices[bestIndex].x + this.m_R.col2.x * this.m_coreVertices[bestIndex].y), this.m_position.y + (this.m_R.col1.y * this.m_coreVertices[bestIndex].x + this.m_R.col2.y * this.m_coreVertices[bestIndex].y));
  };
  b2PolyShape.prototype.m_localCentroid = new b2Vec2();
  b2PolyShape.prototype.m_localOBB = new b2OBB();
  b2PolyShape.prototype.m_vertices = null;
  b2PolyShape.prototype.m_coreVertices = null;
  b2PolyShape.prototype.m_vertexCount = 0;
  b2PolyShape.prototype.m_normals = null;
  return b2PolyShape;
})();
b2PolyShape.tempVec = new b2Vec2();
b2PolyShape.tAbsR = new b2Mat22();