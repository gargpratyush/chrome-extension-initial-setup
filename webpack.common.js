const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve('./src/popup/popup.tsx'),
        options: path.resolve('./src/options/options.tsx'),
        background: path.resolve('./src/background/background.ts'),
        contentScript: path.resolve('./src/contentScript/contentScript.ts'),
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            ident: 'postcss',
                            plugins: [
                                tailwindcss,
                                autoprefixer,
                            ],
                        },
                    },
                
                }],
                test: /\.css$/i,
            },
            {
                type: 'assets/resource',
                use: 'asset/resource',
                test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|tff|eot)$/,
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve('src/static'), to: path.resolve('dist') },
            ],
        }),
        ...getHtmlPlugins(['popup', 'options']),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'New Tab Perplexity',
        filename: `${chunk}.html`,
        chunks: [chunk],
    }));
}