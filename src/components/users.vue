<template>
    <el-card>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <el-row class="searchBox">
            <el-col>
                <el-input placeholder="请输入内容" v-model="query" class="searchInput">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="primary">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="id" label="#" width="80"></el-table-column>
            <el-table-column prop="username" label="姓名" width="150"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="150"></el-table-column>

            <el-table-column prop="create_time" label="创建日期" width="150"></el-table-column>
            <el-table-column prop="mg_state" label="用户状态" width="150"></el-table-column>
            <el-table-column prop="date" label="操作" width="180"></el-table-column>
        </el-table>

        <!-- 分页 -->
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 查询用户关键字
      query: "",
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 10,
      list: []
    };
  },
  //   mounted() 页面加载完成自动调用
  created() {
    this.gitTableData();
  },
  methods: {
    async gitTableData() {
      // 设置发送请求时的请求头-> axios库 ->找axios中有没有可以设置headers头部的API->看axios文档
      const AUTH_TOKEN = localStorage.getItem("token");
      //   console.log(AUTH_TOKEN);

      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);

      const { data, meta: { msg, status } } = res.data;
      if (status == 200) {
        this.list = data.users;
      }
    }
  }
};
</script>

<style>
.searchInput {
  width: 360px;
}
.searchBox {
  margin-top: 20px;
}
</style>
