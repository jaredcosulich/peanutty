Peanutty.loadLevel()
peanutty.wait(1000)

# Adjust gravity!
peanutty.world.SetGravity(new b2d.Common.Math.b2Vec2(0,-0.1))

# Strike the ball!
level.pullBackStriker()

peanutty.wait(1000)
level.releaseStriker()

