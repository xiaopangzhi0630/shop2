<template>
  <el-card>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchBox">
      <el-col>
        <!-- clearable可以出现清空符号  @clear 清空内容触发事件-->
        <el-input @clear="getAllUser()" clearable placeholder="请输入内容" v-model="query" class="searchInput">
          <!-- 注册搜索事件 和 清空搜索框事件 -->
          <el-button @click.prevent="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click.prevent="showDiaAddUser()" type="primary">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="150"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="150"></el-table-column>
      <!-- 过滤器格式化日期 -->
      <el-table-column label="创建日期" width="150">
        <!-- 内层 list.row 表示的是list的每个对象-->
        <template slot-scope="scope">
          {{scope.row.create_time|formdata}}
        </template>
      </el-table-column>
      <!-- 前提: 单元格内容是一个组件, 不是porp的值 -->
      <el-table-column label="用户状态" width="150">
        <!-- 内层 list.row 表示的是list的每个对象-->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <!-- size="mini"设置图标大小 plain 设置素朴 -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @size-change每页条数改变时触发 
     @current-change 原来是第一页,点击 2 页
     current-page 当前页码 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 对话框  添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleAdd = false">确 定</el-button>
      </div>
    </el-dialog>
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
      pagesize: 2,
      // 总条数
      total: 1,
      // 添加用户隐藏属性设置
      dialogFormVisibleAdd: false,
      // 添加用户数据
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },

      list: []
    };
  },
  //   mounted() 页面加载完成自动调用
  created() {
    this.gitTableData();
  },
  methods: {
    //  添加用户
    showDiaAddUser() {
      this.dialogFormVisibleAdd = true;
    },

    //  搜索框清空触发
    getAllUser() {
      this.gitTableData();
    },

    // 搜索查询
    searchUser() {
      this.pagenum = 1;
      this.gitTableData();
    },

    // 分页相关
    // @size-change每页条数改变时触发
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.gitTableData();
    },
    // @current-change 原来是第一页,点击 2 页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.gitTableData();
    },

    // 表格数据发送请求
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
        this.total = data.total;
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
