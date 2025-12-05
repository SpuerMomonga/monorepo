const path = require('node:path')

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: 'chunks/[name].[contenthash:8].js',
    chunkFormat: 'module',
    clean: true,
  },
  target: 'electron39.2-main',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
    ],
  },
  externals: [],
  experiments: {
    outputModule: true,
  },
}
