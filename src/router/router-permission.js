import router from './index'
import store from '@/store'
import Config from '@/default-settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from '@/utils/auth'

NProgress.configure({showSpinner: false})
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + ' - ' + Config.title
    }
    NProgress.start()
    if (getToken()) {
        // 已登录且要跳转的页面是登录页
        if (to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        } else {
            store.dispatch('user/GetInfo')
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.fullPath}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
