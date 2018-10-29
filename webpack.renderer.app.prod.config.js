const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const baseConfig = require('./webpack.renderer.app.config')

module.exports = merge.smart(baseConfig, {
    plugins: [
        new UglifyJsPlugin()
    ]
})
