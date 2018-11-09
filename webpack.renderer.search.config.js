const merge = require('webpack-merge')
const path = require('path')

const baseConfig = require('./webpack.renderer.explorer.config')

module.exports = merge.smart(baseConfig, {
    output: {
        path: path.resolve(__dirname, 'dist', 'search'),
    },
    target: 'electron-renderer',
    entry: {
        app: './src/renderer/search.tsx'
    }
})
