scale = 30
canvas = view.$('#canvas')
scriptEditor = view.scriptEditor
stageEditor = view.stageEditor
environmentEditor = view.environmentEditor

window.peanutty = new Peanutty
    canvas: canvas
    scriptEditor: scriptEditor
    stageEditor: stageEditor
    environmentEditor: environmentEditor
    scale: scale
    gravity: new b2d.Common.Math.b2Vec2(0, 10)
    
peanutty.runSimulation()    

# TOOLS

static = false
unbindMouseEvents = (canvas) =>
    canvas.unbind 'mousedown'
    canvas.unbind 'mouseup'
    canvas.unbind 'mousemove'
    canvas.unbind 'click'

initiateFree = (canvas) =>
    unbindMouseEvents(canvas)
    canvas.bind 'click', (e) => 
        x = e.offsetX
        y = (peanutty.canvas.height() - e.offsetY)
        
        firstPoint = if peanutty.currentShape? then peanutty.currentShape.path[0] else null
        if firstPoint? && Math.abs(firstPoint.x - x) < 10 && Math.abs((peanutty.canvas.height() - firstPoint.y) - y) < 10
            peanutty.endFreeformShape
                static: static
                time: view.getTimeDiff()
            return
            
        peanutty.addToFreeformShape(x: x, y: y) 
            
        return
                               
    canvas.bind 'mousemove', (e) =>
        peanutty.addTempToFreeformShape
            x: e.offsetX
            y: e.offsetY
        return

initiateBox = (canvas) =>
    unbindMouseEvents(canvas)
    canvas.bind 'click', (e) =>
        peanutty.addToScript
            command:
                """
                peanutty.createBox
                    x: #{e.offsetX * (peanutty.defaultScale / peanutty.scale)}
                    y: #{(peanutty.world.dimensions.height - (e.offsetY * (peanutty.defaultScale / peanutty.scale)))}
                    width: 20
                    height: 20
                    static: #{static}
                """
            time: view.getTimeDiff()

initiateBall = (canvas) =>
    unbindMouseEvents(canvas)
    canvas.bind 'click', (e) =>     
        peanutty.addToScript
            command: 
                """
                peanutty.createBall
                    x: #{e.offsetX * (peanutty.defaultScale / peanutty.scale)}
                    y: #{(peanutty.world.dimensions.height - (e.offsetY * (peanutty.defaultScale / peanutty.scale)))}
                    radius: 20
                    static: #{static}
                """
            time: view.getTimeDiff()
    
view.getTimeDiff = () =>
    timeDiff = if view.time? then new Date() - view.time else 0
    view.time = new Date() 
    return timeDiff

view.$('#tools #free').bind 'click', () => 
    $('#tools .tool').removeClass('selected')
    $('#tools #free').addClass('selected')
    initiateFree(canvas)
view.$('#tools #box').bind 'click', () => 
    $('#tools .tool').removeClass('selected')
    $('#tools #box').addClass('selected')
    initiateBox(canvas)
view.$('#tools #ball').bind 'click', () => 
    $('#tools .tool').removeClass('selected')
    $('#tools #ball').addClass('selected')
    initiateBall(canvas)
view.$('#tools #static').bind 'click', () => 
    $('#tools .setting').removeClass('selected')
    $('#tools #static').addClass('selected')
    static = true
view.$('#tools #dynamic').bind 'click', () => 
    $('#tools .setting').removeClass('selected')
    $('#tools #dynamic').addClass('selected')
    static = false

view.$('#tools #ball').click()
view.$('#tools #dynamic').click()