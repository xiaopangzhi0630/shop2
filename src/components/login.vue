<template>
    <div class="login-wrap">
        <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
            <h2>管理员登录</h2>
            <el-form-item label="用户名">
                <el-input v-model="formData.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formData.password"></el-input>
            </el-form-item>
            <el-button
            @click.prevent="headleLogin()"
            type="primary" class="login-btn">登录</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // labelPosition: "top", 控制对齐方式
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // async 与await 把异步改的像同步
    async headleLogin () {
      // post发送请求, 携带this.formData请求体, 返回res
      const res = await this.$http.post('login', this.formData)
      // 返回的结果解构赋值的写法
      const {
        data: {
          data: { token },
          meta: { msg, status }
        }
      } = res
      if (status === 200) {
        // 提示: token值目前不需要关心 把token永久存储
        localStorage.setItem('token', token)
        // console.log('sucess 发送成功')
        // 发送请求成功, 渲染home.vue, 修改标识, js代码编程式导航
        this.$router.push({
          name: 'home'
        })
      } else {
        // 用户名或密码错误  element-ui组件 提示信息
        //   console.log('err-- 发送失败')
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  /* 以下代码为盒子居中.伸缩布局中实现盒子juzhong */
  /* display: flex;
  justify-content: center;
  align-items: center; */
}
.login-form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
  /* 盒子居中 */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login-btn {
  position: relative;
  left: 50%;
  transform: translate(-50%);
}

</style>
