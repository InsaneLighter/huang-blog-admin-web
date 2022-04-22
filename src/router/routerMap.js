import Layout from '@/components/layouts/Layout'
import BlankLayout from '@/components/layouts/global/BlankLayout'

export const routerMap = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        meta: {
            title: '首页'
        },
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: (resolve) => require(['@/views/dashboard'], resolve),
                meta: {
                    title: '仪表盘',
                    icon: 'meh',
                    hideHead: false
                }
            },
            {
                path: '/doc',
                name: 'Doc',
                component: BlankLayout,
                meta: {
                    title: '文章',
                    icon: 'meh'
                },
                redirect: '/doc/post',
                children: [
                    {
                        path: '/doc/post',
                        name: 'DocList',
                        component: (resolve) => require(['@/views/doc'], resolve),
                        meta: {
                            title: '所有文章',
                            icon: 'meh',
                            hideHead: false
                        }
                    },
                    {
                        path: '/doc/edit',
                        name: 'DocEdit',
                        component: (resolve) => require(['@/views/doc/edit'], resolve),
                        meta: {
                            title: '写文章',
                            icon: 'meh',
                            hideHead: true
                        }
                    },
                    {
                        path: '/doc/category',
                        name: 'DocCategory',
                        component: (resolve) => require(['@/views/doc/CategoryList'], resolve),
                        meta: {
                            title: '分类',
                            icon: 'meh',
                            hideHead: false
                        }
                    }
                ]
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
                    },
                    {
                        path: '/page1/page5',
                        name: 'Page5',
                        component: (resolve) => require(['@/views/dashboard/Page1'], resolve),
                        meta: {
                            title: '页面五',
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
        meta: { title: 'NotAuthorized' }
    },
    {
        path: '/404',
        name: '404',
        component: (resolve) => require(['@/views/exception/404'], resolve),
        meta: { title: 'NotFound'}
    },
    {
        path: '/500',
        name: '500',
        component: (resolve) => require(['@/views/exception/500'], resolve),
        meta: { title: 'ServerWrong'}
    },
    //以上路由均不匹配则重定向入404页面
    {
        path: '*',
        redirect: "/404"
    }
]
