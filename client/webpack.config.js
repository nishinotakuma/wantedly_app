const path = require('path');

module.exports = {
  entry: {
    skill_box: './src/SkillBox.js',
    other_skill_box: './src/OtherSkillBox.js',
   },
  output: {
    path: path.resolve('../app/assets/javascripts/webpack'),
    filename: '[name].js',
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
