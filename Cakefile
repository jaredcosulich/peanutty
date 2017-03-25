fs = require('fs')
{exec} = require('child_process')

task 'build:less', 'Build the less into css', ->
  exec 'lessc ./less/all.less', (err, stdout, stderr) ->
    fs.writeFileSync('css/all.css', stdout)


task 'run:server', 'Run the server', ->
  execCmds ['node server.js']
  console.log('Server running: localhost:8080')


task 'install', 'Install everything', ->
  execCmds ['npm install']


task 'run', 'Build everything and run the server', ->
  invoke task for task in ['install', 'build:less', 'run:server']


execCmds = (cmds) ->
  exec cmds.join(' && '), (err, stdout, stderr) ->
      console.log(stdout + stderr) if (stdout or stderr)
      throw err if err
