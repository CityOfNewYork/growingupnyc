var webpack = require('webpack');
module.exports = {
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.js$/,
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ],
  },
  externals: {
    'modernizr': 'Modernizr',
  },
  resolve: {
    modulesDirectories: ['src', 'node_modules']
  },
  plugins: [
    new webpack.ProvidePlugin({
      Modernizr : 'modernizr'
      //$: 'jquery',
      //jQuery: 'jquery'
    })
  ]
};