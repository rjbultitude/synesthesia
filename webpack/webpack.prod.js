const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const CopyPlugin = require('copy-webpack-plugin');
const {src_Path, distDir, copyPluginConfig, splitChunksConfig} = require('./common.js');

module.exports = {
  entry: {
    main: src_Path + '/src/index.js'
  },
  output: {
    filename: (data) => {
      return data.chunk.name === 'vendor' ? '[name].js' : '[name].[chunkhash:8].js';
    },
    chunkFilename: '[name].js',
    path: distDir
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'img',
          },
        }],
      },
      {
        test: /\.(html|ejs)$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false }
          }
        ]
      },
      {
        test: /\.(sass|scss|css)$/,
        exclude: /node_modules/,
        use: [{
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './postcss.config.js'
              }
            },
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    minimizer: [new TerserPlugin({
      extractComments: true,
      terserOptions: {
        extractComments: 'all',
        exclude: /\.(html|.ejs)/,
        compress: {
          drop_console: true,
        },
      }
    })],
		splitChunks: splitChunksConfig
	},
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: './index.html',
      filename: 'index.html',
      svgoConfig: {removeViewBox: false, cleanupAttrs: false, removeAttrs: false}
    }),
    new CopyPlugin(copyPluginConfig),
    new WebpackMd5Hash()
  ]
};
