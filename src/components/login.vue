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
            <el-button type="primary" class="login-btn">登录</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // labelPosition: "top", 控制对齐方式
            formData: {
                username:'',
                password:''
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
