assert = require('assert')
vows = require('vows')

require('./lib/mock')(require)

vows.add 'Mock Test'
    'requiring the original module':
        topic: -> require('./mock/foo')
        
        'returns the original module': (module) ->
            assert.equal module.test, 'foo'
        
    'mocking out the module':
        topic: -> require.mock('./mock/foo', './mock/bar')
        
        'returns the mocked module': (module) -> 
            assert.equal module.test, 'bar'
            
        'and then requiring the original module':
            topic: -> require('./mock/foo')
                
            'should now return the mocked module': (module) ->
                assert.equal module.test, 'bar'
                
    'a module with a mocked-out package':
        topic: ->
            require.mock('baz', './mock/bar', './mock')
            return require('./mock/bazloader')
            
        'actually loads the mocked package': (module) ->
            assert.equal module.test, 'bar'
        