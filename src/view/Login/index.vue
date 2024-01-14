<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { useRouter } from 'vue-router'

const router = useRouter()

//获取useUserStore的实例(调用)
const userStore = useUserStore()

//准备表单对象
const ruleForm = ref({
  account: '',
  password: ''
})

const rules = ref({
  account: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 14, message: '密码长度为6-14个字符', trigger: 'blur' }
  ]
})

//绑定el-form的ref属性
const ruleFormRef = ref(null)

//处理表单数据
const submitForm = () => {
  if (!ruleFormRef) return
  ruleFormRef.value.validate(async (valid) => {
    //valid:所有表单都通过校验时为true，才执行登录逻辑
    if (valid) {
      await userStore.getUserInfo(ruleForm.value)
      if (localStorage.getItem('token')) {
        //跳转到首页
        router.replace('/') //这里使用replace要比push好一点，不需要返回来
      }
    } else {
      return false
    }
  })
}
</script>

<template>
  <el-card class="container" shadow="always">
    <el-form label-width="80px" class="elForm" :rules="rules" :model="ruleForm" ref="ruleFormRef">
      <div>
        <el-form-item label="账号" prop="account">
          <el-col :span="22">
            <el-input placeholder="请输入账号" v-model="ruleForm.account" :span="8" />
          </el-col>
        </el-form-item>
      </div>
      <el-form-item label="密码" prop="password">
        <el-col :span="22">
          <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">登录</el-button>
        <el-button type="primary" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-footer class="footer">
    <p>关于我们 | 联系我们 | 人才招聘 | 广告服务 | 友情链接 | 旅游社区 | 旅游公益</p>
  </el-footer>
</template>

<style scoped lang="less">
.container {
  background: url('@/assets/login.jpeg');
  background-size: cover; /* 调整背景图片大小适配容器 */
  height: 100vh; /* 根据需求设置高度 */
  display: flex;
  justify-content: center;
  align-items: center;

  .elForm {
    height: 180px;
    background-color: #ecf5ff;
    border-radius: 5px;
    text-align: center;
    > div {
      padding-top: 10px;
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 550px;
  color: #fff;
}
</style>
