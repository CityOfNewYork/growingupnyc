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
    //'jquery': 'jQuery',
  },
  resolve: {
    modulesDirectories: ['src', 'node_modules']
  },
  plugins: [
    new webpack.ProvidePlugin({
      //$: 'jquery',
      //jQuery: 'jquery'
    })
  ]
};