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
    <!-- 外表添加form表签  最后提交需要获取表单元素 -->
    <el-form class="form" label-position="top" label-width="80px" :model="formdata">
      <!-- tab标签 -->
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
          <el-form-item :label="item.attr_name" v-for="(item) in arrDy" :key="item.attr_id">
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
            <!--
              1. 必须全路径 (之前baseURL->axios请求)
              2. 必须授权(之前axios的API设置的headers)
            -->
            <el-upload multiple :headers="headers" action="http://localhost:8888/api/private/v1/upload" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <el-button @click="addGoods()">添加商品</el-button>
            <quill-editor v-model="formdata.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>

</template>

<script>
// 局部引入富文本依赖
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  // 富文本设置components
  components: {
    quillEditor
  },
  data() {
    return {
      //  active: "1", 默认显示页面的设置
      active: "1",
      // 添加商品请求时的请求体
      // goods_name	商品名称	不能为空
      // goods_price	价格	不能为空
      // goods_number	数量	不能为空
      // goods_weight	重量	不能为空
      // goods_introduce	介绍	可以为空
      formdata: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        // pics	上传的图片临时路径（对象）{pic:?临时路径}	可以为空
        // attrs	商品的参数（数组）	可以为空 [{attr_id:?,attr_value:?}]来源于arrDy和arrStatic
        pics: [],
        attrs: []
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
      // 上传图片设置请求头
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getCategory();
  },

  methods: {
    // 添加商品
    async addGoods() {
      // goods_cat	以为','分割的分类列表[1,3,6]	不能为空
      this.formdata.goods_cat = this.selectedOptions.join(",");
      // pics	上传的图片临时路径（对象）{pic:?临时路径}	可以为空
      // attrs	商品的参数（数组）	可以为空 [{attr_id:?,attr_value:?}]来源于arrDy和arrStatic
      //  动态处理数据
      // const obj1 = { attr_id: "", attr_value: "" };
      // const arr1 = [];
      // this.arrDy.forEach(item => {
      //   obj1.attr_id = item.attr_id;
      //   obj1.attr_value = item.attr_vals;
      //   arr1.push(obj1);
      // });
      const arr1 = this.arrDy.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // console.log(arr1);
      // 获取静态数据
      const arr2 = this.arrStatic.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // console.log(arr2);
      this.formdata.attrs = [...arr1, ...arr2];

      // console.log(this.formdata.attrs);

      // 发送请求
      const res = await this.$http.post(`goods`, this.formdata);
      // console.log(res);
      const { data, meta: { msg, status } } = res.data;
      if (status === 201) {
        this.$router.push({
          name: "goods"
        });
      } else {
        // http.js中统一处理拦截器
        // this.$message.error(msg);
      }
    },
    // 假   上传图片
    handleSuccess(response, file, fileList) {
      // console.log("上传成功");
      // 上传临时路径
      // console.log(response.data.tmp_path);
      const tmpPath = response.data.tmp_path;
      this.formdata.pics.push({
        pic: tmpPath
      });
    },
    // 删除图片
    handleRemove(file, fileList) {
      // console.log("删除成功");
      // console.log(file);
      // console.log(file.response.data.tmp_path);
      // file.response.data.tmp_path
      // 1. 找数组中符合条件的索引
      // 2. 条件->当前选中图片tem_path和数组中某个元素的{pic:}的路径一样
      // 3. 返回索引
      const Index = this.formdata.pics.map(item => {
        return item.pic === file.response.data.tmp_path;
      });
      // 找下标 findIndex(ES6)
      // const Index = this.formdata.pics.findIndex(item => {
      //   return item.pic === file.response.data.tmp_path;
      // });
      this.formdata.pics.splice(Index, 1);
    },

    // tab别选中是触发
    async changeTab() {
      // 先判断是不是active为2, 并且是三级商品  满足条件发送请求
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级商品!");
          if (this.active === "2") {
            this.arrDy = [];
          } else {
            this.arrStatic = [];
          }
          return;
        }
        // 处理动态数据 sel=many
        if (this.active === "2") {
          // 判断
          // if(this.arrDy.length === 0 ){

          // }
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          // console.log(res);
          const { data, meta: { msg, status } } = res.data;
          if (status === 200) {
            // 判断是否发生\改变
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
            // console.log(this.arrStatic);
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
/* 不懂,什么意思 */
.ql-editor,
.ql-blank {
  min-height: 160px;
}
</style>
