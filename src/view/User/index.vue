<script setup>
import { getUserInfoAPI, addUserInfoAPI, delUserInfoAPI, DelUsersInfoAPI, searchUserInfoAPI, editUserInfoAPI } from '@/apis/user'
import { onMounted, ref } from 'vue'
import { useRoleStore } from '@/stores/roleStore.js'
import { ElMessage, ElMessageBox } from 'element-plus'

//准备好分页数据的对象
const searchForm = ref({
  name: '',
  current: 1,
  size: 10
})
// 获取用户信息
const statusList = ref([])
const userMsg = ref({})
const currentPageUserMsg = ref([])
const total = ref(0)
const getUserMsg = async ({ pageNum, pageSize }) => {
  const res = await getUserInfoAPI({ pageNum, pageSize })
  userMsg.value = res.data
  currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
  console.log('@@获取用户信息', userMsg.value)
  total.value = res.data.total
  console.log('curr', currentPageUserMsg.value)
  statusList.value = []
  userMsg.value.records.forEach((item) => {
    statusList.value.push(item.status === 1 ? true : false)
  })
  console.log(statusList.value)
}
onMounted(() => {
  getUserMsg({
    pageNum: 0,
    pageSize: 0
  })
})

//多选
//保存要批量删除的用户ID
let IDs
const handleSelectionChange = (val) => {
  IDs = ''
  console.log(val)
  val.forEach((item) => {
    IDs += item.id + ','
  })
  IDs = IDs.slice(0, IDs.length - 1)
  console.log(IDs)
}

//处理批量处理时的删除逻辑
const handleDelList = async () => {
  if (!IDs) {
    ElMessage.error('请先勾选您想要删除的数据')
    return
  } else {
    ElMessageBox.confirm('确认删除选中的用户吗?', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning'
    })
      .then(async () => {
        await DelUsersInfoAPI(IDs)
        IDs = ''
        //更新视图
        const res1 = await getUserInfoAPI(0, 0)
        userMsg.value = res1.data
        currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
        total.value = userMsg.value.records.length
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
      })
      .catch(() => {})
  }
}

//删除单个用户的逻辑
let id = ref(-1)
const handleDel = async (index, rowData) => {
  console.log('下标', index, '删除的数据', rowData.id)
  id.value = rowData.id
  console.log('删除的id', id.value)
  ElMessageBox.confirm('确认删除该用户吗?', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning'
  })
    .then(async () => {
      const res = await delUserInfoAPI(id.value)
      id = -1
      console.log(res)
      //更新视图
      const res1 = await getUserInfoAPI(0, 0)
      userMsg.value = res1.data
      currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
      total.value = userMsg.value.records.length
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
    .catch(() => {})
}

//用户状态(todo)
// const rowStatus = ref(false)

const handleStatus = (scope) => {
  console.log('111', scope)
  console.log('scope.row.status: ', scope.row.status)
  const changeStatus = ref('')
  const changedUserName = ref('')
  changedUserName.value = scope.row.account
  if (scope.row.status === 1) {
    changeStatus.value = '停用'
  } else {
    changeStatus.value = '启用'
  }
  ElMessageBox.confirm(`确认${changeStatus.value}${changedUserName.value}吗?`, {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning'
  })
    .then(() => {
      statusList[scope.$index] = scope.row.status === 1 ? false : true
      console.log('222', statusList[scope.$index])

      //后续调用相关api,修改用户的status
    })
    .catch(() => {
      statusList[scope.$index] = scope.row.status === 1 ? true : false
    })
  console.log(scope)
}

//查找用户
const searchData = ref({
  pageNum: 0,
  pageSize: 0,
  account: ''
})
const searchUser = async (val) => {
  console.log('search', val)
  searchData.value.account = val
  const res = await searchUserInfoAPI(searchData.value)
  console.log(res)
  //更新视图
  // const res1 = await getUserInfoAPI(0, 0)
  userMsg.value = res.data
  currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
  total.value = userMsg.value.records.length
}

//页数变化
const handleSizeChange = (val) => {
  //更新页面尺寸
  searchForm.value.size = val
  //尺寸变化更新页面首页表单内容
  currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
}

//当前页数变化
// const background = ref(false)
const handleCurrentChange = (val) => {
  if (val !== 1) {
    currentPageUserMsg.value = userMsg.value.records.slice((val - 1) * searchForm.value.size)
  } else {
    currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
  }
  searchForm.current = val
  // console.log('页数改变', val)
  // console.log('page', searchForm.current)
}

//新增
//搜集新增用户的信息
const formInline = ref({
  id: '',
  account: '',
  phone: '',
  email: '',
  password: '',
  gender: 0,
  age: '', //应为number
  birth: '',
  roleId: '',
  status: 0,
  createDate: ''
})

//角色信息
//调用useRoleStore中的action函数
const useRole = useRoleStore()
onMounted(() => {
  useRole.getRoleInfo()
})

const addFormVisible = ref(false)
const roleOptions = ref([])
const handleAdd = () => {
  formInline.value = {}
  roleOptions.value = []
  useRole.roleInfo.forEach((item) => {
    roleOptions.value.push({
      id: item.id,
      description: item.description
    })
  })
  // console.log('角色选项', roleOptions.value)
  addFormVisible.value = true
}

//处理选择后的信息
const handleRoleOPtion = (val) => {
  //与el-select中的v-model="roleOptions.value"一样，
  // 可以通过 @change="handleRoleOPtion(roleOptions.value)" 获取当前用户选中的value值
  roleOptions.value.forEach((item) => {
    if (item.description === val) {
      //更新角色id,赋予特定用户的角色类别
      formInline.value.roleId = item.id
    }
  })
  // console.log('update', formInline.value)
}

//提交新增用户的信息
const confirmAddUser = async () => {
  formInline.value.gender = formInline.value.gender === '男' ? 1 : 0
  formInline.value.status = formInline.value.status === '正常' ? 1 : 0
  await addUserInfoAPI(formInline.value)

  //清空表单填入的数据
  formInline.value = {}
  //隐藏表单
  addFormVisible.value = false
  //更新表格
  const res1 = await getUserInfoAPI(0, 0)
  userMsg.value = res1.data
  currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
  total.value = userMsg.value.records.length
  ElMessage({
    type: 'success',
    message: '新增用户成功'
  })
}

// 编辑用户信息
const editFormVisible = ref(false)
const defaultRole = ref(null)
const handledetail = (row) => {
  editFormVisible.value = true
  formInline.value.account = row.account
  formInline.value.phone = row.phone
  formInline.value.email = row.email
  formInline.value.password = row.password
  formInline.value.gender = row.gender
  formInline.value.age = row.age
  formInline.value.id = row.id
  formInline.value.birth = row.birth
  formInline.value.roleId = row.roleId
  formInline.value.status = row.status
  currentPageUserMsg.value.forEach((item) => {
    if (formInline.value.roleId === item.id) {
      formInline.value.id = item.id
      formInline.value.createDate = item.createDate
    }
  })
  roleOptions.value = []
  useRole.roleInfo.forEach((item) => {
    roleOptions.value.push({
      id: item.id,
      description: item.description
    })
  })
  roleOptions.value.forEach((item) => {
    if (item.id == formInline.value.roleId) {
      defaultRole.value = item.description
    }
  })
}

//确认修改用户信息
const confirmEdit = async () => {
  console.log('表单信息', formInline.value)
  formInline.value.gender = formInline.value.gender === '男' ? 1 : 0
  formInline.value.status = formInline.value.status === '正常' ? 1 : 0
  await editUserInfoAPI(formInline.value)
  editFormVisible.value = false
  //更新视图
  const res1 = await getUserInfoAPI(0, 0)
  userMsg.value = res1.data
  currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
  console.log('editedData', res1)
  ElMessage({
    type: 'success',
    message: '编辑用户信息成功'
  })
}

//表单校验规则
const rules = ref({
  account: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 14, message: '密码长度为6-14个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
    { required: true, message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
})
</script>

<template>
  <el-card style="margin-top: 20px">
    <!-- 查找 -->
    <el-input placeholder="请输入用户名称" clearable style="width: 450px; margin-bottom: 10px" v-model="searchForm.name">
      <template #append>
        <el-button icon="Search" @click="searchUser(searchForm.name)" />
      </template>
    </el-input>

    <!-- 操作表格 -->
    <el-row style="margin-bottom: 10px">
      <el-button type="primary" @click="handleAdd" icon="Plus" plain>新增</el-button>
      <el-button type="danger" icon="Delete" @click="handleDelList" plain>删除</el-button>
    </el-row>
    <!-- 表格结构 -->
    <el-table
      :data="currentPageUserMsg"
      height="250"
      border
      style="width: 100%"
      :header-cell-style="{ textAlign: 'center', color: '#515a6e', backgroundColor: '#f8f8f9' }"
      :cell-style="{ textAlign: 'center' }"
      @selection-change="handleSelectionChange"
      table-layout="auto"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column prop="account" label="用户名称" width="180" />
      <el-table-column label="性别" width="80">
        <template #default="scope">{{ scope.row.gender === 0 ? '女' : '男' }}</template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="phone" label="电话号码" width="180" />
      <el-table-column prop="status" label="状态" width="160">
        <template #default="scope">
          <el-switch v-model="statusList[scope.$index]" @click="handleStatus(scope)" />
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="200" />
      <el-table-column label="操作">
        <template #default="scope">
          <!-- <el-button type="primary" icon="Plus" @click="handleAdd" small plain>新增</el-button> -->
          <el-button type="danger" icon="Delete" plain @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <el-button type="success" icon="Edit" plain @click="handledetail(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="margin: 20px 0; display: flex; float: right"
      v-model:current-page="searchForm.current"
      background
      v-model:page-size="searchForm.size"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      small
    />
  </el-card>

  <!-- 新增用户的对话框 -->
  <el-dialog v-model="addFormVisible" title="新增用户" width="41%" destroy-on-close center>
    <el-form :inline="true" :rules="rules" ref="addFormRef" :model="formInline" class="demo-form-inline">
      <el-form-item prop="account" label="用户名称:">
        <el-input v-model="formInline.account" clearable />
      </el-form-item>
      <el-form-item label="电话:" style="margin-left: 10px">
        <el-input v-model="formInline.phone" clearable />
      </el-form-item>
      <el-form-item prop="email" label="邮箱:" style="margin-left: 30px">
        <el-input v-model="formInline.email" clearable />
      </el-form-item>
      <el-form-item prop="password" label="密码:">
        <el-input type="password" v-model="formInline.password" clearable />
      </el-form-item>
      <el-form-item label="性别:" style="margin-left: 40px">
        <div style="margin-left: 5px">男<input type="radio" name="sex" style="margin-left: 5px" value="男" v-model="formInline.gender" /></div>
        <div style="margin-left: 15px">女<input type="radio" name="sex" style="margin-left: 5px" value="女" v-model="formInline.gender" /></div>
      </el-form-item>
      <el-form-item label="年龄:" style="margin-left: 148px">
        <el-input v-model="formInline.age" clearable />
      </el-form-item>
      <el-form-item label="生日:" style="width: 250px; margin-left: 42px">
        <el-date-picker v-model="formInline.birth" type="date" clearable />
      </el-form-item>
      <el-form-item label="角色:" style="margin-left: 23px">
        <!-- <el-input v-model="formInline.roleId" placeholder="请选择角色" clearable /> -->
        <el-select v-model="roleOptions.value" @change="handleRoleOPtion(roleOptions.value)">
          <el-option v-for="item in roleOptions" :key="item.id" :label="item.description" :value="item.description" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" style="margin-left: 42px">
        <div style="margin-left: 5px">正常<input type="radio" name="status" style="margin-left: 5px" value="正常" v-model="formInline.status" /></div>
        <div style="margin-left: 15px">
          停用<input type="radio" name="status" style="margin-left: 5px" value="停用" v-model="formInline.status" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddUser()"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑用户的对话逻辑(到时候和新增封装为一个通用的组件) -->
  <el-dialog v-model="editFormVisible" title="编辑用户信息" width="41%" destroy-on-close center>
    <el-form :inline="true" :rules="rules" :model="formInline" class="demo-form-inline">
      <el-form-item prop="account" label="用户名称:">
        <el-input v-model="formInline.account" clearable />
      </el-form-item>
      <el-form-item label="电话:" style="margin-left: 10px">
        <el-input v-model="formInline.phone" clearable />
      </el-form-item>
      <el-form-item prop="email" label="邮箱:" style="margin-left: 30px">
        <el-input v-model="formInline.email" clearable />
      </el-form-item>
      <el-form-item prop="password" label="密码:">
        <el-input type="password" disabled v-model="formInline.password" clearable />
      </el-form-item>
      <el-form-item label="性别:" style="margin-left: 40px">
        <div style="margin-left: 5px">
          男<input :checked="formInline.gender === 1" type="radio" name="sex" style="margin-left: 5px" value="男" v-model="formInline.gender" />
        </div>
        <div style="margin-left: 15px">
          女<input :checked="formInline.gender === 0" type="radio" name="sex" style="margin-left: 5px" value="女" v-model="formInline.gender" />
        </div>
      </el-form-item>
      <el-form-item label="年龄:" style="margin-left: 148px">
        <el-input v-model="formInline.age" clearable />
      </el-form-item>
      <el-form-item label="生日:" style="width: 250px; margin-left: 42px">
        <el-date-picker v-model="formInline.birth" type="date" clearable />
      </el-form-item>
      <el-form-item label="角色:" style="margin-left: 23px">
        <el-select v-model="defaultRole" @change="handleRoleOPtion(roleOptions.value)">
          <el-option v-for="item in roleOptions" :key="item.id" :label="item.description" :value="item.description" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" style="margin-left: 42px">
        <div style="margin-left: 5px">
          正常<input
            type="radio"
            :checked="formInline.status === 1"
            name="status"
            style="margin-left: 5px"
            value="正常"
            v-model="formInline.status"
          />
        </div>
        <div style="margin-left: 15px">
          停用<input
            type="radio"
            :checked="formInline.status === 0"
            name="status"
            style="margin-left: 5px"
            value="停用"
            v-model="formInline.status"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>
