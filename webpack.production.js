const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        products: './src/js/products.js',
        posts: './src/js/posts.js',
        // another_module: './src/js/another_module.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist/production/js'),
        clean: true,
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                common: {
                    test: /[\\/]src[\\/]js[\\/]/,
                    name: 'common',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
}