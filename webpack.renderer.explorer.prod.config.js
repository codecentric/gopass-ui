const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.renderer.explorer.config')

module.exports = merge(baseConfig, {
    plugins: [],
    mode: 'production'
})
