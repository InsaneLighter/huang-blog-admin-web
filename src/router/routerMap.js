import Layout from '@/components/layouts/Layout'
import BlankLayout from '@/components/layouts/global/BlankLayout'

export const routerMap = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: (resolve) => require(['@/views/dashboard'], resolve),
                meta: {
                    title: '首页1',
                    icon: 'home'
                }
            },
            {
                path: '/page1',
                name: 'Page1',
                component: BlankLayout,
                meta: {
                    title: '页面一',
                    icon: 'meh'
                },
                redirect: '/page1/page2',
                children: [
                    {
                        path: '/page1/page2',
                        name: 'Page2',
                        component: (resolve) => require(['@/views/dashboard/Page1'], resolve),
                        meta: {
                            title: '页面二',
                            icon: 'meh'
                        }
                    }
                ]
            },
            {
                path: '/page3',
                name: 'Page3',
                component: BlankLayout,
                meta: {
                    title: '页面三',
                    icon: 'meh'
                },
                redirect: '/page3/page4',
                children: [
                    {
                        path: '/page3/page4',
                        name: 'Page4',
                        component: (resolve) => require(['@/views/dashboard/Page2'], resolve),
                        meta: {
                            title: '页面四',
                            icon: 'meh'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/403',
        name: '403',
        component: (resolve) => require(['@/views/exception/403'], resolve),
        meta: { title: 'NotAuthorized' },
    },
    {
        path: '/404',
        name: '404',
        component: (resolve) => require(['@/views/exception/404'], resolve),
        meta: { title: 'NotFound'},
    },
    {
        path: '/500',
        name: '500',
        component: (resolve) => require(['@/views/exception/500'], resolve),
        meta: { title: 'ServerWrong'},
    },
    //以上路由均不匹配则重定向入404页面
    {
        path: '*',
        redirect: "/404"
    }
]
