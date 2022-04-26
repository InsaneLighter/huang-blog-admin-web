import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './router/router-permission'
import store from './store'
import './assets/css/global.css'

//ant design vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

//数据图形化显示
import Viser from 'viser-vue'

//md
import './utils/md'

//clipboard
import VueClipboard from 'vue-clipboard2'

import Contextmenu from 'vue-contextmenujs'


Vue.use(Antd)
Vue.use(Viser)
Vue.use(VueClipboard)
Vue.use(Contextmenu)

//设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
