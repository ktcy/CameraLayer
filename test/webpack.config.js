const path = require('path');

module.exports = {
  context: __dirname,
  entry: './src/app.coffee',
  module: {
    rules: [
      {test: /\.coffee$/, use: 'coffee-loader'}
    ]
  },
  resolve: {
    extensions: ['.js', '.coffee'],
    modules: [
      '../src',
      'node_modules'
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    port: 8080
  }
};
