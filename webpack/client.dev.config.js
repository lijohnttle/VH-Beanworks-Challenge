const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/client/index.jsx',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: path.resolve(process.cwd(), 'public'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './public'
    }
};