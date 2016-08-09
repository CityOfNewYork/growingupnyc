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
    'jquery': 'jQuery'
  },
  resolve: {
    modulesDirectories: ['src', 'node_modules']
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ProvidePlugin({
      Modernizr : 'modernizr',
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
