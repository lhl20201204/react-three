const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: resolve(__dirname, 'index.js'),
  output: {
    path: resolve(__dirname, 'bundle')
  },
  resolve: {
    modules: ["node_modules"],
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.less$/i,
        use: [{
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        },
        {
          loader: "less-loader"
        }
        ]
      },
      {
        test: /\.scss$/i,
        use: [{
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        },
        {
          loader: "postcss-loader"
        },
        {
          loader: "sass-loader"
        }
        ]
      },
      {
        test: /\.css$/i,
        use: [{
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        }
        ]
      },
      {
        test: /\.(png|jpg|gif|bmp|webp)$/,
        use: [{
          loader: 'url-loader?limit=14240&name=[hash:8]-[name].[ext]',
        }]
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        use: 'url-loader',
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve(__dirname, 'public/index.html'),
    })
  ],
  devServer: {
    port: 4444,
  },
}