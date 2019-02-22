<template>
    <el-card class="box">
        <cus-bread level1="订单管理" level2="订单列表"></cus-bread>

        <el-table height="450px" :data="list" style="width: 100%">
            <el-table-column type="index" label="#" width="40"></el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="200"></el-table-column>
            <el-table-column prop="order_price" label="订单价格"></el-table-column>
            <el-table-column prop="order_pay" label="是否付款" width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
                    <el-tag type="danger" v-if="scope.row.order_pay==='1'">未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
            <el-table-column label="下单时间" width="100">
                <template slot-scope="scope">{{scope.row.create_time|formdata}}</template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5,10,15]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 对话框 -->
        <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="省市区" label-width="120px">
                    <el-cascader expand-trigger="hover" clearable :options="catlist" v-model="selectedOptions"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" label-width="120px">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

    </el-card>
</template>

<script>
// 引入省市
import Catlist from "../assets/js/city_data2017_element.js";

export default {
  data() {
    return {
      list: [],
      dialogFormVisible: false,
      form: {
        address: ""
      },
      // 级联选择器要绑定的数据
      catlist: [],
      selectedOptions: [],
      // defaultProp:{
      //   value:"value",
      //   label:"label",
      //   children:"children"
      // },
      //  当前分页
      currentPage: 1,
      pageSize: 5,
      total: -1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //   分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    //   当前页的信息
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);

      this.currentPage = val;
      this.getData();
    },
    // 获取表格数据
    async getData() {
      const res = await this.$http.get(
        `orders?pagenum=${this.currentPage}&pagesize=${this.pageSize}`
      );
      //   const res = await this.$http.get(`orders`);
      console.log(res);
      this.list = res.data.data.goods;
      this.total = res.data.data.total;
    },
    // 打开对话框
    showEditdia(newOrders) {
      this.dialogFormVisible = true;
      this.catlist = Catlist;
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>
