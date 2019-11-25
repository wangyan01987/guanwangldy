
var webpack = require('webpack');
var path = require('path');
var serverHost = "localhost";
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require("mini-css-extract-plugin")
var uglify = require('uglifyjs-webpack-plugin');

module.exports = {
    entry:'./index.js',
    output:{
        path: path.resolve('./dist'),
        filename: 'js/bundle.js',
        // publicPath: './',
        // globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                // loader: ExtractTextPlugin.extract('style-loader!css-loader'),
                // loader:'style-loader!css-loader'
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]

            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader?name=css/[name].[ext]'
            },
            {
                //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                //如下配置，将小于8192byte的图片转成base64码
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[ext]'
            }
        ]
    },
    plugins: [
		new uglify(),
        new HtmlWebpackPlugin({
            title:"ldy",
            template:'./src/index.html',
            // filename:"./dist/index.html",//输出html文件，打包时插入js,不用自己手动引入
            inject: 'body',  //js插入的位置，true/'head'/'body'/false
            hash: true
        }),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery",
            Popper: ['popper.js', 'default']
        }),
        new MiniCssExtractPlugin({
            filename: "css/index.css"
        })
    ],
    //使用webpack-dev-server
    devServer: {
        contentBase: './',
        host: serverHost,
        port: 9090, //默认9090
        inline: true, //可以监控js变化
        hot: true//热启动
    },
}
