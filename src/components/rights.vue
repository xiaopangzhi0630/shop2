<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
        <!-- 表格 -->

        <!-- // id 权限 ID // authName 权限说明 // level 权限层级 // pid 权限父 ID // path 对应访问路径 -->
        <el-table height="450px" border stripe :data="list" style="width: 100%" class="tab">
            <el-table-column type="index" prop="id" label="#" width="100"></el-table-column>
            <el-table-column prop="authName" label="角色名称" width="320"></el-table-column>
            <el-table-column prop="path" label="路径" width="326"></el-table-column>
            <el-table-column prop="level" label="层级" width="320"></el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },

  created() {
    this.getTableData();
  },

  methods: {
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(`rights/list`);
      //
      const { data, meta: { msg, status } } = res.data;
      if (status === 200) {
        this.list = data;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
  box-sizing: border-box;
}
.tab {
  margin-top: 20px;
}
</style>
