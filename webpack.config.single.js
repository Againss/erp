const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const UglifyJsPluginconfig = new UglifyJsPlugin({
  cache: true,
  parallel: true,
  uglifyOptions: {
    compress: {
      drop_console: true,
      collapse_vars: true,
      reduce_vars: true
    }
  }
})
module.exports = {
  mode: 'production',
  entry: {
    'lang': './src/static/lang/lang.js'
  },
  plugins: [],

  output: {
    path: path.resolve(__dirname, 'src/static/lang'),
    filename: '[name].min.js',
    libraryTarget: 'umd',
    library: '[name]'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  optimization: {
    minimize: true,
    minimizer: [
      UglifyJsPluginconfig
    ],
    runtimeChunk: false
  }
}
