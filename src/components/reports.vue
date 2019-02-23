<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="数据统计" level2="数据报表"></cus-bread>

        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div class="echartsBox" id="main" style="width: 900px;height:400px;"></div>

    </el-card>
</template>

<script>
// 第一步
import echarts from "echarts";

export default {
  data() {
    return {};
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    async initEcharts() {
      //  第二步   基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById("main"));

      // 发送请求获取后台数据

      const res = await this.$http.get(`reports/type/1`);

      //   console.log(res);
      const option1 = res.data.data;

      //  第三步 绘制图表
      const option2 = {
        title: {
          text: "数据统计走势图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };

      // 合并对象, 也可以合并数组
      const option = { ...option1, ...option2 };

      // 第四步 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.echartsBox {
  margin-top: 30px;
}
</style>
