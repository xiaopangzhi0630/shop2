// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/base.css'
import App from './App'
import CusBread from './components/cusBread.vue'  
import router from './router'
import moment from 'moment'

import httpServer from './assets/js/http.js'


// import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// const AUTH_TOKEN = localStorage.getItem("token");
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// Vue.prototype.$http = axios


// 和vuerouter一样, 挂载使用
// 使用Vue插件
Vue.use(ELEMENT)
Vue.use(httpServer)


Vue.config.productionTip = false

// 全局自定义组件
Vue.component(CusBread.name, CusBread)


// 全局过滤器, 处理日期
Vue.filter('formdata', (v) => {
  return moment(v).format("YYYY-MM-DD")
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
