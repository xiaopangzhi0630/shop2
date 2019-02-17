
// axios不是vue的插件, 把axios封装成vue的插件
// 在mian.js 中使用插件 , Vue.use(axios)

import axios from 'axios';

// 对象可以动态添加属性 所以设置一个对象, 添加属性install
const httpServer = {};

// 封装的代码
httpServer.install = function (Vue) {

    // 设置接口的基准地址
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

    // 除了登录才需要设置请求头,设置token
    // 登录的响应req和其他请求req一样
    // 拦截->axios拦截请求


    // 设置请求头的token
    const AUTH_TOKEN = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

    // 4. 添加实例方法
    Vue.prototype.$http = axios;

}
// 导出
export default httpServer;