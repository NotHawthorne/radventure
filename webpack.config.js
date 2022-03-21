const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: "./src/main.ts",
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist")
  },

  mode: "development",

  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    https: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'login.html',
      filename: 'login.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "index.html").replace(/\\/g, '/'),
          to: path.resolve(__dirname, "dist").replace(/\\/g, '/')
        },
        {
          from: path.resolve(__dirname, "sprites", "**", "*").replace(/\\/g, '/'),
          to: path.resolve(__dirname, "dist").replace(/\\/g, '/')
        }
      ]
    })
  ],

};