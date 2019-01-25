const merge = require('webpack-merge')

const baseConfig = require('./webpack.renderer.search.config')

module.exports = merge.smart(baseConfig, {
    plugins: [],
    mode: 'production'
})
