var b2PolyAndCircleContact;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2PolyAndCircleContact = b2PolyAndCircleContact = b2PolyAndCircleContact = (function() {
  __extends(b2PolyAndCircleContact, b2Contact);
  function b2PolyAndCircleContact(s1, s2) {
    this.m_node1 = new b2ContactNode();
    this.m_node2 = new b2ContactNode();
    this.m_flags = 0;
    if (!s1 || !s2) {
      this.m_shape1 = null;
      this.m_shape2 = null;
      return;
    }
    this.m_shape1 = s1;
    this.m_shape2 = s2;
    this.m_manifoldCount = 0;
    this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
    this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution);
    this.m_prev = null;
    this.m_next = null;
    this.m_node1.contact = null;
    this.m_node1.prev = null;
    this.m_node1.next = null;
    this.m_node1.other = null;
    this.m_node2.contact = null;
    this.m_node2.prev = null;
    this.m_node2.next = null;
    this.m_node2.other = null;
    this.m_manifold = [new b2Manifold()];
    b2Settings.b2Assert(this.m_shape1.m_type === b2Shape.e_polyShape);
    b2Settings.b2Assert(this.m_shape2.m_type === b2Shape.e_circleShape);
    this.m_manifold[0].pointCount = 0;
    this.m_manifold[0].points[0].normalImpulse = 0.0;
    this.m_manifold[0].points[0].tangentImpulse = 0.0;
  }
  b2PolyAndCircleContact.prototype.Evaluate = function() {
    b2Collision.b2CollidePolyAndCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, false);
    if (this.m_manifold[0].pointCount > 0) {
      return this.m_manifoldCount = 1;
    } else {
      return this.m_manifoldCount = 0;
    }
  };
  b2PolyAndCircleContact.prototype.GetManifolds = function() {
    return this.m_manifold;
  };
  b2PolyAndCircleContact.prototype.m_manifold = [new b2Manifold()];
  return b2PolyAndCircleContact;
})();
b2PolyAndCircleContact.Create = function(shape1, shape2, allocator) {
  return new b2PolyAndCircleContact(shape1, shape2);
};
b2PolyAndCircleContact.Destroy = function(contact, allocator) {};