/*
Copyright (c) 2006-2007 Erin Catto http:

@ software is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of @ software.
Permission is granted to anyone to use @ software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:
1. The origin of @ software must not be misrepresented you must not
claim that you wrote the original software. If you use @ software
in a product, an acknowledgment in the product documentation would be
appreciated but is not required.
2. Altered source versions must be plainly marked, and must not be
misrepresented the original software.
3. @ notice may not be removed or altered from any source distribution.
*/
var b2ContactManager;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
exports.b2ContactManager = b2ContactManager = b2ContactManager = (function() {
  __extends(b2ContactManager, b2PairCallback);
  function b2ContactManager() {
    this.m_nullContact = new b2NullContact();
    this.m_world = null;
    this.m_destroyImmediate = false;
  }
  b2ContactManager.prototype.PairAdded = function(proxyUserData1, proxyUserData2) {
    var body1, body2, contact, shape1, shape2, tempBody, tempShape;
    shape1 = proxyUserData1;
    shape2 = proxyUserData2;
    body1 = shape1.m_body;
    body2 = shape2.m_body;
    if (body1.IsStatic() && body2.IsStatic()) {
      return this.m_nullContact;
    }
    if (shape1.m_body === shape2.m_body) {
      return this.m_nullContact;
    }
    if (body2.IsConnected(body1)) {
      return this.m_nullContact;
    }
    if (this.m_world.m_filter !== null && this.m_world.m_filter.ShouldCollide(shape1, shape2) === false) {
      return this.m_nullContact;
    }
    if (body2.m_invMass === 0.0) {
      tempShape = shape1;
      shape1 = shape2;
      shape2 = tempShape;
      tempBody = body1;
      body1 = body2;
      body2 = tempBody;
    }
    contact = b2Contact.Create(shape1, shape2, this.m_world.m_blockAllocator);
    if (!(contact != null)) {
      return this.m_nullContact;
    } else {
      contact.m_prev = null;
      contact.m_next = this.m_world.m_contactList;
      if (this.m_world.m_contactList !== null) {
        this.m_world.m_contactList.m_prev = contact;
      }
      this.m_world.m_contactList = contact;
      this.m_world.m_contactCount++;
    }
    return contact;
  };
  b2ContactManager.prototype.CleanContactList = function() {
    var c, c0, _results;
    c = this.m_world.m_contactList;
    _results = [];
    while (c != null) {
      c0 = c;
      c = c.m_next;
      _results.push(c0.m_flags & b2Contact.e_destroyFlag ? (this.DestroyContact(c0), c0 = null) : void 0);
    }
    return _results;
  };
  b2ContactManager.prototype.Collide = function() {
    var body1, body2, c, newCount, node1, node2, oldCount, _results;
    c = this.m_world.m_contactList;
    _results = [];
    while (c != null) {
      if (!(c.m_shape1.m_body.IsSleeping() && c.m_shape2.m_body.IsSleeping())) {
        oldCount = c.GetManifoldCount();
        c.Evaluate();
        newCount = c.GetManifoldCount();
        if (oldCount === 0 && newCount > 0) {
          body1 = c.m_shape1.m_body;
          body2 = c.m_shape2.m_body;
          node1 = c.m_node1;
          node2 = c.m_node2;
          node1.contact = c;
          node1.other = body2;
          node1.prev = null;
          node1.next = body1.m_contactList;
          if (node1.next !== null) {
            node1.next.prev = c.m_node1;
          }
          body1.m_contactList = c.m_node1;
          node2.contact = c;
          node2.other = body1;
          node2.prev = null;
          node2.next = body2.m_contactList;
          if (node2.next !== null) {
            node2.next.prev = node2;
          }
          body2.m_contactList = node2;
        } else if (oldCount > 0 && newCount === 0) {
          body1 = c.m_shape1.m_body;
          body2 = c.m_shape2.m_body;
          node1 = c.m_node1;
          node2 = c.m_node2;
          if (node1.prev) {
            node1.prev.next = node1.next;
          }
          if (node1.next) {
            node1.next.prev = node1.prev;
          }
          if (node1 === body1.m_contactList) {
            body1.m_contactList = node1.next;
          }
          node1.prev = null;
          node1.next = null;
          if (node2.prev) {
            node2.prev.next = node2.next;
          }
          if (node2.next) {
            node2.next.prev = node2.prev;
          }
          if (node2 === body2.m_contactList) {
            body2.m_contactList = node2.next;
          }
          node2.prev = null;
          node2.next = null;
        }
      }
      _results.push(c = c.m_next);
    }
    return _results;
  };
  b2ContactManager.prototype.m_world = null;
  b2ContactManager.prototype.m_nullContact = new b2NullContact();
  b2ContactManager.prototype.m_destroyImmediate = null;
  return b2ContactManager;
})();