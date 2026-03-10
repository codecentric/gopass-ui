const path = require('path')
const { merge } = require('webpack-merge')
const spawn = require('child_process').spawn

const baseConfig = require('./webpack.renderer.explorer.config')

module.exports = merge(baseConfig, {
    entry: {
        app: './src/renderer/explorer-app.tsx'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [ path.resolve(__dirname, 'src', 'renderer') ],
                loader: 'ts-loader'
            }
        ]
    },
    devServer: {
        port: 2003,
        compress: true,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false
        },
        setupMiddlewares(middlewares) {
            if (process.env.START_HOT) {
                console.log('Starting main process');
                spawn('npm', ['run', 'start-main-dev'], {
                    shell: true,
                    env: process.env,
                    stdio: 'inherit'
                })
                    .on('close', code => process.exit(code))
                    .on('error', spawnError => console.error(spawnError));
            }
            return middlewares;
        }
    }
})
