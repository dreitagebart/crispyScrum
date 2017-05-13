var path = require('path')

module.exports = {
  target: 'electron-renderer',
  devtool: 'source-map',
  watch: true,
  entry: {
    app: './src/components/root',
    task: './src/components/task-detached',
    about: './src/components/about'
  },
  output: {
    path: path.resolve(__dirname, 'src', 'public', 'js'),
    filename: '[name].js'
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
