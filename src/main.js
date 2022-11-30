import Vue from 'vue'
import App from './App.vue'

import router from '@/router'
import axios from 'axios'
// import dayjs from 'dayjs'

// 配置element-ui
import ElementUI, { Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 配置代理进行跨域
// axios.defaults.baseURL = 'https://www.escook.cn'
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$http = axios
// Vue.prototype.$dayjs = dayjs
// 设置请求拦截器,开启loading
let loadingInstance = null
axios.interceptors.request.use(config => {
  loadingInstance = Loading.service({ fullscreen: true })
  return config
})
// 设置响应拦截器，关闭loading
axios.interceptors.response.use(response => {
  loadingInstance.close()
  return response
})

// 全局注册element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
  router
})

app.$mount('#app')
