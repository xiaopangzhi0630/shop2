import Vue from 'vue'
import Router from 'vue-router'

import { Message } from 'element-ui';

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'

import Welcome from '@/components/welcome.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
// import Orders from '@/components/orders.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // 登录页
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      // 首页
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          name: 'welcome',
          path: '/welcome',
          component: Welcome
        },
        {
          // 用户列表
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          // 权限列表
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          // 角色列表
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          // 订单
          name: 'orders',
          path: '/orders',
          // component: Orders
        },
        {
          // 统计数据
          name: 'reports',
          path: '/reports',
          // component: Reports
        }
      ]
    }
  ]
})

// 路由导航卫士
// 在路由配置生效前,代码自动来到下面位置
// to 要去的路由配置对象
// from 当前的路由配置对象
router.beforeEach((to, from, next) => {
  // 登录则继续执行
  if (to.name === "login") {
    next()
  } else {
    // 不是登录则执行  先获取token
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录用户');
      // 返回登登录
      router.push({
        name: "login"
      })
      return;
    }
    // 如果有token 则跳转至home
    next();
  }
})


export default router;