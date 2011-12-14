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




# @ broad phase uses the Sweep and Prune algorithm in:
# Collision Detection in Interactive 3D Environments by Gino van den Bergen
# Also, some ideas, such integral values for fast compares comes from
# Bullet (http:/www.bulletphysics.com).


# Notes:
# - we use bound arrays instead of linked lists for cache coherence.
# - we use quantized integral values for fast compares.
# - we use short indices rather than pointers to save memory.
# - we use a stabbing count for fast overlap queries (less than order N).
# - we also use a time stamp on each proxy to speed up the registration of
#   overlap query results.
# - where possible, we compare bound indices instead of values to reduce
#   cache misses (TODO_ERIN).
# - no broadphase is perfect and neither is @ one: it is not great for huge
#   worlds (use a multi-SAP instead), it is not great for large objects.


exports.b2BroadPhase = b2BroadPhase = class b2BroadPhase
    constructor: (worldAABB, callback) ->
        @m_pairManager = new b2PairManager()
        @m_proxyPool = new Array(b2Settings.b2_maxPairs)
        @m_bounds = new Array(2*b2Settings.b2_maxProxies)
        @m_queryResults = new Array(b2Settings.b2_maxProxies)
        @m_quantizationFactor = new b2Vec2()

        @m_pairManager.Initialize(@, callback)

        @m_worldAABB = worldAABB

        @m_proxyCount = 0

        # query results
        @m_queryResults[i] = 0 for i in [0...b2Settings.b2_maxProxies]

        # bounds array
        @m_bounds = new Array(2)
        for i in [0...2]
        	@m_bounds[i] = new Array(2 * b2Settings.b2_maxProxies)
        	@m_bounds[i][j] = new b2Bound() for j in [0...(2 * b2Settings.b2_maxProxies)]

        dX = worldAABB.maxVertex.x
        dY = worldAABB.maxVertex.y
        dX -= worldAABB.minVertex.x
        dY -= worldAABB.minVertex.y

        @m_quantizationFactor.x = b2Settings.USHRT_MAX / dX
        @m_quantizationFactor.y = b2Settings.USHRT_MAX / dY

        for i in [0...b2Settings.b2_maxProxies - 1]
        	tProxy = new b2Proxy()
        	@m_proxyPool[i] = tProxy
        	tProxy.SetNext(i + 1)
        	tProxy.timeStamp = 0
        	tProxy.overlapCount = b2BroadPhase.b2_invalid
        	tProxy.userData = null

        tProxy = new b2Proxy()
        @m_proxyPool[b2Settings.b2_maxProxies-1] = tProxy
        tProxy.SetNext(b2Pair.b2_nullProxy)
        tProxy.timeStamp = 0
        tProxy.overlapCount = b2BroadPhase.b2_invalid
        tProxy.userData = null
        @m_freeProxy = 0

        @m_timeStamp = 1
        @m_queryResultCount = 0

    # Use this to see if your proxy is in range. If it is not in range,
    # it should be destroyed. Otherwise you may get O(m^2) pairs, where m
    # is the number of proxies that are out of range.
    InRange: (aabb) ->
        dX = aabb.minVertex.x
        dY = aabb.minVertex.y
        dX -= @m_worldAABB.maxVertex.x
        dY -= @m_worldAABB.maxVertex.y

        d2X = @m_worldAABB.minVertex.x
        d2Y = @m_worldAABB.minVertex.y
        d2X -= aabb.maxVertex.x
        d2Y -= aabb.maxVertex.y

        dX = b2Math.b2Max(dX, d2X)
        dY = b2Math.b2Max(dY, d2Y)

        return b2Math.b2Max(dX, dY) < 0.0
        
    # Get a single proxy. Returns NULL if the id is invalid.
    GetProxy: (proxyId) ->
        rerturn null if (proxyId == b2Pair.b2_nullProxy || this.m_proxyPool[proxyId].IsValid() == false)
        return @m_proxyPool[ proxyId ]

    # Create and destroy proxies. These call Flush first.
    CreateProxy: (aabb, userData) ->
        proxyId = @m_freeProxy
        proxy = @m_proxyPool[ proxyId ]
        @m_freeProxy = proxy.GetNext()

        proxy.overlapCount = 0
        proxy.userData = userData

        boundCount = 2 * @m_proxyCount

        lowerValues = new Array()
        upperValues = new Array()
        @ComputeBounds(lowerValues, upperValues, aabb)

        for axis in [0...2]
        	bounds = @m_bounds[axis]
        	lowerIndex = 0
        	upperIndex = 0
        	lowerIndexOut = [lowerIndex]
        	upperIndexOut = [upperIndex]
        	@Query(lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis)
        	lowerIndex = lowerIndexOut[0]
        	upperIndex = upperIndexOut[0]

        	# Replace memmove calls
        	tArr = new Array()
        	tEnd = boundCount - upperIndex
        	# make temp array
        	for j in [0...tEnd]
        		tArr[j] = new b2Bound()
        		tBound1 = tArr[j]
        		tBound2 = bounds[upperIndex+j]
        		tBound1.value = tBound2.value
        		tBound1.proxyId = tBound2.proxyId
        		tBound1.stabbingCount = tBound2.stabbingCount
        	
        	# move temp array back in to bounds
        	tEnd = tArr.length
        	tIndex = upperIndex+2
        	for j in [0...tEnd]
        		tBound2 = tArr[j]
        		tBound1 = bounds[tIndex+j]
        		tBound1.value = tBound2.value
        		tBound1.proxyId = tBound2.proxyId
        		tBound1.stabbingCount = tBound2.stabbingCount

        	# make temp array
        	tArr = new Array()
        	tEnd = upperIndex - lowerIndex
        	for j in [0...tEnd]
        		tArr[j] = new b2Bound()
        		tBound1 = tArr[j]
        		tBound2 = bounds[lowerIndex+j]
        		tBound1.value = tBound2.value
        		tBound1.proxyId = tBound2.proxyId
        		tBound1.stabbingCount = tBound2.stabbingCount

        	# move temp array back in to bounds
        	tEnd = tArr.length
        	tIndex = lowerIndex+1
        	for j in [0...tEnd]
        		tBound2 = tArr[j]
        		tBound1 = bounds[tIndex+j]
        		tBound1.value = tBound2.value
        		tBound1.proxyId = tBound2.proxyId
        		tBound1.stabbingCount = tBound2.stabbingCount

        	# The upper index has increased because of the lower bound insertion.
        	++upperIndex

        	# Copy in the new bounds.
        	bounds[lowerIndex].value = lowerValues[axis]
        	bounds[lowerIndex].proxyId = proxyId
        	bounds[upperIndex].value = upperValues[axis]
        	bounds[upperIndex].proxyId = proxyId

        	bounds[lowerIndex].stabbingCount = if lowerIndex == 0 then 0 else bounds[lowerIndex-1].stabbingCount
        	bounds[upperIndex].stabbingCount = bounds[upperIndex-1].stabbingCount

        	# Adjust the stabbing count between the new bounds.
        	index = lowerIndex
        	while index < upperIndex
        	    bounds[index].stabbingCount++
        	    ++index

        	# Adjust the all the affected bound indices.
        	index = lowerIndex
        	while index < boundCount + 2
        		proxy2 = @m_proxyPool[ bounds[index].proxyId ]
        		if (bounds[index].IsLower())
        			proxy2.lowerBounds[axis] = index
        		else
        			proxy2.upperBounds[axis] = index
        		++index

        ++@m_proxyCount

        for i in [0...@m_queryResultCount]
        	@m_pairManager.AddBufferedPair(proxyId, @m_queryResults[i])

        @m_pairManager.Commit()

        # Prepare for next query.
        @m_queryResultCount = 0
        @IncrementTimeStamp()

        return proxyId
 
 
    DestroyProxy: (proxyId) ->
        proxy = @m_proxyPool[ proxyId ]
        boundCount = 2 * @m_proxyCount

        for axis in [0...2]
            bounds = @m_bounds[axis]

            lowerIndex = proxy.lowerBounds[axis]
            upperIndex = proxy.upperBounds[axis]
            lowerValue = bounds[lowerIndex].value
            upperValue = bounds[upperIndex].value

            # replace memmove calls
            tArr = new Array()
            j = 0
            tEnd = upperIndex - lowerIndex - 1
            tBound1
            tBound2

            # make temp array
            for j in [0...tEnd]
                tArr[j] = new b2Bound()
                tBound1 = tArr[j]
                tBound2 = bounds[lowerIndex+1+j]
                tBound1.value = tBound2.value
                tBound1.proxyId = tBound2.proxyId
                tBound1.stabbingCount = tBound2.stabbingCount

            # move temp array back in to bounds
            tEnd = tArr.length
            tIndex = lowerIndex
            for j in [0...tEnd]
                #bounds[tIndex+j] = tArr[j]
                tBound2 = tArr[j]
                tBound1 = bounds[tIndex+j]
                tBound1.value = tBound2.value
                tBound1.proxyId = tBound2.proxyId
                tBound1.stabbingCount = tBound2.stabbingCount

            # make temp array
            tArr = new Array()
            tEnd = boundCount - upperIndex - 1
            for j in [0...tEnd]
                tArr[j] = new b2Bound()
                tBound1 = tArr[j]
                tBound2 = bounds[upperIndex+1+j]
                tBound1.value = tBound2.value
                tBound1.proxyId = tBound2.proxyId
                tBound1.stabbingCount = tBound2.stabbingCount

            # move temp array back in to bounds
            tEnd = tArr.length
            tIndex = upperIndex-1
            for j in [0...tEnd]
                tBound2 = tArr[j]
                tBound1 = bounds[tIndex+j]
                tBound1.value = tBound2.value
                tBound1.proxyId = tBound2.proxyId
                tBound1.stabbingCount = tBound2.stabbingCount

            # Fix bound indices.
            tEnd = boundCount - 2
            index = lowerIndex
            while index < tEnd
                proxy2 = @m_proxyPool[ bounds[index].proxyId ]
                if (bounds[index].IsLower())
                    proxy2.lowerBounds[axis] = index
                else
                    proxy2.upperBounds[axis] = index
                ++index

            # Fix stabbing count.
            tEnd = upperIndex - 1
            index2 = lowerIndex
            while index2 < tEnd 
                bounds[index2].stabbingCount--
                ++index2

            # @Query for pairs to be removed. lowerIndex and upperIndex are not needed.
            # make lowerIndex and upper output using an array and do @ for others if compiler doesn't pick them up
            @Query([0], [0], lowerValue, upperValue, bounds, boundCount - 2, axis)

        @m_pairManager.RemoveBufferedPair(proxyId, @m_queryResults[i]) for i in [0...@m_queryResultCount]

        @m_pairManager.Commit()

        # Prepare for next query.
        @m_queryResultCount = 0
        @IncrementTimeStamp()

        # Return the proxy to the pool.
        proxy.userData = null
        proxy.overlapCount = b2BroadPhase.b2_invalid
        proxy.lowerBounds[0] = b2BroadPhase.b2_invalid
        proxy.lowerBounds[1] = b2BroadPhase.b2_invalid
        proxy.upperBounds[0] = b2BroadPhase.b2_invalid
        proxy.upperBounds[1] = b2BroadPhase.b2_invalid

        proxy.SetNext(@m_freeProxy)
        @m_freeProxy = proxyId
        --@m_proxyCount
 
        
    # Call @MoveProxy times like, then when you are done
    # call @Commit to finalized the proxy pairs (for your time step).
    MoveProxy: (proxyId, aabb) ->
        axis = 0
        index = 0
        nextProxyId = 0

        return if (proxyId == b2Pair.b2_nullProxy || b2Settings.b2_maxProxies <= proxyId)

        return if (aabb.IsValid() == false)

        boundCount = 2 * @m_proxyCount

        proxy = @m_proxyPool[ proxyId ]
        # Get new bound values
        newValues = new b2BoundValues()
        @ComputeBounds(newValues.lowerValues, newValues.upperValues, aabb)

        # Get old bound values
        oldValues = new b2BoundValues()
        for axis in [0...2]
            oldValues.lowerValues[axis] = @m_bounds[axis][proxy.lowerBounds[axis]].value
            oldValues.upperValues[axis] = @m_bounds[axis][proxy.upperBounds[axis]].value

        for axis in [0...2]
            bounds = @m_bounds[axis]

            lowerIndex = proxy.lowerBounds[axis]
            upperIndex = proxy.upperBounds[axis]

            lowerValue = newValues.lowerValues[axis]
            upperValue = newValues.upperValues[axis]

            deltaLower = lowerValue - bounds[lowerIndex].value
            deltaUpper = upperValue - bounds[upperIndex].value

            bounds[lowerIndex].value = lowerValue
            bounds[upperIndex].value = upperValue

            # Expanding adds overlaps

            # Should we move the lower bound down?
            if (deltaLower < 0)
                index = lowerIndex
                while (index > 0 && lowerValue < bounds[index-1].value)
                    bound = bounds[index]
                    prevBound = bounds[index - 1]

                    prevProxyId = prevBound.proxyId
                    prevProxy = @m_proxyPool[ prevBound.proxyId ]

                    prevBound.stabbingCount++

                    if (prevBound.IsUpper() == true)
                        if (@TestOverlap(newValues, prevProxy))
                            @m_pairManager.AddBufferedPair(proxyId, prevProxyId)

                        prevProxy.upperBounds[axis]++
                        bound.stabbingCount++
                    else
                        prevProxy.lowerBounds[axis]++
                        bound.stabbingCount--

                    proxy.lowerBounds[axis]--

                    # swap
                    bound.Swap(prevBound)
                    --index

            # Should we move the upper bound up?
            if (deltaUpper > 0)
                index = upperIndex
                while (index < boundCount-1 && bounds[index+1].value <= upperValue)
                    bound = bounds[ index ]
                    nextBound = bounds[ index + 1 ]
                    nextProxyId = nextBound.proxyId
                    nextProxy = @m_proxyPool[ nextProxyId ]

                    nextBound.stabbingCount++

                    if (nextBound.IsLower() == true)
                        if (@TestOverlap(newValues, nextProxy))
                            @m_pairManager.AddBufferedPair(proxyId, nextProxyId)

                        nextProxy.lowerBounds[axis]--
                        bound.stabbingCount++
                    else
                        nextProxy.upperBounds[axis]--
                        bound.stabbingCount--

                    proxy.upperBounds[axis]++
                    # swap
                    bound.Swap(nextBound)
                    index++

            #
            # Shrinking removes overlaps
            #

            # Should we move the lower bound up?
            if (deltaLower > 0)
                index = lowerIndex
                while (index < boundCount-1 && bounds[index+1].value <= lowerValue)
                    bound = bounds[ index ]
                    nextBound = bounds[ index + 1 ]

                    nextProxyId = nextBound.proxyId
                    nextProxy = @m_proxyPool[ nextProxyId ]

                    nextBound.stabbingCount--

                    if (nextBound.IsUpper())
                        if (@TestOverlap(oldValues, nextProxy))
                            @m_pairManager.RemoveBufferedPair(proxyId, nextProxyId)

                        nextProxy.upperBounds[axis]--
                        bound.stabbingCount--
                    else
                        nextProxy.lowerBounds[axis]--
                        bound.stabbingCount++

                    proxy.lowerBounds[axis]++
                    # swap
                    bound.Swap(nextBound)
                    index++

            # Should we move the upper bound down?
            if (deltaUpper < 0)
                index = upperIndex
                while (index > 0 && upperValue < bounds[index-1].value)
                    bound = bounds[index]
                    prevBound = bounds[index - 1]

                    prevProxyId = prevBound.proxyId
                    prevProxy = @m_proxyPool[ prevProxyId ]

                    prevBound.stabbingCount--

                    if (prevBound.IsLower() == true)
                        if (@TestOverlap(oldValues, prevProxy))
                            @m_pairManager.RemoveBufferedPair(proxyId, prevProxyId)

                        prevProxy.lowerBounds[axis]++
                        bound.stabbingCount--
                    else
                        prevProxy.upperBounds[axis]++
                        bound.stabbingCount++

                    proxy.upperBounds[axis]--
                    # swap
                    bound.Swap(prevBound)
                    index--
        

    
    Commit: () -> @m_pairManager.Commit()

    ComputeBounds: (lowerValues, upperValues, aabb) ->
        minVertexX = aabb.minVertex.x
        minVertexY = aabb.minVertex.y
        minVertexX = b2Math.b2Min(minVertexX, @m_worldAABB.maxVertex.x)
        minVertexY = b2Math.b2Min(minVertexY, @m_worldAABB.maxVertex.y)
        minVertexX = b2Math.b2Max(minVertexX, @m_worldAABB.minVertex.x)
        minVertexY = b2Math.b2Max(minVertexY, @m_worldAABB.minVertex.y)

        maxVertexX = aabb.maxVertex.x
        maxVertexY = aabb.maxVertex.y
        maxVertexX = b2Math.b2Min(maxVertexX, @m_worldAABB.maxVertex.x)
        maxVertexY = b2Math.b2Min(maxVertexY, @m_worldAABB.maxVertex.y)
        maxVertexX = b2Math.b2Max(maxVertexX, @m_worldAABB.minVertex.x)
        maxVertexY = b2Math.b2Max(maxVertexY, @m_worldAABB.minVertex.y)

        # Bump lower bounds downs and upper bounds up. This ensures correct sorting of
        # lower/upper bounds that would have equal values.
        # TODO_ERIN implement fast float to uint16 conversion.
        lowerValues[0] = (@m_quantizationFactor.x * (minVertexX - @m_worldAABB.minVertex.x)) & (b2Settings.USHRT_MAX - 1)
        upperValues[0] = ((@m_quantizationFactor.x * (maxVertexX - @m_worldAABB.minVertex.x))& 0x0000ffff) | 1

        lowerValues[1] = (@m_quantizationFactor.y * (minVertexY - @m_worldAABB.minVertex.y)) & (b2Settings.USHRT_MAX - 1)
        upperValues[1] = ((@m_quantizationFactor.y * (maxVertexY - @m_worldAABB.minVertex.y))& 0x0000ffff) | 1

    # This one is only used for validation.
    TestOverlapValidate: (p1, p2) ->
        for axis in [0...2]
            bounds = @m_bounds[axis]
            return false if (bounds[p1.lowerBounds[axis]].value > bounds[p2.upperBounds[axis]].value)
            return false if (bounds[p1.upperBounds[axis]].value < bounds[p2.lowerBounds[axis]].value)

        return true

    TestOverlap: (b, p) ->
        for axis in [0...2]
            bounds = @m_bounds[axis]
            return false if (b.lowerValues[axis] > bounds[p.upperBounds[axis]].value)
            return false if (b.upperValues[axis] < bounds[p.lowerBounds[axis]].value)

        return true

    Query: (lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis) ->
        lowerQuery = b2BroadPhase.BinarySearch(bounds, boundCount, lowerValue)
        upperQuery = b2BroadPhase.BinarySearch(bounds, boundCount, upperValue)

        # Easy case: lowerQuery <= lowerIndex(i) < upperQuery
        # Solution: search query range for min bounds.
        j = lowerQuery
        while j < upperQuery
            @IncrementOverlapCount(bounds[j].proxyId) if (bounds[j].IsLower())
            ++j

        # Hard case: lowerIndex(i) < lowerQuery < upperIndex(i)
        # Solution: use the stabbing count to search down the bound array.
        if (lowerQuery > 0)
            i = lowerQuery - 1
            s = bounds[i].stabbingCount

            # Find the s overlaps.
            while (s)
                if (bounds[i].IsLower())
                    proxy = @m_proxyPool[ bounds[i].proxyId ]
                    if (lowerQuery <= proxy.upperBounds[axis])
                        @IncrementOverlapCount(bounds[i].proxyId)
                        --s
                --i

        lowerQueryOut[0] = lowerQuery
        upperQueryOut[0] = upperQuery


    IncrementOverlapCount: (proxyId) ->
        proxy = this.m_proxyPool[ proxyId ]
        if (proxy.timeStamp < this.m_timeStamp)
            proxy.timeStamp = this.m_timeStamp
            proxy.overlapCount = 1
        else
            proxy.overlapCount = 2
            this.m_queryResults[this.m_queryResultCount] = proxyId
            ++this.m_queryResultCount


    IncrementTimeStamp: () ->
        if (this.m_timeStamp == b2Settings.USHRT_MAX)
            for i in [0...b2Settings.b2_maxProxies]
            	this.m_proxyPool[i].timeStamp = 0
            this.m_timeStamp = 1
        else
        	++this.m_timeStamp



b2BroadPhase.s_validate = false
b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX
b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX
b2BroadPhase.BinarySearch = (bounds, count, value) ->
		low = 0
		high = count - 1
		while low <= high
			mid = Math.floor((low + high) / 2)
			if bounds[mid].value > value
				high = mid - 1
			else if (bounds[mid].value < value)
				low = mid + 1
			else
				return (mid)
		return (low)
