var webpack = require('webpack');

const config = {
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
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
    modules: ['src', 'node_modules']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  devtool: 'inline-source-map',
  performance: { hints: false }
};

// define additional plugins
config.plugins = config.plugins || [];
if (process.env.NODE_ENV === 'production') {
  config.mode = 'production'
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': `"production"`
    }
  }));
} else {
  config.mode = 'development'
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': `"development"`
    }
  }));
}

module.exports = config;