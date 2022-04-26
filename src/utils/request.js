import axios from 'axios'
import router from '@/router/index'
import {notification} from 'ant-design-vue'
import store from '../store'
import Config from '@/default-settings'
import {getToken} from '@/utils/auth'
import Cookies from 'js-cookie'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/',
    timeout: Config.timeout // 请求超时时间(2分钟)
})

// request拦截器
service.interceptors.request.use(
    config => {
        if (getToken()) {
            config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        config.headers['Content-Type'] = 'application/json'
        return config
    },
    error => {
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        // 兼容blob下载出错json提示
        if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
            const reader = new FileReader()
            reader.readAsText(error.response.data, 'utf-8')
            reader.onload = function (e) {
                const errorMsg = JSON.parse(reader.result).message
                notification.error({
                    message: errorMsg,
                    duration: 1
                })
            }
        } else {
            let code = 0
            try {
                code = error.response.data.status
            } catch (e) {
                if (error.toString().indexOf('Error: timeout') !== -1) {
                    notification.error({
                        message: '网络请求超时',
                        duration: 1
                    })
                    return Promise.reject(error)
                }
            }
            if (code) {
                if (code === 401) {
                    store.dispatch('LogOut').then(() => {
                        // 用户登录界面提示
                        Cookies.set('point', 401)
                        location.reload()
                    })
                } else if (code === 403) {
                    router.push({path: '/401'})
                } else {
                    const errorMsg = error.response.data.message
                    if (errorMsg !== undefined) {
                        notification.error({
                            message: errorMsg,
                            duration: 1
                        })
                    }
                }
            } else {
                notification.error({
                    message: '接口请求失败',
                    duration: 1
                })
            }
        }
        return Promise.reject(error)
    }
)

const transformGetData = function (data) {
    let params = '?'
    Object.keys(data).forEach(key => {
        let flag = true
        if (data[key] === undefined) {
            flag = false
        }
        if (typeof data[key] == "string" && data[key].trim() === '') {
            flag = false
        }
        if (typeof data[key] == "object" && data[key].length === 0) {
            flag = false
        }
        if (flag) {
            params += (key + '=' + data[key] + '&')
        }
    })
    return params.lastIndexOf('&') === params.length - 1 ? params.substring(0, params.length - 1) : params
}

export { service, transformGetData }
