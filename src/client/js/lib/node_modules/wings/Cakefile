fs = require('fs')
{spawn, exec} = require('child_process')

package = JSON.parse(fs.readFileSync('package.json', 'utf8'))

execCmds = (cmds) ->
    exec cmds.join(' && '), (err, stdout, stderr) ->
        output = (stdout + stderr).trim()
        console.log(output + '\n') if (output)
        throw err if err

task 'build', 'Build the library', ->
    execCmds [
        'coffee --bare --output ./lib ./src/wings/*.coffee',
    ]

task 'test', 'Build and run the test suite', ->
    execCmds [
        'cake build',

        'coffee --compile --bare --output test src/test/*.coffee',
        'ln -sf ../src/test/index.html test',
        'ln -sf ../src/test/vows.css test',

        'npm install .',
        'npm install --dev',
        'ln -sfh ender-vows node_modules/vows',

        'pushd test',
        'ln -sfh ../node_modules node_modules',
        'ln -sfh .. node_modules/wings',
        #'node_modules/.bin/ender build ender-vows ..',
        'node_modules/.bin/vows *-test.js',
        'unlink node_modules/wings',
        'popd test',
    ]