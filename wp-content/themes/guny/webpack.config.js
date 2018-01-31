var webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        query: {
          presets: [
            [
              'es2015',
              {
                'modules': false
              }
            ]
          ]
        }
      },
      {
        loader: 'json-loader',
        test: /\.json/
      }
    ]
  },
  externals: {
    'modernizr': 'Modernizr',
    'jquery': 'jQuery'
  },
  resolve: {
    modules: ['src', 'node_modules']
  },
  plugins: [
    new webpack.ProvidePlugin({
      Modernizr : 'modernizr',
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  devtool: 'inline-source-map'
};
