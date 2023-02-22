import Layout from '@/components/layouts/Layout'
import BlankLayout from '@/components/layouts/global/BlankLayout'

export const routerMap = [
    {
        path: '/login',
        name: 'Login',
        component: (resolve) => require(['@/views/user/Login'], resolve),
        meta: {
            title: '仪表盘',
            icon: 'meh',
            hideHead: false
        }
    },
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
                        component: (resolve) => require(['@/views/doc/CreateOrEditPage'], resolve),
                        meta: {
                            title: '写文章',
                            icon: 'meh',
                            hideHead: true
                        }
                    },
                    {
                        path: '/doc/category',
                        name: 'Category',
                        component: (resolve) => require(['@/views/doc/CategoryList'], resolve),
                        meta: {
                            title: '分类',
                            icon: 'meh',
                            hideHead: false
                        }
                    },
                    {
                        path: '/doc/tag',
                        name: 'Tag',
                        component: (resolve) => require(['@/views/doc/TagList'], resolve),
                        meta: {
                            title: '标签',
                            icon: 'meh',
                            hideHead: false
                        }
                    }
                ]
            },
            {
                path: '/journal',
                name: 'Journal',
                component: (resolve) => require(['@/views/journal/Journal'], resolve),
                meta: {
                    title: '日记',
                    icon: 'meh',
                    hideHead: false
                }
            },
            {
                path: '/comment',
                name: 'Comment',
                component: (resolve) => require(['@/views/comment/Comment'], resolve),
                meta: {
                    title: '评论',
                    icon: 'meh',
                    hideHead: false
                }
            },
            {
                path: '/attachment',
                name: 'Attachment',
                component: (resolve) => require(['@/views/attachment/AttachmentList'], resolve),
                meta: {
                    title: '附件',
                    icon: 'meh',
                    hideHead: false
                }
            },
            {
                path: '/user',
                name: 'User',
                component: BlankLayout,
                redirect: '/user/profile',
                meta: {
                    title: '用户',
                    icon: 'meh',
                    hideHead: false
                },
                children: [
                    {
                        path: '/user/profile',
                        name: 'Profile',
                        component: (resolve) => require(['@/views/user/Profile'], resolve),
                        meta: {
                            title: '个人中心',
                            icon: 'meh',
                            hideHead: false
                        }
                    },
                    {
                        path: '/user/online',
                        name: 'Online',
                        component: (resolve) => require(['@/views/user/OnlineUserList'], resolve),
                        meta: {
                            title: '在线用户',
                            icon: 'meh',
                            hideHead: false
                        }
                    },
                    {
                        path: '/user/list',
                        name: 'Users',
                        component: (resolve) => require(['@/views/user/UserList'], resolve),
                        meta: {
                            title: '用户列表',
                            icon: 'meh',
                            hideHead: false
                        }
                    }
                ]
            },
            {
                path: '/settings',
                name: 'Settings',
                component: (resolve) => require(['@/views/settings/Settings.vue'], resolve),
                meta: {
                    title: '内容设置',
                    icon: 'meh',
                    hideHead: false
                }
            },
            {
                path: '/monitor',
                name: 'Monitor',
                component: BlankLayout,
                meta: {
                    title: '监控',
                    icon: 'meh'
                },
                redirect: '/monitor/httpTrace',
                children: [
                    {
                        path: '/monitor/httpTrace',
                        name: 'HttpTrace',
                        component: (resolve) => require(['@/views/monitor/CustomizedHttpTrace'], resolve),
                        meta: {
                            title: '请求追踪',
                            icon: 'meh',
                            hideHead: false
                        }
                    },
                    {
                        path: '/monitor/system',
                        name: 'System',
                        component: (resolve) => require(['@/views/monitor/SystemInfo'], resolve),
                        meta: {
                            title: '系统监控',
                            icon: 'meh',
                            hideHead: false
                        }
                    },
                    {
                        path: '/monitor/tomcat',
                        name: 'Tomcat',
                        component: (resolve) => require(['@/views/monitor/TomcatInfo'], resolve),
                        meta: {
                            title: 'Tomcat监控',
                            icon: 'meh',
                            hideHead: false
                        }
                    },
                    {
                        path: '/monitor/jvm',
                        name: 'JVM',
                        component: (resolve) => require(['@/views/monitor/JvmInfo'], resolve),
                        meta: {
                            title: 'JVM监控',
                            icon: 'meh',
                            hideHead: false
                        }
                    },
                    {
                        path: '/monitor/sql',
                        name: 'SQL',
                        component: (resolve) => require(['@/components/layouts/global/IframePageView'], resolve),
                        meta: {
                            title: 'SQL监控',
                            icon: 'meh',
                            hideHead: false,
                            url: 'https://huanghong.top/api/druid/behind/'
                        }
                    },
                    {
                        path: '/monitor/redis',
                        name: 'Redis',
                        component: (resolve) => require(['@/views/monitor/RedisInfo'], resolve),
                        meta: {
                            title: 'Redis监控',
                            icon: 'meh',
                            hideHead: false
                        }
                    },
                    {
                        path: '/monitor/disk',
                        name: 'Disk',
                        component: (resolve) => require(['@/views/monitor/DiskMonitoring'], resolve),
                        meta: {
                            title: 'Disk监控',
                            icon: 'meh',
                            hideHead: false
                        }
                    }
                ]
            },
            {
                path: '/mail',
                name: 'Mail',
                component: (resolve) => require(['@/views/mail/SendMail'], resolve),
                meta: {
                    title: '邮件',
                    icon: 'meh',
                    hideHead: false
                }
            }
        ]
    },
    {
        path: '/403',
        name: '403',
        component: (resolve) => require(['@/views/exception/403'], resolve),
        meta: {title: 'NotAuthorized'}
    },
    {
        path: '/404',
        name: '404',
        component: (resolve) => require(['@/views/exception/404'], resolve),
        meta: {title: 'NotFound'}
    },
    {
        path: '/500',
        name: '500',
        component: (resolve) => require(['@/views/exception/500'], resolve),
        meta: {title: 'ServerWrong'}
    },
    //以上路由均不匹配则重定向入404页面
    {
        path: '*',
        redirect: "/404"
    }
]
