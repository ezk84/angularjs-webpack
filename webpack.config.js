/* eslint-env node */
const path = require('path');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = {
    module: {
        rules: [{
            // JS LOADER
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                {
                    // https://github.com/babel/babel-loader
                    // Transpile .js files using babel-loader
                    // Compiles ES6 and ES7 into ES5 code
                    loader: 'babel-loader',
                },
            ],
        }, {
            // CSS LOADER
            test: /\.(le|c)ss$/,
            use: [
                {
                    // https://github.com/webpack/css-loader
                    // Allow loading css through js
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    },
                },
                {
                    // https://github.com/postcss/postcss-loader
                    // Postprocess your css with PostCSS plugins
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        plugins: [autoprefixer],
                    },
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                    },
                },
            ],
        }, {
            // ASSET LOADER
            // https://github.com/webpack/file-loader
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file-loader',
        }, {
            // HTML LOADER
            // https://github.com/webpack/raw-loader
            // Allow loading html through js
            test: /\.html$/,
            loader: 'raw-loader',
        }],
    },

    /**
     * Plugins
     * Reference: https://webpack.js.org/configuration/plugins/
     * List: https://webpack.js.org/plugins/
     */
    plugins: [],

    /**
     * Dev server configuration
     * https://webpack.js.org/configuration/dev-server/
     */
    devServer: {
        contentBase: './src/public',
        stats: 'minimal',
        host: '0.0.0.0',
        overlay: true,
    },
};

const dev = {
    mode: 'development',
    entry: {
        app: './src/app/app.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
    },
    devtool: 'eval-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            exclude: /node_modules/,
            use: [{
                loader: 'eslint-loader',
                options: {
                    cache: true,
                },
            }],
        }, {
            // CSS LOADER
            // https://github.com/webpack/style-loader
            // Use style-loader in development.
            test: /\.(le|c)ss$/,
            enforce: 'post',
            use: 'style-loader',
        }],
    },
    plugins: [
        // Render index.html
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            inject: 'body',
        }),
    ],
};

const prod = {
    mode: 'production',
    entry: {
        app: './src/app/app.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js',
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            exclude: /node_modules/,
            use: [{
                loader: 'eslint-loader',
                options: {
                    cache: true,
                },
            }],
        }, {
            // CSS LOADER
            // https://github.com/webpack-contrib/mini-css-extract-plugin
            // Extract css files in production builds
            test: /\.(le|c)ss$/,
            enforce: 'post',
            use: MiniCssExtractPlugin.loader,
        }],
    },
    plugins: [
        // Render index.html
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            inject: 'body',
        }),
        // Extract css files
        // https://github.com/webpack-contrib/mini-css-extract-plugin
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
        // Copy assets from the public folder
        // https://github.com/kevlened/copy-webpack-plugin
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'src/public'),
        }]),
    ],
};

const test = {
    mode: 'none',
    entry: undefined,
    output: {},
    devtool: 'inline-source-map',
    module: {
        rules: [{
            // ISTANBUL LOADER
            // https://github.com/deepsweet/istanbul-instrumenter-loader
            // Instrument JS files with istanbul-lib-instrument for subsequent code coverage reporting
            // Skips node_modules and files that end with .spec.js
            test: /\.js$/,
            enforce: 'pre',
            exclude: [/node_modules/, /\.spec\.js$/],
            use: [{
                loader: 'istanbul-instrumenter-loader',
                options: {
                    esModules: true,
                },
            }],
        }, {
            // This must run before istanbul to ensure we're linting the right source
            test: /\.js$/,
            enforce: 'pre',
            exclude: [/node_modules/],
            use: [{
                loader: 'eslint-loader',
                options: {
                    cache: true,
                },
            }],
        }, {
            // CSS LOADER
            // Ignore css for testing
            test: /\.(le|c)ss$/,
            enforce: 'post',
            use: 'null-loader',
        }],
    },
};


/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isTest = ENV === 'test' || ENV === 'test-watch';
const isProd = ENV === 'build';

module.exports =
    isTest ? merge(common, test) :
    isProd ? merge(common, prod) : merge(common, dev);
