Peanutty.createEnvironment()

view.setUpChallenge = (scale=30) =>
    peanutty.destroyWorld()
    peanutty.setScale(scale)
    
    peanutty.createAchievementStar
        x: peanutty.canvas.width() / 2
        y: 100
        totalPoints: if (12 * scale / 30) > 8 then (12 * scale / 30) else 8 
        radius: 16 * scale / 30

    peanutty.createGround
        x: peanutty.world.dimensions.width / 2
        y: 50
        width: 600
        height: 10
    
    peanutty.createBall
        x: peanutty.world.dimensions.width / 2
        y: 75
        radius: 20   
    
    peanutty.createBox
        x: peanutty.world.dimensions.width / 2
        y: 100
        width: 150
        height: 5
    
    peanutty.createBox
        x: peanutty.world.dimensions.width / 2
        y: 140
        width: 20
        height: 20

    peanutty.createBox
        x: peanutty.world.dimensions.width / 2
        y: 200
        width: 20
        height: 20

view.setUpChallenge()

    
instructions = $(document.createElement("DIV"))
instructions.css
    width: "#{peanutty.canvas.width()}px"
    textAlign: 'center'
    position: 'absolute'
    top: '20px'
    left: 0

header = $(document.createElement("DIV"))
header.addClass('level_element')
header.css
    height: '30px'
    fontSize: '20pt'
header.html("Build a stable tower that reaches the star.")
instructions.append(header)

level = $(document.createElement("DIV"))
level.addClass('level_element')
level.css
    height: '20px'
    fontSize: '12pt'
level.html("(<a id='level_30'>easy</a> | <a id='level_20'>medium</a> | <a id='level_10'>hard</a>)")
instructions.append(level)

view.$('#canvas_container').append(instructions)

for level in [10,20,30]
    do (level) ->
        view.$("#level_#{level}").bind 'click', () -> 
            peanutty.addToScript
                command: "view.setUpChallenge(#{level})"
                time: 0

view.$('#tools #box').click()