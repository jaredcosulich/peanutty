(($) ->
    views = require('views')
    b2d = require("coffeebox2d")
    
    class views.Home extends views.BaseView
        prepare: () ->
            @template = @_requireTemplate('templates/home.html')
    
        renderView: () ->
            @el.html(@template.render())
            
            drawWorld = (world, context) ->
                j = world.m_jointList
                while j?
                    drawJoint(j, context)
                    j = j.m_next
                
                b = world.m_bodyList
                while b?
                    s = b.GetShapeList()
                    while s
                        drawShape(s, context)
                        s = s.GetNext()
                    b = b.m_next
                    
            drawShape = (shape, context) ->
                context.strokeStyle = '#ffffff'
                if shape.density == 1.0
                    context.fillStyle = "red"
                else
                    context.fillStyle = "black"
        
                context.beginPath()
                switch shape.m_type
                    when b2d.b2Shape.e_circleShape
                        circle = shape
                        pos = circle.m_position
                        r = circle.m_radius
                        segments = 16.0
                        theta = 0.0
                        dtheta = 2.0 * Math.PI / segments

                        # draw circle
                        context.moveTo(pos.x + r, pos.y)
                        for i in [0...segments]
                            d = new b2d.b2Vec2(r * Math.cos(theta), r * Math.sin(theta))
                            v = b2d.b2Math.AddVV(pos, d)
                            context.lineTo(v.x, v.y)
                            theta += dtheta
                    
                        context.lineTo(pos.x + r, pos.y)

                        # draw radius
                        context.moveTo(pos.x, pos.y)
                        ax = circle.m_R.col1
                        pos2 = new b2d.b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y)
                        context.lineTo(pos2.x, pos2.y)

                    when b2d.b2Shape.e_polyShape
                        poly = shape
                        tV = b2d.b2Math.AddVV(poly.m_position, b2d.b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]))
                        context.moveTo(tV.x, tV.y)
                        console.log("MOVE", tV.x, tV.y)
                        for i in [0...poly.m_vertexCount]
                            v = b2d.b2Math.AddVV(poly.m_position, b2d.b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]))
                            console.log("LINE", v.x, v.y)
                            context.lineTo(v.x, v.y)
                        console.log("LINE", tV.x, tV.y)
                        context.lineTo(tV.x, tV.y)                     

                context.fill()
                context.stroke()
                return                  
                

            createGround = (world) ->
                groundSd = new b2d.b2BoxDef()
                groundSd.extents.Set(400, 30)
                groundSd.restitution = 0.0
                groundBd = new b2d.b2BodyDef()
                groundBd.AddShape(groundSd)
                groundBd.position.Set(400, 470)
                body = world.CreateBody(groundBd)
                return body
            
            createWorld = () ->
                worldAABB = new b2d.b2AABB()
                worldAABB.maxVertex.Set(-1000, -1000)
                worldAABB.minVertex.Set(1000, 1000)
                gravity = new b2d.b2Vec2(0, 300)
                doSleep = true
                world = new b2d.b2World(worldAABB, gravity, doSleep)
                createGround(world)
                return world
              
            createHelloWorld = () ->
                #H
                createBox(world, 50, 420, 10, 20, false)
                createBox(world, 90, 420, 10, 20, false)
                createBox(world, 70, 395, 30, 5, false)
                createBox(world, 50, 370, 10, 20, false)
                createBox(world, 90, 370, 10, 20, false)
                        
                #E
                createBox(world, 140, 435, 30, 5, false)
                createBox(world, 120, 420, 10, 10, false)
                createBox(world, 130, 405, 20, 5, false)
                createBox(world, 120, 390, 10, 10, false)
                createBox(world, 140, 375, 30, 5, true)
                      
                #L
                createBox(world, 200, 435, 20, 5, false)
                createBox(world, 185, 400, 5, 30, false)
                      
                #L
                createBox(world, 250, 435, 20, 5, false)
                createBox(world, 235, 400, 5, 30, false)
                      
                #O
                createBox(world, 300, 435, 20, 5, false)
                createBox(world, 285, 405, 5, 25, false)
                createBox(world, 315, 405, 5, 25, false)
                createBox(world, 300, 375, 20, 5, false)
                      
                #W
                createBox(world, 390, 435, 40, 5, false)
                createBox(world, 360, 390, 10, 40, false)
                createBox(world, 420, 390, 10, 40, false)
                createBox(world, 390, 415, 5, 15, false)
                      
                #O
                createBox(world, 460, 435, 20, 5, false)
                createBox(world, 445, 405, 5, 25, false)
                createBox(world, 475, 405, 5, 25, false)
                createBox(world, 460, 375, 20, 5, false)
                      
                #R
                createBox(world, 495, 410, 5, 30, false)
                createBox(world, 518, 425, 5, 15, false)
                createBox(world, 515, 405, 15, 5, false)
                createBox(world, 525, 390, 5, 10, false)
                createBox(world, 510, 375, 20, 5, false)
                      
                #L
                createBox(world, 560, 435, 20, 5, false)
                createBox(world, 545, 400, 5, 30, false)
                      
                #D
                createBox(world, 610, 435, 20, 5, false)
                createBox(world, 595, 405, 5, 25, false)
                createBox(world, 625, 405, 5, 25, false)
                createBox(world, 610, 375, 20, 5, false)
                      
                #!
                createBox(world, 650, 430, 10, 10, false)
                createBox(world, 650, 380, 10, 40, false)
              
                      
            createBox = (world, x, y, width, height, fixed=true) ->
                boxSd = new b2d.b2BoxDef()
                boxSd.density = 1.0 if (!fixed)
                boxSd.restitution = 0.0
                boxSd.friction = 1.0
                boxSd.extents.Set(width, height)
                boxBd = new b2d.b2BodyDef()
                boxBd.AddShape(boxSd)
                boxBd.position.Set(x,y)
                world.CreateBody(boxBd)
                
                      
            step = (cnt) ->
                stepping = false
                timeStep = 1.0/60
                iteration = 1
                world.Step(timeStep, iteration)
                ctx.clearRect(0, 0, canvasWidth, canvasHeight)
                drawWorld(world, ctx)
                setTimeout 10, () => step(cnt || 0)
                       
            world = createWorld()
            ctx = $('#canvas')[0].getContext('2d')
            ctx.scale(0.3, 0.3)
            canvasElm = $('#canvas')
            canvasWidth = parseInt(canvasElm.width())
            canvasHeight = parseInt(canvasElm.height())
            canvasTop = parseInt(canvasElm.css('top'))
            canvasLeft = parseInt(canvasElm.css('left'))
            
            createHelloWorld()
            
            # Event.observe('canvas', 'click', (e) ->
            #       if (Math.random() > 0.5) {
            #           //createBox(world, Event.pointerX(e), Event.pointerY(e), 10, 10, false)
            #           createBox(world, e.clientX, e.clientY, 10, 10, false)
            #       } else {
            #           createBall(world, Event.pointerX(e), Event.pointerY(e))
            #       }
            
            step()  
                         
            # function drawWorld(world, context) {
            #   for (var j = ; j; j = j.m_next) {
            #       drawJoint(j, context);
            #   }
            #   for (var b = world.m_bodyList; b; b = b.m_next) {
            #       for (var s = b.GetShapeList(); s != null; ) {
            #           drawShape(s, context);
            #       }
            #   }       
            # }
            # 
            # function drawJoint(joint, context) {
            #   var b1 = joint.m_body1;
            #   var b2 = joint.m_body2;
            #   var x1 = b1.m_position;
            #   var x2 = b2.m_position;
            #   var p1 = joint.GetAnchor1();
            #   var p2 = joint.GetAnchor2();
            #   context.strokeStyle = '#00eeee';
            #   context.beginPath();
            #   switch (joint.m_type) {
            #   case b2Joint.e_distanceJoint:
            #       context.moveTo(p1.x, p1.y);
            #       context.lineTo(p2.x, p2.y);
            #       break;
            # 
            #   case b2Joint.e_pulleyJoint:
            #       // TODO
            #       break;
            # 
            #   default:
            #       if (b1 == world.m_groundBody) {
            #           context.moveTo(p1.x, p1.y);
            #           context.lineTo(x2.x, x2.y);
            #       }
            #       else if (b2 == world.m_groundBody) {
            #           context.moveTo(p1.x, p1.y);
            #           context.lineTo(x1.x, x1.y);
            #       }
            #       else {
            #           context.moveTo(x1.x, x1.y);
            #           context.lineTo(p1.x, p1.y);
            #           context.lineTo(x2.x, x2.y);
            #           context.lineTo(p2.x, p2.y);
            #       }
            #       break;
            #   }
            #   context.stroke();
            # }
            # 
            # function drawShape(shape, context) {
            #   context.strokeStyle = '#ffffff';
            #   if (shape.density == 1.0) {
            #       context.fillStyle = "red";
            #   } else {
            #       context.fillStyle = "black";
            #   }
            #   context.beginPath();
            #   switch (shape.m_type) {
            #   case b2Shape.e_circleShape:
            #       {
            #           var circle = shape;
            #           var pos = circle.m_position;
            #           var r = circle.m_radius;
            #           var segments = 16.0;
            #           var theta = 0.0;
            #           var dtheta = 2.0 * Math.PI / segments;
            # 
            #           // draw circle
            #           context.moveTo(pos.x + r, pos.y);
            #           for (var i = 0; i < segments; i++) {
            #               var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
            #               var v = b2Math.AddVV(pos, d);
            #               context.lineTo(v.x, v.y);
            #               theta += dtheta;
            #           }
            #           context.lineTo(pos.x + r, pos.y);
            # 
            #           // draw radius
            #           context.moveTo(pos.x, pos.y);
            #           var ax = circle.m_R.col1;
            #           var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
            #           context.lineTo(pos2.x, pos2.y);
            #       }
            #       break;
            #   case b2Shape.e_polyShape:
            #       {
            #           var poly = shape;
            #           var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
            #           context.moveTo(tV.x, tV.y);
            #           for (var i = 0; i < poly.m_vertexCount; i++) {
            #               var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
            #               context.lineTo(v.x, v.y);
            #           }
            #           context.lineTo(tV.x, tV.y);
            #       }
            #       break;
            #   }
            #   context.fill();
            #   context.stroke();
            # }
            # 
            # function createWorld() {
            #   var worldAABB = new b2AABB();
            #   worldAABB.minVertex.Set(-1000, -1000);
            #   worldAABB.maxVertex.Set(1000, 1000);
            #   var gravity = new b2Vec2(0, 300);
            #   var doSleep = true;
            #   world = new b2World(worldAABB, gravity, doSleep);
            #   createGround(world);
            #   return world;
            # }     
            # 
            # function createGround(world) {
            #   var groundSd = new b2BoxDef();
            #   groundSd.extents.Set(400, 30);
            #   groundSd.restitution = 0.0;
            #   var groundBd = new b2BodyDef();
            #   groundBd.AddShape(groundSd);
            #   groundBd.position.Set(400, 470);
            #   return world.CreateBody(groundBd);
            # }
            # 
            # function createBall(world, x, y) {
            #   var ballSd = new b2CircleDef();
            #   ballSd.density = 1.0;
            #   ballSd.radius = 20;
            #   ballSd.restitution = 0.5;
            #   ballSd.friction = 0.5;
            #   var ballBd = new b2BodyDef();
            #   ballBd.AddShape(ballSd);
            #   ballBd.position.Set(x,y);
            #   return world.CreateBody(ballBd);
            # }
            # 
            # function createHelloWorld() {
            #   // H
            #   createBox(world, 50, 420, 10, 20, false);
            #   createBox(world, 90, 420, 10, 20, false);
            #   createBox(world, 70, 395, 30, 5, false);
            #   createBox(world, 50, 370, 10, 20, false);
            #   createBox(world, 90, 370, 10, 20, false);
            # 
            #   // E
            #   createBox(world, 140, 435, 30, 5, false);
            #   createBox(world, 120, 420, 10, 10, false);
            #   createBox(world, 130, 405, 20, 5, false);
            #   createBox(world, 120, 390, 10, 10, false);
            #   createBox(world, 140, 375, 30, 5, true);
            # 
            #   // L
            #   createBox(world, 200, 435, 20, 5, false);
            #   createBox(world, 185, 400, 5, 30, false);
            # 
            #   // L
            #   createBox(world, 250, 435, 20, 5, false);
            #   createBox(world, 235, 400, 5, 30, false);
            # 
            #   // O
            #   createBox(world, 300, 435, 20, 5, false);
            #   createBox(world, 285, 405, 5, 25, false);
            #   createBox(world, 315, 405, 5, 25, false);
            #   createBox(world, 300, 375, 20, 5, false);
            # 
            #   // W
            #   createBox(world, 390, 435, 40, 5, false);
            #   createBox(world, 360, 390, 10, 40, false);
            #   createBox(world, 420, 390, 10, 40, false);
            #   createBox(world, 390, 415, 5, 15, false);
            # 
            #   // O
            #   createBox(world, 460, 435, 20, 5, false);
            #   createBox(world, 445, 405, 5, 25, false);
            #   createBox(world, 475, 405, 5, 25, false);
            #   createBox(world, 460, 375, 20, 5, false);
            # 
            #   // R
            #   createBox(world, 495, 410, 5, 30, false);
            #   createBox(world, 518, 425, 5, 15, false);
            #   createBox(world, 515, 405, 15, 5, false);
            #   createBox(world, 525, 390, 5, 10, false);
            #   createBox(world, 510, 375, 20, 5, false);
            # 
            #   // L
            #   createBox(world, 560, 435, 20, 5, false);
            #   createBox(world, 545, 400, 5, 30, false);
            # 
            #   // D
            #   createBox(world, 610, 435, 20, 5, false);
            #   createBox(world, 595, 405, 5, 25, false);
            #   createBox(world, 625, 405, 5, 25, false);
            #   createBox(world, 610, 375, 20, 5, false);
            # 
            #   // !
            #   createBox(world, 650, 430, 10, 10, false);
            #   createBox(world, 650, 380, 10, 40, false);
            # }
            # 
            # function createBox(world, x, y, width, height, fixed) {
            #   if (typeof(fixed) == 'undefined') fixed = true;
            #   var boxSd = new b2BoxDef();
            #   if (!fixed) boxSd.density = 1.0; 
            #   boxSd.restitution = 0.0;
            #   boxSd.friction = 1.0;
            #   boxSd.extents.Set(width, height);
            #   var boxBd = new b2BodyDef();
            #   boxBd.AddShape(boxSd);
            #   boxBd.position.Set(x,y);
            #   return world.CreateBody(boxBd);
            # }
            # 
            # function step(cnt) {
            #   var stepping = false;
            #   var timeStep = 1.0/60;
            #   var iteration = 1;
            #   world.Step(timeStep, iteration);
            #   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            #   drawWorld(world, ctx);
            #   setTimeout('step(' + (cnt || 0) + ')', 10);
            # }
            # 
            # // main entry point
            # Event.observe(window, 'load', function() {
            #   world = createWorld();
            #   ctx = $('canvas').getContext('2d');
            #   var canvasElm = $('canvas');
            #   canvasWidth = parseInt(canvasElm.width);
            #   canvasHeight = parseInt(canvasElm.height);
            #   canvasTop = parseInt(canvasElm.style.top);
            #   canvasLeft = parseInt(canvasElm.style.left);
            # 
            #   createHelloWorld();
            # 
            #   Event.observe('canvas', 'click', function(e) {
            #           if (Math.random() > 0.5) {
            #               //createBox(world, Event.pointerX(e), Event.pointerY(e), 10, 10, false);
            #               createBox(world, e.clientX, e.clientY, 10, 10, false);
            #           } else {
            #               createBall(world, Event.pointerX(e), Event.pointerY(e));
            #           }
            #   });
            #   step();
            # });

            
    $.route.add
        '': () ->
            $('#content').view
                name: 'Home'
                data: {}  
)(ender)