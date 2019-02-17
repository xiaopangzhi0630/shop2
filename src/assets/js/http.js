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

    // 添加请求拦截器
    axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        // 1. headers请求头   url 请求标识路径
        // console.log(config);
        // 当请求不是login的时候, 先设置请求头,然后在发起请求
        if (config.url !== 'login') {
            
            // 设置请求头的token
            const AUTH_TOKEN = localStorage.getItem("token");
            config.headers.common["Authorization"] = AUTH_TOKEN;
        }
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 4. 添加实例方法
    Vue.prototype.$http = axios;

}
// 导出
export default httpServer;