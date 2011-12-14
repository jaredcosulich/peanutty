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


exports.b2Math = b2Math = class b2Math

b2Math.b2IsValid = (x) -> isFinite(x)

b2Math.b2Dot = (a, b) -> a.x * b.x + a.y * b.y

b2Math.b2CrossVV = (a, b) -> a.x * b.y - a.y * b.x

b2Math.b2CrossVF = (a, s) -> new b2Vec2(s * a.y, -s * a.x)

b2Math.b2CrossFV = (s, a) -> new b2Vec2(-s * a.y, s * a.x)

b2Math.b2MulMV = (A, v) -> new b2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y)

b2Math.b2MulTMV = (A, v) -> new b2Vec2(b2Math.b2Dot(v, A.col1), b2Math.b2Dot(v, A.col2))

b2Math.AddVV = (a, b) -> new b2Vec2(a.x + b.x, a.y + b.y)

b2Math.SubtractVV = (a, b) -> new b2Vec2(a.x - b.x, a.y - b.y)

b2Math.MulFV = (s, a) -> new b2Vec2(s * a.x, s * a.y)

b2Math.AddMM = (A, B) -> new b2Mat22(0, b2Math.AddVV(A.col1, B.col1), b2Math.AddVV(A.col2, B.col2))

b2Math.b2MulMM = (A, B) -> new b2Mat22(0, b2Math.b2MulMV(A, B.col1), b2Math.b2MulMV(A, B.col2))

b2Math.b2MulTMM = (A, B) ->
    c1 = new b2Vec2(b2Math.b2Dot(A.col1, B.col1), b2Math.b2Dot(A.col2, B.col1))
    c2 = new b2Vec2(b2Math.b2Dot(A.col1, B.col2), b2Math.b2Dot(A.col2, B.col2))
    return new b2Mat22(0, c1, c2);

b2Math.b2Abs = (a) -> if a > 0.0 then a else -a

b2Math.b2AbsV = (a) -> new b2Vec2(b2Math.b2Abs(a.x), b2Math.b2Abs(a.y))

b2Math.b2AbsM = (A) -> new b2Mat22(0, b2Math.b2AbsV(A.col1), b2Math.b2AbsV(A.col2))

b2Math.b2Min = (a, b) -> if a < b then a else b

b2Math.b2MinV = (a, b) -> new b2Vec2(b2Math.b2Min(a.x, b.x), b2Math.b2Min(a.y, b.y))

b2Math.b2Max = (a, b) -> if a > b then a else b

b2Math.b2MaxV = (a, b) -> new b2Vec2(b2Math.b2Max(a.x, b.x), b2Math.b2Max(a.y, b.y))

b2Math.b2Clamp = (a, low, high) -> b2Math.b2Max(low, b2Math.b2Min(a, high))
	
b2Math.b2ClampV = (a, low, high) -> b2Math.b2MaxV(low, b2Math.b2MinV(a, high))

b2Math.b2Swap = (a, b) ->
    tmp = a[0]
    a[0] = b[0]
    b[0] = tmp

b2Math.b2Random = () -> Math.random() * 2 - 1

b2Math.b2NextPowerOfTwo = (x) ->
	x |= (x >> 1) & 0x7FFFFFFF
	x |= (x >> 2) & 0x3FFFFFFF
	x |= (x >> 4) & 0x0FFFFFFF
	x |= (x >> 8) & 0x00FFFFFF
	x |= (x >> 16)& 0x0000FFFF
	return x + 1

b2Math.b2IsPowerOfTwo = (x) -> (x > 0 && (x & (x - 1)) == 0)

b2Math.tempVec2 = new b2Vec2()
b2Math.tempVec3 = new b2Vec2()
b2Math.tempVec4 = new b2Vec2()
b2Math.tempVec5 = new b2Vec2()
b2Math.tempMat = new b2Mat22()