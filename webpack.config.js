var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  watch: true,
  entry: './src/components/root',
  output: {
    path: path.resolve(__dirname, 'src', 'public', 'js'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: []
}
