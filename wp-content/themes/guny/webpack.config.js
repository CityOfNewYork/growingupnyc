var webpack = require('webpack');

const config= {
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

// define additional plugins
config.plugins = config.plugins||[];
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': `"production"`
    }
  }));
} else {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': `"development"`
    }
  }));
}

module.exports = config;