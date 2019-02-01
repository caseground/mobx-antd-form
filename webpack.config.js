const path = require('path');
const fs = require('fs');
const App = require('./app_config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const isProd = mode === 'production';

const output_dir = path.join(__dirname, 'dist');

const PORT = 8000;

module.exports = {
    mode: mode,
    entry: App.entry,
    output: {
        path: output_dir,
        filename: isProd ? '[name]@[chunkhash].js' : '[name].js',
        publicPath: isProd ? 'https://honchy.cn/' : 'http://localhost:' + PORT + '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                include: path.join(__dirname, 'src'),
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    { loader: 'postcss-loader' }
                ]
            }, {
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } }
                ]
            }
        ]
    },
    devtool: 'cheap-source-map',
    devServer: {
        contentBase: output_dir,
        port: PORT,
        hot: true
    },
    resolve: {
        alias: {
            '@common': path.join(__dirname, 'src', 'common'),
            '@components': path.join(__dirname, 'src', 'components'),
            '@style': path.join(__dirname, 'src', 'style')
        }
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            maxSize: 0,
            minChunks: 2,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                default: false,
                common: {
                    name: 'common',
                    test: /\.js$/,
                    minChunks: 2,
                    priority: 1,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [].concat(
        new CleanWebpackPlugin(output_dir),
        App.html.map(item => {
            let cfg = {
                filename: item.html_out,
                chunks: [item.name],
                minify: isProd
            };

            if (item.html) {
                cfg.template = item.html;
            }

            return new HtmlWebpackPlugin(cfg);
        }),
        new MiniCssExtractPlugin({
            filename: isProd ? '[name]@[hash].css' : '[name].css',
            chunkFilename: isProd ? '[id]@[hash].css' : '[id].css'
        })
    )
};
