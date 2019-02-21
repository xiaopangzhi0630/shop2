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

          <el-row class="level1" v-for="(item) in scope.row.children" :key="item.id">
            <el-col :span="4">
              <el-tag @close="deleteRights(scope.row,item)" type="success" closable>{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="(item1) in item.children" :key="item1.id">
                <el-col :span="5">
                  <el-tag @close="deleteRights(scope.row,item1)" type="warning" closable>{{item1.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <!-- <el-row> -->
                  <el-tag @close="deleteRights(scope.row,item2)" type="danger" class="level3" closable v-for="(item2,i) in item1.children" :key="item2.id">
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

    <!-- 对话框  权限分配 -->

    <el-dialog title="权限分配" :visible.sync="dialogFormVisible">
      <el-tree ref="treeDom" :data="treedata" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrCheck" :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogFormVisible: false,
      // 树形结构绑定的数据
      treedata: [],
      // 默认展开的节点(被展开节点的id)   HTML中删除:default-expanded-keys="arrExpand"属性
      // arrExpand: [],
      // 默认选中的节点(被选中节点的id)
      arrCheck: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      // 当前角色id
      currRoleId: -1
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 更改权限
    async setRights() {
      // 在js中调用组件标签的js方法  -> ref操作dom
      // 1. 给要操作的页面元素el-tree设置ref="值"
      // 2. 在js中通过this.$refs.ref的值.js方法
      // 获取半选节点组成的数组
      const arr1 = this.$refs.treeDom.getHalfCheckedKeys();
      // console.log(arr1);
      // 获取全选节点组成的数组
      const arr2 = this.$refs.treeDom.getCheckedKeys();
      // console.log(arr2);
      // ES6 展开操作运算符
      const arr = [...arr1, ...arr2];
      // 发送请求
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      // console.log(res);
      const { data, meta: { msg, status } } = res.data;
      if (status === 200) {
        this.dialogFormVisible = false;
        // 刷新列表
        this.getRoles();
        this.$message.success("权限修改成功!");
      }
    },
    // 点击显示权限设置
    async showDiaSetRights(role) {
      // 设置角色id,后面提交会使用
      this.currRoleId = role.id;
      this.dialogFormVisible = true;
      // 发送请求获取所有权限
      const res = await this.$http.get(`rights/tree`);
      // console.log(res.data.data);
      const { data, meta: { msg, status } } = res.data;
      if (status === 200) {
        this.treedata = data;
      }
      // 获取当前角色的已有的权限
      const temp = [];
      role.children.forEach(item1 => {
        // temp.push(item1.id);
        item1.children.forEach(item2 => {
          // temp.push(item2.id);
          item2.children.forEach(item3 => {
            temp.push(item3.id);
          });
        });
      });
      // console.log(temp);
      this.arrCheck = temp;
    },
    // 删除角色
    async deleteRights(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      const { data, meta: { msg, status } } = res.data;
      if (status === 200) {
        // 提示信息
        this.$message.success("删除权限成功!");
        // 刷新数据
        role.children = data;
        // console.log(role);
        // console.log(role.children);
      }
    },
    // 获取角色
    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const { data, meta: { msg, status } } = res.data;
      this.roles = data;
      // console.log(this.roles);
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