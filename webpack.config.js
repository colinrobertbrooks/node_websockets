var webpack = require('webpack');
var path = require('path');

var srcDir = path.resolve(__dirname, 'src/javascripts');
var publicDir = path.resolve(__dirname, 'public/javascripts');

var config = {
  entry: srcDir + '/chat.jsx',
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: srcDir,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    path: publicDir,
    filename: 'chat.js'
  }
};

module.exports = config;
