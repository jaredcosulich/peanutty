path = require('path')

module.exports = (require) ->
    require.mock = (realPath, mockPath, packageRoot) ->
        if packageRoot
            realPath = "#{packageRoot}/node_modules/#{realPath}"
        
        mocked = require(mockPath)
        mockedModule = require.cache[require.resolve(mockPath)]
        mockedModule.real = require(realPath)
        require.cache[require.resolve(realPath)] = mockedModule

        return mocked