<script setup>
import { getRoleAPI, getRolePageMsgAPI, delRoleListAPI, delRoleInfoAPI, editRoleInfoAPI } from '@/apis/role'
import { addRoleAPI } from '@/apis/role'
import { onMounted, ref } from 'vue'
import { useRoleStore } from '@/stores/roleStore.js'

//搜索框的表单数据
const searchForm = ref({
  name: '',
  size: 10,
  current: 0
})

//分页size改变
const handleSizeChange = (val) => {
  //更新页面尺寸
  searchForm.value.size = val
  //尺寸变化更新页面首页表单内容
  currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
}
//分页的当前页改变
const handleCurrentChange = (val) => {
  if (val !== 1) {
    currentPageUserMsg.value = userMsg.value.records.slice((val - 1) * searchForm.value.size)
  } else {
    currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
  }
  searchForm.current = val
}

const getRole = async () => {
  const res = await getRoleAPI()
  console.log('roleList', res)
}
const rolePage = ref({
  pageNum: 0,
  pageSize: 0,
  name: '',
  permissionIds: ''
})

//封装更新表格数据的函数
const updateTableList = (res) => {
  console.log('resPage', res)
  userMsg.value = res.data
  total.value = res.data.total
  currentPageUserMsg.value = userMsg.value.records.slice(0, searchForm.value.size)
  userMsg.value.records.forEach((item) => {
    item.permissionName = item.permissionName !== null ? item.permissionName : '[无操作权限]'
  })
}

//获取初始数据
const total = ref(0)
const userMsg = ref({})
const currentPageUserMsg = ref([])
const getRolePage = async () => {
  const res = await getRolePageMsgAPI(rolePage.value)
  updateTableList(res)
}

onMounted(() => {
  getRole()
  getRolePage()
})

//查找角色
const searchRole = async () => {
  const res = await getRolePageMsgAPI(rolePage.value)
  updateTableList(res)
}

//重置查询
const resetSearchForm = () => {
  rolePage.value.name = ''
  rolePage.value.permissionIds = ''
}

const formInline = ref({
  id: '',
  name: '',
  description: '',
  permissionIds: '',
  permissionName: ''
})

//角色信息
//调用useRoleStore中的action函数
const useRole = useRoleStore()
onMounted(() => {
  useRole.getRoleInfo()
})

//新增角色
const addFormVisible = ref(false)
const defaultRole = ref('用户')
const roleOptions = ref([])
const handleAdd = () => {
  // formInline.value = {}
  roleOptions.value = []
  useRole.roleInfo.forEach((item) => {
    roleOptions.value.push({
      id: item.id,
      description: item.description
    })
  })
  addFormVisible.value = true
}

//处理选择后的信息
const handleRoleOPtion = (val) => {
  console.log('描述', val)
  roleOptions.value.forEach((item) => {
    if (item.description == val) {
      //更新角色id,赋予特定用户的角色类别
      formInline.value.description = item.description
    }
  })
}

//封装调整表格数据形式的函数
const adjustFormData = () => {
  formInline.value.permissionIds = []
  formInline.value.permissionName = []
  if (SelectedRights._value.includes('添加权限')) {
    formInline.value.permissionName.push('添加权限')
    formInline.value.permissionIds.push(1)
  }
  if (SelectedRights._value.includes('删除权限')) {
    formInline.value.permissionName.push('删除权限')
    formInline.value.permissionIds.push(2)
  }
  if (SelectedRights._value.includes('修改权限')) {
    formInline.value.permissionName.push('修改权限')
    formInline.value.permissionIds.push(3)
  }
  if (SelectedRights._value.includes('查询权限')) {
    formInline.value.permissionName.push('查询权限')
    formInline.value.permissionIds.push(4)
  }
  formInline.value.permissionName = formInline.value.permissionName.join()
  formInline.value.permissionIds = formInline.value.permissionIds.join()
  formInline.value.permissionName = '[' + formInline.value.permissionName + ']'
}

//提交新增角色的信息
const confirmAddUser = async () => {
  adjustFormData()
  const res = await addRoleAPI(formInline.value)

  //清空表单填入的数据
  formInline.value = {}
  //隐藏表单
  addFormVisible.value = false
  //更新表格
  const res1 = await getRolePageMsgAPI(rolePage.value)
  updateTableList(res1)
  if (res.success == true) {
    ElMessage({
      type: 'success',
      message: '新增角色成功'
    })
  } else {
    ElMessage({
      type: 'warning',
      message: '新增角色失败'
    })
  }
}

//权限选择
const SelectedRights = ref([])
const rightOtions = ref([
  {
    value: '添加权限',
    label: '添加权限'
  },
  {
    value: '删除权限',
    label: '删除权限'
  },
  {
    value: '修改权限',
    label: '修改权限'
  },
  {
    value: '查询权限',
    label: '查询权限'
  }
])

//多选
//保存要批量删除的用户ID
let IDs
const handleSelectionChange = (val) => {
  IDs = ''
  val.forEach((item) => {
    IDs += item.id + ','
  })
  IDs = IDs.slice(0, IDs.length - 1)
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
        await delRoleListAPI(IDs)
        IDs = ''
        //清空表单填入的数据
        formInline.value = {}
        //更新表格
        const res1 = await getRolePageMsgAPI(rolePage.value)
        updateTableList(res1)
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
      })
      .catch(() => {})
  }
}

//删除单个角色的逻辑
let id = ref(-1)
const handleDel = async (rowData) => {
  id.value = rowData.id
  ElMessageBox.confirm('确认删除该角色吗?', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning'
  })
    .then(async () => {
      await delRoleInfoAPI(id.value)
      id = -1
      //更新表格
      const res1 = await getRolePageMsgAPI(rolePage.value)
      updateTableList(res1)
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
    .catch(() => {})
}

// 编辑用户信息
const editFormVisible = ref(false)
const defaultedRole = ref(null)
const handledetail = (row) => {
  console.log('edit', row)
  formInline.value.id = row.id
  editFormVisible.value = true
  formInline.value.name = row.name
  formInline.value.description = row.description
  formInline.value.permissionIds = row.permissionIds
  SelectedRights.value = row.permissionName
  formInline.value.permissionName = row.permissionName
  roleOptions.value = []
  useRole.roleInfo.forEach((item) => {
    roleOptions.value.push({
      id: item.id,
      description: item.description
    })
  })
  roleOptions.value.forEach((item) => {
    if (item.id == formInline.value.id) {
      defaultedRole.value = item.description
    }
  })
  console.log('defaultedRole.value', defaultedRole.value)
}

//确认修改用户信息
const confirmEdit = async () => {
  adjustFormData()
  console.log('编辑后的表单信息', formInline.value)
  const res = await editRoleInfoAPI(formInline.value)
  console.log('updated', res)
  editFormVisible.value = false
  //更新表格
  const res1 = await getRolePageMsgAPI(rolePage.value)
  updateTableList(res1)
  if (res.success == true) {
    ElMessage({
      type: 'success',
      message: '编辑角色信息成功'
    })
  } else {
    ElMessage({
      type: 'warning',
      message: '编辑角色信息失败'
    })
  }
}
</script>

<template>
  <div>
    <el-card class="cardContainer">
      <div>
        <span>
          <span>角色名称：</span>
          <span>
            <el-input placeholder="请输入角色名称" class="topSearch" v-model="rolePage.name" />
          </span>
        </span>
        <span style="margin-left: 20px">
          <span>权限字符：</span>
          <span>
            <el-input placeholder="请输入权限字符" class="topSearch" v-model="rolePage.permissionIds" />
          </span>
        </span>
        <el-button type="primary" style="margin: 0 0 10px 10px" icon="Search" @click="searchRole">搜索</el-button>
        <el-button style="margin: 0 0 10px 10px" icon="Refresh" @click="resetSearchForm">重置</el-button>
      </div>
      <div>
        <el-row style="margin-top: 10px">
          <el-button type="primary" icon="Plus" @click="handleAdd" plain>新增</el-button>
          <el-button type="danger" @click="handleDelList" icon="Delete" plain>删除</el-button>
          <el-button type="warning" icon="Download" plain>导出</el-button>
        </el-row>
      </div>
      <!-- 表格结构 -->
      <el-table
        :data="currentPageUserMsg"
        height="400"
        border
        style="width: 100%; margin-top: 15px"
        :header-cell-style="{ textAlign: 'center', color: '#515a6e', backgroundColor: '#f8f8f9' }"
        :cell-style="{ textAlign: 'center' }"
        @selection-change="handleSelectionChange"
        table-layout="auto"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="角色编号" width="100" />
        <el-table-column prop="name" label="角色名称" width="180" />
        <el-table-column prop="description" label="描述" width="180" />
        <el-table-column prop="permissionName" label="操作权限" width="350" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" icon="Delete" plain @click="handleDel(scope.row)">删除</el-button>
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
    <!-- 新增角色的对话框 -->
    <el-dialog v-model="addFormVisible" title="新增角色" width="41%" destroy-on-close center>
      <el-form :inline="true" :model="formInline.value" class="demo-form-inline">
        <el-form-item prop="name" label="角色名称:">
          <el-input v-model="formInline.name" clearable />
        </el-form-item>
        <el-form-item prop="description" label="描述:">
          <el-select v-model="defaultRole" @change="handleRoleOPtion">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.description" :value="item.description" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限:" style="margin-left: 23px">
          <el-select v-model="SelectedRights" multiple collapse-tags placeholder="请分配角色权限" style="width: 240px">
            <el-option v-for="item in rightOtions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddUser()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog v-model="editFormVisible" title="编辑角色" width="41%" destroy-on-close center>
      <el-form :inline="true" :model="formInline.value" class="demo-form-inline">
        <el-form-item prop="name" label="角色名称:">
          <el-input v-model="formInline.name" clearable />
        </el-form-item>
        <el-form-item prop="description" label="描述:">
          <el-select v-model="defaultedRole" @change="handleRoleOPtion">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.description" :value="item.description" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限:" style="margin-left: 23px">
          <el-select v-model="SelectedRights" multiple collapse-tags style="width: 240px">
            <el-option v-for="item in rightOtions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.cardContainer {
  margin-top: 20px;
  .topSearch {
    width: 200px;
    margin-bottom: 10px;
  }
}
</style>
