<template>

  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <!-- 提示消息 -->
    <el-alert class="middleMsg" title="添加商品信息" type="info" center show-icon :closable="false">
    </el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active*1" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- tab标签 -->
    <el-form class="form" label-position="top" label-width="80px" :model="formdata">
      <el-tabs v-model="active" tab-position="left" @tab-click="changeTab()">
        <el-tab-pane label="商品参数" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="formdata.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="formdata.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="formdata.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="formdata.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联  selectedOptions保存的是cat_level的值
            options 数据源
            selectedOptions[] 可以给默认值,当选择 label 时,[被选择的 label 的 value 中]
            props 配置选项 label/value/children->来源于 options 数据源 key 名 和 el-tree 很像-->
            {{selectedOptions}}
            <el-cascader clearable expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange" :props="defaultProp">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="基本信息" name="2">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrDy" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border :label="item1" v-for="(item1,i) in item.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item label="添加图片">
            <el-upload multiple :headers="headers" action="http://localhost:8888/api/private/v1/upload" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>

</template>

<script>
export default {
  data() {
    return {
      //  active: "1", 默认显示页面的设置
      active: "1",
      formdata: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: "",
        attrs: ""
      },
      // 级联相关数据   options数据源
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
        // children: "children"
      },
      // 选中的参数  attr_vals
      // checkList: [],

      // 动态数据
      arrDy: [],
      // 处理静态数据
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getCategory();
  },

  methods: {
    // 假上传
    handleSuccess(response, file, fileList) {
      console.log("上传成功");
      // 上传临时路劲
      // response.data.tmp_path
      // console.log(response);
      // console.log(response.data.tmp_path);
    },
    // 删除
    handleRemove(file, fileList) {
      console.log("删除成功");
      // console.log(file);
      // console.log(file.response.data.tmp_path);
      // file.response.data.tmp_path
    },

    // tab别选中是触发
    async changeTab() {
      // 先判断是不是active为2, 并且是三级商品  满足条件发送请求
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级商品!");
          return;
        }
        // 处理动态数据 sel=many
        if (this.active === "2") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          // console.log(res);
          const { data, meta: { msg, status } } = res.data;

          if (status === 200) {
            this.arrDy = data;

            // 遍历this.arrDy中的attr_vals
            this.arrDy.forEach(item => {
              // item.attr_vals = item.attr_vals.trim().split(",");
              // 返回结果可能是空数组, 需要通过长度进行判断
              item.attr_vals =
                item.attr_vals.trim().length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
            });

            // console.log(this.arrDy);
          }
        }

        // 处理静态数据 sel=only
        if (this.active === "3") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          // console.log(res);
          const { data, meta: { msg, status } } = res.data;
          if (status === 200) {
            this.arrStatic = data;
            console.log(this.arrStatic);
          }
        }
      }
    },

    // 获取三级联动的商品数据
    async getCategory() {
      const res = await this.$http.get(`categories?type=3`);
      // const res1 = await this.$http.get(`categories`)
      // const res2 = await this.$http.get(`categories?type=1`)
      const { data, meta: { msg, status } } = res.data;

      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
    },

    handleChange() {}
  }
};
</script>

<style>
.box {
  height: 100%;
}
.middleMsg {
  margin-top: 16px;
  margin-bottom: 16px;
}
.el-step__title {
  font-size: 14px;
}
.form {
  height: 300px;
  overflow: auto;
}
</style>
