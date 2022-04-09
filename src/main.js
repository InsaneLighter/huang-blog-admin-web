import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './router/router-permission'
import store from './store'

//引入ant design vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd)

//设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
