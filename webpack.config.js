var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');

// Load *package.json* so we can use `dependencies` from there
var pkg = require('./package.json');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlwebpackPlugin = require('html-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'parser-server/public/app')
};

var common = {
  entry: PATHS.app,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: PATHS.app
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app
      }
    ]
  },
  plugins: []
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      quite: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      host: process.env.HOST,
      port: process.env.PORT
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['babel'],
          include: PATHS.app
        },
        {
          test: /\.less$/,
          loader: 'style!css!less'
        }
      ]
    },
    plugins: [
      new HtmlwebpackPlugin({ 
        title: 'RedBook',
        favicon: 'public/favicon.ico',
        chunks: ['public'],
        template: 'public/template.html',
        filename: 'index.html'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}


if(TARGET === 'build' || TARGET === 'stats') {

  module.exports = merge(common, {
    entry: {
      app: PATHS.app,
      vendor: Object.keys(pkg.dependencies).filter(function(v) {
        // Exclude alt-utils as it won't work with this setup
        // due to the way the package has been designed
        // (no package.json main).
        return v !== 'alt-utils';
      })
    },
    //devtool: 'eval-source-map',
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        }
      ]
    },
    plugins: [
      new Clean([PATHS.build]),
      new ExtractTextPlugin('styles.css'),
      // Extract vendor and manifest files
      // new webpack.optimize.CommonsChunkPlugin({
      //   names: ['vendor', 'manifest']
      // }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor']
      }),
      // Setting DefinePlugin affects React library size!
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}

