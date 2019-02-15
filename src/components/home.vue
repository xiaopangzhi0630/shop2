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
                    <a href="#" class="loginOut">退出</a>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside class="aside" width="200px">Aside</el-aside>
            <el-main class="mian">Main</el-main>
        </el-container>
   </el-container>
</template>

<script>
export default {};
</script>

<style>
.container {
  height: 100%;
  background-color: #b3c0d1;
}
.aside {
  background-color: yellow;
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
