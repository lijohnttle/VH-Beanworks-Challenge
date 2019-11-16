const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/server/index.js',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            }
        ]
    },
    resolve: {
        extensions: ['*', '.mjs', '.js', '.vue', '.json', '.gql', '.graphql']
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'index.js'
    },
    devServer: {
        contentBase: '/dist'
    },
    target: 'node',
    node: {
        fs: 'empty',
        net: 'empty'
    }
};