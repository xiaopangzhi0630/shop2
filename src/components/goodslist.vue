<template>
  <el-card class="box-card">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>

    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input v-model="query" class="searchInput" clearable placeholder="请输入内容" @clear="getAllData()">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="$router.push({name:'goodsadd'})" type="success" plain>添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="450px" border stripe :data="list" style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="index"></el-table-column>

      <el-table-column prop="goods_name" label="商品名称"></el-table-column>

      <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>

      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>

      <!-- 格式化日期 -->
      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">
          {{scope.row.add_time|formdata}}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="showMsgBox(scope.row)" plain size="mini" type="danger " icon="el-icon-delete " circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page="pagenum " :page-sizes="[10, 20, 30, 40] " :page-size="pagesize " layout="total, sizes, prev, pager, next, jumper " :total="total "></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      // loading: false,
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 搜索功能
    handleSearch() {
      this.pagenum = 1;
      this.loadData();
    },
    // 点击x号触发
    getAllData() {
      this.loadData();
    },

    // 显示删除框
    showMsgBox(user) {
      console.log(user);

      this.$confirm("are you sure delete?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除请求goods/:id
          const res = await this.$http.delete(`goods/${user.goods_id}`);
          console.log(res);
          const { meta: { msg, status } } = res.data;
          if (status === 200) {
            this.loadData();
          }

          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.loadData();
    },
    // 获取数据
    async loadData() {
      const { data: resData } = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      this.total = resData.data.total;
      this.list = resData.data.goods;
      // console.log(this.list)
    }
  }
};
</script>

<style>
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
