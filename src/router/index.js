import Vue from 'vue'
import VueRouter from 'vue-router'
import {routerMap} from './routerMap'

Vue.use(VueRouter)

const router = new VueRouter({
  // 路由页面不会刷新 url中包含#
  // mode: 'hash',
  // 路由页面会刷新 url中包含# 后端异常会直接报错
  mode: 'history',
  // 页面跳转之后返回页面滚动重新置顶
  scrollBehavior: () => ({ y: 0 }),
  routes:routerMap
})

export default router
