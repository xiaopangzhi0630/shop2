<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="../assets/logo.png" alt="图片记载失败">
        </el-col>
        <el-col :span="19" class="middle">
          <h2 style="color:#fff">品优购后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a @click.prevent="handleLoginout()" href="#" class="loginOut">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- router 开启路由模式,点击对应的导航, 当前的path就是激活导航index的值 -->
        <el-menu default-active="1" :router="true" :unique-opened="true">
          <!-- 用户管理 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <!-- 权限管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <!-- 商品管理 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <!-- 订单管理 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <!-- 数据统计 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              数据列表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="mian">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 如果用户没有登录,不能进入home.vue页面, 显示login.vue
  // if(有没有正确的token)=>渲染homevue
  // if(没有token)修改标识/login, 显示渲染login.vue
  // 代码位置在mounted之前 ==>beforeMount   , beforeCreate 都可以
  beforeMount() {
    if (!localStorage.getItem("token")) {
      this.$router.push({
        name: "login"
      });
    }
  },
  methods: {
    // 退出
    handleLoginout() {
      // 1.清除token
      localStorage.clear()
      // 2 跳转至login页面
      this.$router.push({
        name:"login"
      })
      // 3. 提示信息
      this.$message.warning('退出成功!')
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  background-color: #b3c0d1;
}
.aside {
  background-color: #fff;
}
.mian {
  background-color: gray;
}
.loginOut {
  line-height: 60px;
  margin: 0 auto;
  text-decoration: none;
}
.middle {
  line-height: 60px;
  text-align: center;
}
</style>
