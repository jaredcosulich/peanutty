###
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
###


exports.b2PairManager = b2PairManager = class b2PairManager
    m_broadPhase: null
    m_callback: null
    m_pairs: null
    m_freePair: 0
    m_pairCount: 0
    m_pairBuffer: null
    m_pairBufferCount: 0
    m_hashTable: null

    constructor: () ->
        @m_hashTable = new Array(b2Pair.b2_tableCapacity)
        @m_hashTable[i] = b2Pair.b2_nullPair for i in [0...b2Pair.b2_tableCapacity]

        @m_pairs = new Array(b2Settings.b2_maxPairs)
        
        @m_pairs[i] = new b2Pair() for i in [0...b2Settings.b2_maxPairs]

        @m_pairBuffer = new Array(b2Settings.b2_maxPairs)
        @m_pairBuffer[i] = new b2BufferedPair() for i in [0...b2Settings.b2_maxPairs]

        for i in [0...b2Settings.b2_maxPairs]
        	@m_pairs[i].proxyId1 = b2Pair.b2_nullProxy
        	@m_pairs[i].proxyId2 = b2Pair.b2_nullProxy
        	@m_pairs[i].userData = null
        	@m_pairs[i].status = 0
        	@m_pairs[i].next = (i + 1)

        @m_pairs[b2Settings.b2_maxPairs-1].next = b2Pair.b2_nullPair
        @m_pairCount = 0
        
    Initialize: (broadPhase, callback) ->
        @m_broadPhase = broadPhase
        @m_callback = callback
    	
    # As proxies are created and moved, many pairs are created and destroyed. Even worse, the same
    # pair may be added and removed multiple times in a single time step of the physics engine. To reduce
    # traffic in the pair manager, we try to avoid destroying pairs in the pair manager until the
    # end of the physics step. @ is done by buffering all the @RemovePair requests. @AddPair
    # requests are processed immediately because we need the hash table entry for quick lookup.
    # 
    # All user user callbacks are delayed until the buffered pairs are confirmed in @Commit.
    # @ is very important because the user callbacks may be very expensive and client logic
    # may be harmed if pairs are added and removed within the same time step.
    # 
    # Buffer a pair for addition.
    # We may add a pair that is not in the pair manager or pair buffer.
    # We may add a pair that is already in the pair manager and pair buffer.
    # If the added pair is not a new pair, then it must be in the pair buffer (because @RemovePair was called).
    AddBufferedPair: (proxyId1, proxyId2) ->
        pair = @AddPair(proxyId1, proxyId2)

        # If @ pair is not in the pair buffer ...
        if pair.IsBuffered() == false
            pair.SetBuffered()
            @m_pairBuffer[@m_pairBufferCount].proxyId1 = pair.proxyId1
            @m_pairBuffer[@m_pairBufferCount].proxyId2 = pair.proxyId2
            ++@m_pairBufferCount

        # Confirm @ pair for the subsequent call to @Commit.
        pair.ClearRemoved()

        @ValidateBuffer() if b2BroadPhase.s_validate


    # Buffer a pair for removal.
    RemoveBufferedPair: (proxyId1, proxyId2) ->
        #b2Settings.b2Assert(id1 != b2_nullProxy && id2 != b2_nullProxy)
        #b2Settings.b2Assert(@m_pairBufferCount < b2_maxPairs)

        pair = @Find(proxyId1, proxyId2)

        # The pair never existed. This is legal (due to collision filtering).
        return unless pair?

        # If this pair is not in the pair buffer ...
        if (pair.IsBuffered() == false)
            # This must be an old pair.
            pair.SetBuffered()
            @m_pairBuffer[@m_pairBufferCount].proxyId1 = pair.proxyId1
            @m_pairBuffer[@m_pairBufferCount].proxyId2 = pair.proxyId2
            ++@m_pairBufferCount

        pair.SetRemoved()

        @ValidateBuffer() if (b2BroadPhase.s_validate)

 
    # Add a pair and return the new pair. If the pair already exists,
    # no new pair is created and the old one is returned.
    AddPair: (proxyId1, proxyId2) ->
        if (proxyId1 > proxyId2)
            temp = proxyId1
            proxyId1 = proxyId2
            proxyId2 = temp

        hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask

        pair = pair = this.FindHash(proxyId1, proxyId2, hash)

        return pair if (pair != null)

        pIndex = this.m_freePair
        pair = this.m_pairs[pIndex]
        @m_freePair = pair.next

        pair.proxyId1 = proxyId1
        pair.proxyId2 = proxyId2
        pair.status = 0
        pair.userData = null
        pair.next = this.m_hashTable[hash]

        @m_hashTable[hash] = pIndex

        ++@m_pairCount

        return pair

    # Remove a pair, return the pair's userData.
    RemovePair: (proxyId1, proxyId2) ->
        if (proxyId1 > proxyId2)
            temp = proxyId1
            proxyId1 = proxyId2
            proxyId2 = temp

        hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask

        node = @m_hashTable[hash]
        pNode = null

        while (node != b2Pair.b2_nullPair)
            if (b2PairManager.Equals(@m_pairs[node], proxyId1, proxyId2))
                index = node
                if (pNode)
                	pNode.next = @m_pairs[node].next
                else
                	@m_hashTable[hash] = @m_pairs[node].next

                pair = @m_pairs[ index ]
                userData = pair.userData

                # Scrub
                pair.next = @m_freePair
                pair.proxyId1 = b2Pair.b2_nullProxy
                pair.proxyId2 = b2Pair.b2_nullProxy
                pair.userData = null
                pair.status = 0

                @m_freePair = index
                --@m_pairCount
                return userData
            else
                pNode = @m_pairs[node]
                node = pNode.next

        return null

    Find: (proxyId1, proxyId2) ->
        if (proxyId1 > proxyId2)
            temp = proxyId1
            proxyId1 = proxyId2
            proxyId2 = temp

        hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask

        return @FindHash(proxyId1, proxyId2, hash)

    FindHash: (proxyId1, proxyId2, hash) ->
        index = this.m_hashTable[hash]

        while index != b2Pair.b2_nullPair && b2PairManager.Equals(this.m_pairs[index], proxyId1, proxyId2) == false
        	index = this.m_pairs[index].next

        return null if index == b2Pair.b2_nullPair

        return this.m_pairs[ index ]
        
    Commit: () ->
        removeCount = 0

        proxies = @m_broadPhase.m_proxyPool

        for i in [0...@m_pairBufferCount]
            pair = @Find(@m_pairBuffer[i].proxyId1, @m_pairBuffer[i].proxyId2)
            pair.ClearBuffered()

            proxy1 = proxies[ pair.proxyId1 ]
            proxy2 = proxies[ pair.proxyId2 ]

            if pair.IsRemoved()
            	# It is possible a pair was added then removed before a commit. Therefore,
            	# we should be careful not to tell the user the pair was removed when the
            	# the user didn't receive a matching add.
            	@m_callback.PairRemoved(proxy1.userData, proxy2.userData, pair.userData) if pair.IsFinal() == true

            	# Store the ids so we can actually remove the pair below.
            	@m_pairBuffer[removeCount].proxyId1 = pair.proxyId1
            	@m_pairBuffer[removeCount].proxyId2 = pair.proxyId2
            	++removeCount
            else
            	if pair.IsFinal() == false
            		pair.userData = @m_callback.PairAdded(proxy1.userData, proxy2.userData)
            		pair.SetFinal()

        @RemovePair(@m_pairBuffer[i].proxyId1, @m_pairBuffer[i].proxyId2) for i in [0...removeCount]

        @m_pairBufferCount = 0

        @ValidateTable() if b2BroadPhase.s_validate


b2PairManager.Hash = (proxyId1, proxyId2) ->
    key = ((proxyId2 << 16) & 0xffff0000) | proxyId1
    key = ~key + ((key << 15) & 0xFFFF8000)
    key = key ^ ((key >> 12) & 0x000fffff)
    key = key + ((key << 2) & 0xFFFFFFFC)
    key = key ^ ((key >> 4) & 0x0fffffff)
    key = key * 2057
    key = key ^ ((key >> 16) & 0x0000ffff)
    return key

b2PairManager.Equals = (pair, proxyId1, proxyId2) -> return (pair.proxyId1 == proxyId1 && pair.proxyId2 == proxyId2)

b2PairManager.EqualsPair = (pair1, pair2) -> return pair1.proxyId1 == pair2.proxyId1 && pair1.proxyId2 == pair2.proxyId2
