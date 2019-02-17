<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
        <!-- 添加按钮 -->
        <el-button type="primary" class="addRoles">添加角色</el-button>

        <!-- 表格
        roleName	角色名称	不能为空
        roleDesc	角色描述	可以为空 -->
        <el-table :data="list" style="width: 100%">
            <el-table-column type="index" label="#" width="80"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="150"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>

            <el-table-column label="操作" width="180">
                <!-- size="mini"设置图标大小 plain 设置素朴 -->
                <template slot-scope="scope">
                    <el-button @click="showDiaEditUser(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button @click="showMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button @click="showDiaSetRole(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>
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
    this.getTableRoles();
  },
  methods: {
    async getTableRoles() {
      const res = await this.$http.get(`roles`);
      console.log(res);
      const { data, meta: { msg, status } } = res.data;
      this.list = data;
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.addRoles {
  margin-top: 16px;
}
</style>
