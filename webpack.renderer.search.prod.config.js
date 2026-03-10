const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.renderer.search.config')

module.exports = merge(baseConfig, {
    plugins: [],
    mode: 'production'
})
