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
var b2World;
exports.b2World = b2World = b2World = (function() {
  function b2World(worldAABB, gravity, doSleep) {
    this.step = new b2TimeStep();
    this.m_contactManager = new b2ContactManager();
    this.m_listener = null;
    this.m_filter = b2CollisionFilter.b2_defaultFilter;
    this.m_bodyList = null;
    this.m_contactList = null;
    this.m_jointList = null;
    this.m_bodyCount = 0;
    this.m_contactCount = 0;
    this.m_jointCount = 0;
    this.m_bodyDestroyList = null;
    this.m_allowSleep = doSleep;
    this.m_gravity = gravity;
    this.m_contactManager.m_world = this;
    this.m_broadPhase = new b2BroadPhase(worldAABB, this.m_contactManager);
    this.m_groundBody = this.CreateBody(new b2BodyDef());
  }
  b2World.prototype.SetListener = function(listener) {
    return this.m_listener = listener;
  };
  b2World.prototype.SetFilter = function(filter) {
    return this.m_filter = filter;
  };
  b2World.prototype.CreateBody = function(def) {
    var b;
    b = new b2Body(def, this);
    b.m_prev = null;
    b.m_next = this.m_bodyList;
    if (this.m_bodyList) {
      this.m_bodyList.m_prev = b;
    }
    this.m_bodyList = b;
    ++this.m_bodyCount;
    return b;
  };
  b2World.prototype.step = new b2TimeStep();
  b2World.prototype.Step = function(dt, iterations) {
    var b, c, cn, i, island, j, jn, k, other, response, seed, stack, stackCount, stackSize, _ref, _ref2;
    this.step.dt = dt;
    this.step.iterations = iterations;
    if (dt > 0.0) {
      this.step.inv_dt = 1.0 / dt;
    } else {
      this.step.inv_dt = 0.0;
    }
    this.m_positionIterationCount = 0;
    this.m_contactManager.CleanContactList();
    this.CleanBodyList();
    this.m_contactManager.Collide();
    island = new b2Island(this.m_bodyCount, this.m_contactCount, this.m_jointCount, this.m_stackAllocator);
    b = this.m_bodyList;
    while (b != null) {
      b.m_flags &= ~b2Body.e_islandFlag;
      b = b.m_next;
    }
    c = this.m_contactList;
    while (c != null) {
      c.m_flags &= ~b2Contact.e_islandFlag;
      c = c.m_next;
    }
    j = this.m_jointList;
    while (j != null) {
      j.m_islandFlag = false;
      j = j.m_next;
    }
    stackSize = this.m_bodyCount;
    stack = new Array(this.m_bodyCount);
    for (k = 0, _ref = this.m_bodyCount; 0 <= _ref ? k < _ref : k > _ref; 0 <= _ref ? k++ : k--) {
      stack[k] = null;
    }
    seed = this.m_bodyList;
    while (seed != null) {
      if (!(seed.m_flags & (b2Body.e_staticFlag | b2Body.e_islandFlag | b2Body.e_sleepFlag | b2Body.e_frozenFlag))) {
        island.Clear();
        stackCount = 0;
        stack[stackCount++] = seed;
        seed.m_flags |= b2Body.e_islandFlag;
        while (stackCount > 0) {
          b = stack[--stackCount];
          island.AddBody(b);
          b.m_flags &= ~b2Body.e_sleepFlag;
          if (!(b.m_flags & b2Body.e_staticFlag)) {
            cn = b.m_contactList;
            while (cn != null) {
              if (!(cn.contact.m_flags & b2Contact.e_islandFlag)) {
                island.AddContact(cn.contact);
                cn.contact.m_flags |= b2Contact.e_islandFlag;
                other = cn.other;
                if (!(other.m_flags & b2Body.e_islandFlag)) {
                  stack[stackCount++] = other;
                  other.m_flags |= b2Body.e_islandFlag;
                }
              }
              cn = cn.next;
            }
            jn = b.m_jointList;
            while (jn != null) {
              if (jn.joint.m_islandFlag !== true) {
                island.AddJoint(jn.joint);
                jn.joint.m_islandFlag = true;
                other = jn.other;
                if (!(other.m_flags & b2Body.e_islandFlag)) {
                  stack[stackCount++] = other;
                  other.m_flags |= b2Body.e_islandFlag;
                }
              }
              jn = jn.next;
            }
          }
        }
        island.Solve(this.step, this.m_gravity);
        this.m_positionIterationCount = b2Math.b2Max(this.m_positionIterationCount, b2Island.m_positionIterationCount);
        if (this.m_allowSleep) {
          island.UpdateSleep(dt);
        }
        for (i = 0, _ref2 = island.m_bodyCount; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
          b = island.m_bodies[i];
          if (b.m_flags & b2Body.e_staticFlag) {
            b.m_flags &= ~b2Body.e_islandFlag;
          }
          if (b.IsFrozen() && this.m_listener) {
            response = this.m_listener.NotifyBoundaryViolated(b);
            if (response === b2WorldListener.b2_destroyBody) {
              this.DestroyBody(b);
              b = null;
              island.m_bodies[i] = null;
            }
          }
        }
      }
      seed = seed.m_next;
    }
    return this.m_broadPhase.Commit();
  };
  b2World.prototype.CleanBodyList = function() {
    var b, b0, jn, jn0;
    this.m_contactManager.m_destroyImmediate = true;
    b = this.m_bodyDestroyList;
    while ((b != null)) {
      b0 = b;
      b = b.m_next;
      jn = b0.m_jointList;
      while ((jn != null)) {
        jn0 = jn;
        jn = jn.next;
        if (this.m_listener) {
          this.m_listener.NotifyJointDestroyed(jn0.joint);
        }
        this.DestroyJoint(jn0.joint);
      }
      b0.Destroy();
    }
    this.m_bodyDestroyList = null;
    return this.m_contactManager.m_destroyImmediate = false;
  };
  return b2World;
})();
b2World.s_enablePositionCorrection = 1;
b2World.s_enableWarmStarting = 1;