const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./webpack.renderer.app.config')

module.exports = merge.smart(baseConfig, {
    target: 'electron-renderer',
    entry: {
        app: './src/renderer/search.tsx'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'search.html'
        })
    ]
})
