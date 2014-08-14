module.exports = {
    entry: {
        app: './src/components/app.jsx',
        background: './src/background/background.js'
    },
    output: {
        path: 'build',
        filename: '[name].js' // Template based on keys in entry above
    },
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'jsx-loader'}
        ]
    }
};