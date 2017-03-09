var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    build: './src/main.js',
    index: './src/js/entry/index.js',
    posts: './src/js/entry/posts.js',
    tags: './src/js/entry/tags.js',
    tag: './src/js/entry/tag.js',
    post: './src/js/entry/post.js',
    categories: './src/js/entry/categories.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this nessessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    },
    modules: [
      path.resolve('./src/js'),
      path.resolve('./src/vue'),
      path.resolve('./node_modules')
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    proxy: {
      '/**': {  //catch all requests
        target: '/index.html',  //default target
        secure: false,
        bypass: function(req, res, opt){
          //your custom code to check for any exceptions
          //console.log('bypass check', {req: req, res:res, opt: opt});
          console.log('req.path', req.path)
          if(req.path.indexOf('.css') !== -1 || req.path.indexOf('.js') !== -1 || req.path.indexOf('/images/') !== -1){
            return req.path
          }
          if(req.path === '/'){
            return 'index.html'
          }
          if(req.path.indexOf('.html') === -1){
            return req.path + '.html'
          }
        }
      }
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
