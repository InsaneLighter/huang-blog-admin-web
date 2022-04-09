import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Config from '../default-settings'

NProgress.configure({ showSpinner: false })

const whiteList = [] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + ' - ' + Config.title
    }

    NProgress.start()
    //TODO 暂时直接放行,路由权限拦截暂未集成
    next()
    NProgress.done()
    return

    //存在token 则进行放行
    // if (getToken()) {
    //     // 已登录且要跳转的页面是登录页
    //     if (to.path === '/login') {
    //         next({ path: '/' })
    //         NProgress.done()
    //         return
    //     } else {
    //         next()
    //         NProgress.done()
    //         return
    //     }
    // } else {
    //     // 在免登录白名单，直接进入
    //     if (whiteList.indexOf(to.path) !== -1) {
    //         next()
    //     } else {
    //         // 否则全部重定向到登录页
    //         next(`/login?redirect=${to.fullPath}`)
    //         NProgress.done()
    //     }
    // }

    //检查白名单
    if (whiteList.includes(to.name)) {
        next()
        return
    }

    next({
        name: 'Login',
        query: {
            redirect: to.fullPath
        }
    })
    NProgress.done()
})

router.afterEach(() => {
    NProgress.done()
})

