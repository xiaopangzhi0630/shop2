import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'

import Welcome from '@/components/welcome.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
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
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
      }
    ]
    }
  ]
})
