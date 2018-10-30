const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const spawn = require('child_process').spawn

const baseConfig = require('./webpack.renderer.search.config')

module.exports = merge.smart(baseConfig, {
    entry: [
        'react-hot-loader/patch',
        './src/renderer/search.tsx'
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [ path.resolve(__dirname, 'src', 'renderer') ],
                loaders: [ 'react-hot-loader/webpack', 'awesome-typescript-loader' ]
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        port: 2004,
        compress: true,
        noInfo: true,
        stats: 'errors-only',
        inline: true,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false
        }
    }
})
