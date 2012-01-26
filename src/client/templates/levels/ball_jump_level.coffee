view.level = 'ball_jump'
Peanutty.createEnvironment()

scale = 20 * (peanutty.canvas.width() / 835)
peanutty.screen.setScale(scale)
    
for groundInfo in [
    {width: 600, x: 300},
    {width: 800, x: 1300},
    {width: 400, x: 2200}
]
    peanutty.createGround
        x: groundInfo.x
        y: 150
        width: groundInfo.width
        height: 100

ball = peanutty.createBall
    x: 200
    y: 200
    radius: 20   

$(window).bind 'keydown', (e) =>
    switch e.keyCode
        when 75 #k - right
            ball.ApplyForce(new b2d.Common.Math.b2Vec2(200, 0), ball.GetWorldCenter()) if ball.GetContactList()?
        when 76 #l - up
            ball.ApplyForce(new b2d.Common.Math.b2Vec2(0, -300), ball.GetWorldCenter()) if ball.GetContactList()?
        else
            return

setInterval(
    (() => console.log(peanutty.screen.screenToCanvas(ball.GetPosition()).x, peanutty.screen.dimensions.width)),
    2000
)

input = $(document.createElement("input"))
input.css(position: 'absolute', top: -100, left: -100)
view.el.append(input)
input[0].focus()