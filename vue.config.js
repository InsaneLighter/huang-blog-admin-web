const path = require('path')
const port = 17777

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    runtimeCompiler: true,
    publicPath: process.env.PUBLIC_PATH,
    //css配置
    css: {
        loaderOptions: {
            less: {
                modifyVars: {},
                javascriptEnabled: true
            }
        }
    },
    //开发服务器配置
    devServer: {
        host: "localhost",
        //端口号
        port: port,
        //自动启动浏览器
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:17007/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': 'api'
                }
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                // 包别名设置
                '@': resolve('src')
            }
        }
    },
    chainWebpack: config => {
        //网站初始化标题设置
        config.plugin('html').tap((args) => {
            args[0].title = 'Huang'
            return args
        })
    },
    lintOnSave: false,
    transpileDependencies: [],
    productionSourceMap: false
}
