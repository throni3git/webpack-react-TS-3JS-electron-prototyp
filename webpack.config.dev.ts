import * as webpack from "webpack";
import * as webpackDevServer from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
// import copyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";

const timestamp = JSON.stringify(new Date().toISOString());

const config: webpack.Configuration & {
	devServer?: webpackDevServer.Configuration;
} = {
	// webpack will take the files from ./src/index
	entry: "./src/index.ts",

	// adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
	resolve: {
		extensions: [".js", ".ts", ".tsx"],
	},

	module: {
		rules: [
			// we use babel-loader to load our jsx and tsx files
			{
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},

	plugins: [
		new webpack.DefinePlugin({
			BUILD_TIMESTAMP: timestamp,
			IS_PRODUCTION: false,
		}),
		new HtmlWebpackPlugin({ title: "Title3000", favicon: "favicon.png" }),
		// new copyWebpackPlugin({
		// 	patterns: [{ from: "media/", to: "media/" }],
		// }),
	],

	// and output it into /dist as bundle.js with hash
	output: {
		path: path.resolve("dist"),
		filename: "js/bundle.[contenthash].js",
		clean: true,
	},

	mode: "development",

	devtool: "source-map",

	devServer: {
		port: 9000,
		stats: "errors-warnings",
	} as webpackDevServer.Configuration,
};

module.exports = config;
