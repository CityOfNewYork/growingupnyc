var path = require('path');
var webpack = require('webpack');

const config = {
  devtool: 'inline-source-map',
  performance: { hints: false },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /.\/node_modules\/@nycopportunity\/growingup-patterns\/src/,
        query: {
          presets: [
            [
              '@babel/preset-env',
              {
                'modules': false
              }
            ]
          ]
        }
      },
      {
        loader: 'file-loader',
        test: /\.json/,
        type: 'javascript/auto'
      }
    ]
  },
  externals: {
    'jquery': 'jQuery'
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
      'node_modules/@nycopportunity/growingup-patterns/src',
      'node_modules/@nycopportunity/growingup-patterns/dist'
      ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ],
  // output: {
  //   filename: 'bundle.js',
  //   path: path.resolve(__dirname, 'assets/js'),
  // }
};

module.exports = config;