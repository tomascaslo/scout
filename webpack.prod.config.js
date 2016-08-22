const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const validate = require('webpack-validator');

const PATHS = {
	entry: path.join(__dirname, 'src', 'index.js'),
	build: path.join(__dirname, 'build')
};

var config = {
	entry: {
		entry: PATHS.entry
	},
	output: {
		path: PATHS.build,
		filename: '[name].[chunkhash].js',
		chunkFilename: '[chunkhash].js'
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /(node_modules|\.config\.js$)/,
				query: {
					presets: ['es2015'],
					plugins: ['babel-plugin-add-module-exports']
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin([PATHS.build], {
			root: process.cwd()
		}),
		new HtmlWebpackPlugin({
			title: 'Scout',
			template: './src/index.html'
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.optimize.DedupePlugin()
	]
};

module.exports = validate(config);
