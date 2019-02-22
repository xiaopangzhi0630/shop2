<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="4">
          <img @click.prevent="backHome()" src="../assets/upload/timg.png" alt="图片记载失败">
          <!-- <img src="../assets/timg.png" alt="图片记载失败"> -->
        </el-col>
        <el-col :span="17" class="middle">
          <h2 style="color:#fff">品优购后台管理系统</h2>
        </el-col>
        <el-col :span="3">
          欢迎 {{loginUser}},
          <a @click.prevent="handleLoginout()" href="#" class="loginOut">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- router 开启路由模式,点击对应的导航, 当前的path就是激活导航index的值 -->
        <!-- $route.name获取最后一次的路由, default-active默认激活 -->
        <el-menu :default-active="$route.name" :router="true" :unique-opened="true">
          <!-- 用户管理  -->
          <el-submenu :index="item1.order+''" v-for="(item1,i) in menus" :key="i">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path+''" v-for="(item2,i) in item1.children" :key="i">
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main class="mian">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: [],
      loginUser: localStorage.getItem("logigUserName")
    };
  },

  // 如果用户没有登录,不能进入home.vue页面, 显示login.vue
  // if(有没有正确的token)=>渲染homevue
  // if(没有token)修改标识/login, 显示渲染login.vue
  // 代码位置在mounted之前 ==>beforeMount   , beforeCreate 都可以
  // beforeMount() {
  //   if (!localStorage.getItem("token")) {
  //     this.$router.push({
  //       name: "login"
  //     });
  //   }
  // },
  created() {
    this.getMenus();
  },
  methods: {
    // 动态获取目录
    async getMenus() {
      const res = await this.$http.get(`menus`);
      // console.log(res.data.data);
      const { data, meta: { msg, status } } = res.data;
      if (status === 200) {
        this.menus = data;
      }
    },

    // 返回首页
    backHome() {
      this.$router.push({
        name: "welcome"
      });
    },

    // 退出
    handleLoginout() {
      // 1.清除token
      localStorage.clear();
      // 2 跳转至login页面
      this.$router.push({
        name: "login"
      });
      // 3. 提示信息
      this.$message.warning("退出成功!");
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
  background-color: #eee;
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
img {
  width: 256px;
  height: 60px;
}
</style>
