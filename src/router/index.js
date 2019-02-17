import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'

import Welcome from '@/components/welcome.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
// import Orders from '@/components/orders.vue'

Vue.use(Router)

export default new Router({
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
