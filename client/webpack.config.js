const path = require('path');

module.exports = {
  entry: { app: './src/index.js' },
  output: {
    path: path.resolve('../app/assets/javascripts/webpack'),
    filename: 'app.js',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      }
    ]
  },
}
