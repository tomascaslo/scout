const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const validate = require('webpack-validator');

const PATHS = {
	entry: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'build')
};

var config = {
	entry: {
		bundle: PATHS.entry
	},
	output: {
		path: PATHS.build,
		filename: '[name].js' 
	},
	devtool: 'eval-source-map',
	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
		stats: 'errors-only',
		host: process.env.HOST,
		port: process.env.PORT
	},
	module: {
		loaders: [
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules|\.config\.js$)/,
				query: {
					presets: ['es2015'],
					plugins: ['babel-plugin-add-module-exports']
				}
			}
		],
		preLoaders: [
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /(node_modules|\.config\.js$)/
			}
		]
	},
	eslint: {
		formatter: require('eslint-friendly-formatter')
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Scout',
			template: 'src/index.html'
		}),
		new webpack.HotModuleReplacementPlugin({
			multiStep: true
		})
	]
};

module.exports = validate(config);
