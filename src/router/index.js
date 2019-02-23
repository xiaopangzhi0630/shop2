import Vue from 'vue'
import VueRouter from 'vue-router'

import { Message } from 'element-ui'


// 路由懒加载
// const Foo = () => import('./Foo.vue')

const Login = () => import('@/components/login.vue')
const Home = () => import('@/components/home.vue')
const Welcome = () => import('@/components/welcome.vue')
const Users = () => import('@/components/users.vue')
const Rights = () => import('@/components/rights.vue')
const Roles = () => import('@/components/roles.vue')
const Goodslist = () => import('@/components/goodslist.vue')
const Goodsadd = () => import('@/components/goodsadd.vue')
const Cateparams = () => import('@/components/params.vue')
const Goodscate = () => import('@/components/goodscate.vue')
const Orders = () => import('@/components/order.vue')
const Reports = () => import('@/components/reports.vue')



Vue.use(VueRouter)

const router = new VueRouter({
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
          // 商品列表
          name: 'goods',
          path: '/goods',
          component: Goodslist
        },
        {
          // 添加商品
          name: 'goodsadd',
          path: '/goodsadd',
          component: Goodsadd
        },
        {
          // 分类参数
          name: 'params',
          path: '/params',
          component: Cateparams
        },
        {
          // 商品分类
          name: 'categories',
          path: '/categories',
          component: Goodscate
        }
        ,
        {
          // 订单列表
          name: 'orders',
          path: '/orders',
          component: Orders
        }
        ,
        {
          // 订单列表
          name: 'reports',
          path: '/reports',
          component: Reports
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