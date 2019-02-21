<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
        <el-alert :closable="false" class="alert" title="注意:只允许为第三级分类设置参数" type="warning" show-icon></el-alert>
        <!-- 级联    -->
        <el-form class="form" label-position="left" label-width="120px" :model="form">
            <el-form-item label="请选择商品分类">
                <el-cascader clearable expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange" :props="defaultProp">
                </el-cascader>
            </el-form-item>
        </el-form>
        <!-- tab -->
        <el-tabs v-model="active" @tab-click="changeTab()">
            <el-tab-pane label="动态参数" name="1">
                <el-button disabled> 设置动态参数</el-button>

                <el-table height="260px" :data="arrDy" style="width: 100%" border>
                    <el-table-column type="expand" width="80">
                        <template slot-scope="scope">
                            <!-- scope.row就是外层的arrDy -->
                            <el-tag :key="i" v-for="(attr,i) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row,attr)">
                                {{attr}}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="(handleInputConfirm(scope.row))" @blur="(handleInputConfirm(scope.row))">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#" width="80"></el-table-column>
                    <el-table-column prop="attr_name" label="属性名称" width="300"></el-table-column>

                    <el-table-column label="操作" width="605">
                        <!-- size="mini"设置图标大小 plain 设置素朴 -->
                        <template slot-scope="scope">
                            <el-button @click="showDiaEditUser(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                            <el-button @click="showMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="静态参数" name="2">
                <el-button disabled> 设置静态参数</el-button>
                <el-table height="250px" :data="arrStatic" style="width: 100%" border>

                    <el-table-column type="index" label="#" width="80"></el-table-column>
                    <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
                    <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>
                    <el-table-column label="操作" width="">
                        <!-- size="mini"设置图标大小 plain 设置素朴 -->
                        <template slot-scope="scope">
                            <el-button @click="showDiaEditUser(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                            <el-button @click="showMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-tab-pane>

        </el-tabs>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      form: {},
      // 级联相关数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
      },
      // 动态参数
      arrDy: [],
      arrStatic: [],
      //   tag相关数据
      // dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getCategory();
  },
  methods: {
    // 删除参数
    async handleClose(item, attr) {
      item.attr_vals.splice(item.attr_vals.indexOf(attr), 1);
      //  put请求->1. 找到要修改的数据 2. 新数据->请求体
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
        // 请求体
        {
          attr_name: item.attr_name,
          attr_sel: "many",
          attr_vals: item.attr_vals.join(",")
        }
      );
      //  console.log(res);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 添加参数
    async handleInputConfirm(item) {
      let inputValue = this.inputValue;
      if (inputValue) {
        // 往数组中推送
        item.attr_vals.push(inputValue);
        //  添加参数    发送请求
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
          // 请求体
          {
            attr_name: item.attr_name,
            attr_sel: "many",
            attr_vals: item.attr_vals.join(",")
          }
        );
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    // tab切换
    changeTab() {
      this.getDyOrStatic();
    },
    // 级联变化分类变化
    handleChange() {
      this.getDyOrStatic();
    },

    // 封装函数 获取动态数据 / 静态数据
    async getDyOrStatic() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请先选择三级分类");
        //   级联清除时,清空数组
        if (this.selectedOptions.length === 0) {
          if (this.active === "1") {
            this.arrDy = [];
          }
          if (this.active === "2") {
            this.arrStatic = [];
          }
        }
        return;
      }
      if (this.active === "1") {
        // 获取动态数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        const { data, meta: { msg, status } } = res.data;
        if (status === 200) {
          this.arrDy = data;
          // 遍历this.arrDy中的attr_vals
          this.arrDy.forEach(item => {
            // item.attr_vals = item.attr_vals.trim().split(",");  返回结果可能是空数组, 需要通过长度进行判断
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
          console.log(this.arrDy);
        }
      }

      if (this.active === "2") {
        // 获取静态数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log(res);
        const { data, meta: { msg, status } } = res.data;
        if (status === 200) {
          this.arrStatic = data;
          // console.log(this.arrStatic);
        }
      }
    },

    // 获取级联的商品数据
    async getCategory() {
      const res = await this.$http.get(`categories?type=3`);
      //   console.log(res);
      const { data, meta: { msg, status } } = res.data;
      if (status === 200) {
        this.options = data;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
/* .tab {
  height: 450px;
  overflow: auto;
} */
</style>
