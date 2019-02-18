<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <!-- 添加按钮 -->
    <el-button type="primary" class="addRoles">添加角色</el-button>

    <!-- 表格
        roleName	角色名称	不能为空
        roleDesc	角色描述	可以为空 -->
    <el-table height="400px" :data="roles" style="width: 100%">
      <!-- 展开项 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 行列 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-span>未设置权限</el-span>
          </el-row>
          
          <!--  el-row>(el-col>el-tag+el-col>el-row>(el-col>el-tag+el-col>el-tag))-->
          <el-row class="level1" v-for="(item,i) in scope.row.children" :key="item.id">
            <el-col :span="4">
              <el-tag type="success" closable>{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="(item1,i) in item.children" :key="item1.id">
                <el-col :span="5">
                  <el-tag type="warning" closable>{{item1.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <!-- <el-row> -->
                  <el-tag type="danger" class="level3" closable v-for="(item2,i) in item1.children" :key="item2.id">
                    {{item2.authName}}
                  </el-tag>
                  <!-- </el-row> -->
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="250"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="250"></el-table-column>

      <el-table-column label="操作" width="180">
        <!-- size="mini"设置图标大小 plain 设置素朴 -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button @click="showDiaSetRights(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 点击显示权限设置
    showDiaSetRights() {},

    // 获取角色
    async getRoles() {
      const res = await this.$http.get(`roles`);
      console.log(res);
      const { data, meta: { msg, status } } = res.data;
      this.roles = data;
      console.log(this.roles);
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
.level1,
.level2 {
  margin-bottom: 10px;
}
/* .level3{
  margin-left:10px; 
} */
</style>
