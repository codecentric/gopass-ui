const merge = require('webpack-merge')

const baseConfig = require('./webpack.renderer.explorer.config')

module.exports = merge.smart(baseConfig, {
    plugins: [],
    mode: 'production'
})
