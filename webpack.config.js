const path = require('path')

module.exports = {
  entry: './client/index.js',
  target: 'electron',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  node: {
    global: true,
    __dirname: true,
    __filename: true
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env']
        }
      }
    ]
  }
}
