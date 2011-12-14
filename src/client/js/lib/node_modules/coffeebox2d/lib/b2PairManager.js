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
var b2PairManager;
exports.b2PairManager = b2PairManager = b2PairManager = (function() {
  b2PairManager.prototype.m_broadPhase = null;
  b2PairManager.prototype.m_callback = null;
  b2PairManager.prototype.m_pairs = null;
  b2PairManager.prototype.m_freePair = 0;
  b2PairManager.prototype.m_pairCount = 0;
  b2PairManager.prototype.m_pairBuffer = null;
  b2PairManager.prototype.m_pairBufferCount = 0;
  b2PairManager.prototype.m_hashTable = null;
  function b2PairManager() {
    var i, _ref, _ref2, _ref3, _ref4;
    this.m_hashTable = new Array(b2Pair.b2_tableCapacity);
    for (i = 0, _ref = b2Pair.b2_tableCapacity; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      this.m_hashTable[i] = b2Pair.b2_nullPair;
    }
    this.m_pairs = new Array(b2Settings.b2_maxPairs);
    for (i = 0, _ref2 = b2Settings.b2_maxPairs; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      this.m_pairs[i] = new b2Pair();
    }
    this.m_pairBuffer = new Array(b2Settings.b2_maxPairs);
    for (i = 0, _ref3 = b2Settings.b2_maxPairs; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      this.m_pairBuffer[i] = new b2BufferedPair();
    }
    for (i = 0, _ref4 = b2Settings.b2_maxPairs; 0 <= _ref4 ? i < _ref4 : i > _ref4; 0 <= _ref4 ? i++ : i--) {
      this.m_pairs[i].proxyId1 = b2Pair.b2_nullProxy;
      this.m_pairs[i].proxyId2 = b2Pair.b2_nullProxy;
      this.m_pairs[i].userData = null;
      this.m_pairs[i].status = 0;
      this.m_pairs[i].next = i + 1;
    }
    this.m_pairs[b2Settings.b2_maxPairs - 1].next = b2Pair.b2_nullPair;
    this.m_pairCount = 0;
  }
  b2PairManager.prototype.Initialize = function(broadPhase, callback) {
    this.m_broadPhase = broadPhase;
    return this.m_callback = callback;
  };
  b2PairManager.prototype.AddBufferedPair = function(proxyId1, proxyId2) {
    var pair;
    pair = this.AddPair(proxyId1, proxyId2);
    if (pair.IsBuffered() === false) {
      pair.SetBuffered();
      this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = pair.proxyId1;
      this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = pair.proxyId2;
      ++this.m_pairBufferCount;
    }
    pair.ClearRemoved();
    if (b2BroadPhase.s_validate) {
      return this.ValidateBuffer();
    }
  };
  b2PairManager.prototype.RemoveBufferedPair = function(proxyId1, proxyId2) {
    var pair;
    pair = this.Find(proxyId1, proxyId2);
    if (pair == null) {
      return;
    }
    if (pair.IsBuffered() === false) {
      pair.SetBuffered();
      this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = pair.proxyId1;
      this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = pair.proxyId2;
      ++this.m_pairBufferCount;
    }
    pair.SetRemoved();
    if (b2BroadPhase.s_validate) {
      return this.ValidateBuffer();
    }
  };
  b2PairManager.prototype.AddPair = function(proxyId1, proxyId2) {
    var hash, pIndex, pair, temp;
    if (proxyId1 > proxyId2) {
      temp = proxyId1;
      proxyId1 = proxyId2;
      proxyId2 = temp;
    }
    hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
    pair = pair = this.FindHash(proxyId1, proxyId2, hash);
    if (pair !== null) {
      return pair;
    }
    pIndex = this.m_freePair;
    pair = this.m_pairs[pIndex];
    this.m_freePair = pair.next;
    pair.proxyId1 = proxyId1;
    pair.proxyId2 = proxyId2;
    pair.status = 0;
    pair.userData = null;
    pair.next = this.m_hashTable[hash];
    this.m_hashTable[hash] = pIndex;
    ++this.m_pairCount;
    return pair;
  };
  b2PairManager.prototype.RemovePair = function(proxyId1, proxyId2) {
    var hash, index, node, pNode, pair, temp, userData;
    if (proxyId1 > proxyId2) {
      temp = proxyId1;
      proxyId1 = proxyId2;
      proxyId2 = temp;
    }
    hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
    node = this.m_hashTable[hash];
    pNode = null;
    while (node !== b2Pair.b2_nullPair) {
      if (b2PairManager.Equals(this.m_pairs[node], proxyId1, proxyId2)) {
        index = node;
        if (pNode) {
          pNode.next = this.m_pairs[node].next;
        } else {
          this.m_hashTable[hash] = this.m_pairs[node].next;
        }
        pair = this.m_pairs[index];
        userData = pair.userData;
        pair.next = this.m_freePair;
        pair.proxyId1 = b2Pair.b2_nullProxy;
        pair.proxyId2 = b2Pair.b2_nullProxy;
        pair.userData = null;
        pair.status = 0;
        this.m_freePair = index;
        --this.m_pairCount;
        return userData;
      } else {
        pNode = this.m_pairs[node];
        node = pNode.next;
      }
    }
    return null;
  };
  b2PairManager.prototype.Find = function(proxyId1, proxyId2) {
    var hash, temp;
    if (proxyId1 > proxyId2) {
      temp = proxyId1;
      proxyId1 = proxyId2;
      proxyId2 = temp;
    }
    hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
    return this.FindHash(proxyId1, proxyId2, hash);
  };
  b2PairManager.prototype.FindHash = function(proxyId1, proxyId2, hash) {
    var index;
    index = this.m_hashTable[hash];
    while (index !== b2Pair.b2_nullPair && b2PairManager.Equals(this.m_pairs[index], proxyId1, proxyId2) === false) {
      index = this.m_pairs[index].next;
    }
    if (index === b2Pair.b2_nullPair) {
      return null;
    }
    return this.m_pairs[index];
  };
  b2PairManager.prototype.Commit = function() {
    var i, pair, proxies, proxy1, proxy2, removeCount, _ref;
    removeCount = 0;
    proxies = this.m_broadPhase.m_proxyPool;
    for (i = 0, _ref = this.m_pairBufferCount; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      pair = this.Find(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
      pair.ClearBuffered();
      proxy1 = proxies[pair.proxyId1];
      proxy2 = proxies[pair.proxyId2];
      if (pair.IsRemoved()) {
        if (pair.IsFinal() === true) {
          this.m_callback.PairRemoved(proxy1.userData, proxy2.userData, pair.userData);
        }
        this.m_pairBuffer[removeCount].proxyId1 = pair.proxyId1;
        this.m_pairBuffer[removeCount].proxyId2 = pair.proxyId2;
        ++removeCount;
      } else {
        if (pair.IsFinal() === false) {
          pair.userData = this.m_callback.PairAdded(proxy1.userData, proxy2.userData);
          pair.SetFinal();
        }
      }
    }
    for (i = 0; 0 <= removeCount ? i < removeCount : i > removeCount; 0 <= removeCount ? i++ : i--) {
      this.RemovePair(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
    }
    this.m_pairBufferCount = 0;
    if (b2BroadPhase.s_validate) {
      return this.ValidateTable();
    }
  };
  return b2PairManager;
})();
b2PairManager.Hash = function(proxyId1, proxyId2) {
  var key;
  key = ((proxyId2 << 16) & 0xffff0000) | proxyId1;
  key = ~key + ((key << 15) & 0xFFFF8000);
  key = key ^ ((key >> 12) & 0x000fffff);
  key = key + ((key << 2) & 0xFFFFFFFC);
  key = key ^ ((key >> 4) & 0x0fffffff);
  key = key * 2057;
  key = key ^ ((key >> 16) & 0x0000ffff);
  return key;
};
b2PairManager.Equals = function(pair, proxyId1, proxyId2) {
  return pair.proxyId1 === proxyId1 && pair.proxyId2 === proxyId2;
};
b2PairManager.EqualsPair = function(pair1, pair2) {
  return pair1.proxyId1 === pair2.proxyId1 && pair1.proxyId2 === pair2.proxyId2;
};