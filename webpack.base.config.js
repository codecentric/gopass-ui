'use strict'

const path = require('path')

module.exports = {
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    devtool: 'source-map',
    plugins: [],
    mode: 'development'
}
