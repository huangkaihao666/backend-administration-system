<script setup>
// import { useUserInfoStore } from '@/stores/userStore';
// const userInfoStore = useUserInfoStore()
// userInfoStore.getUserMsg(
//     {
//     pageNum: 10,
//     pageSize: 10
//     })
//     console.log('@',userInfoStore.userMsg.value);
import { getUserInfoAPI } from '@/apis/user'
import { onMounted, ref } from 'vue'

const searchForm = ref({
	name: '',
	current: 1,
	size: 10,
})
const userMsg = ref({})
const total = ref(0)
const getUserMsg = async ({ pageNum, pageSize }) => {
	const res = await getUserInfoAPI({ pageNum, pageSize })
	userMsg.value = res.data
	// console.log('@@',userMsg);
	total.value = res.data.total
}
onMounted(() => {
	getUserMsg({
		pageNum: 0,
		pageSize: 0,
	})
})

//编辑用户信息
const handledetail = (index, row) => {
	console.log(index, row)
}

//删除用户
const handleDelete = () => {}

//多选
const handleSelectionChange = (val) => {
	console.log(val)
}

//查找用户
const searchUser = (val) => {
	console.log('search', val)
}

//页数变化
const handleSizeChange = (val) => {
	console.log(val)
}

//当前页数变化
const handleCurrentChange = (val) => {
	console.log(val)
}
</script>

<template>
	<el-card style="margin-top: 20px">
		<!-- 查找 -->
		<el-input
			placeholder="请输入用户名称"
			clearable
			style="width: 450px; margin-bottom: 10px"
			v-model="searchForm.name"
		>
			<template #append>
				<el-button icon="Search" @click="searchUser" />
			</template>
		</el-input>

		<!-- 操作表格 -->
		<el-row style="margin-bottom: 10px">
			<el-button type="primary" icon="Plus" plain>新增</el-button>
			<el-button type="danger" icon="Delete" plain>删除</el-button>
			<el-button type="success" icon="Edit" plain>编辑</el-button>
		</el-row>
		<!-- 表格结构 -->
		<el-table
			:data="userMsg.records"
			height="250"
			stripe
			border
			style="width: 100%"
			@selection-change="handleSelectionChange"
			table-layout="auto"
		>
			<el-table-column type="selection" width="55" />
			<!-- <el-table-column label="Date" width="120">
                <template #default="scope">{{ scope.row.date }}</template>
            </el-table-column> -->
			<el-table-column prop="id" label="用户编号" width="200" />
			<el-table-column prop="account" label="用户名称" width="200" />
			<el-table-column prop="email" label="邮箱" width="200" />
			<el-table-column prop="phone" label="电话号码" width="200" />
			<el-table-column prop="createDate" label="创建时间" width="200" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button
						size="small"
						@click="handledetail(scope.$index, scope.row)"
						>详情</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination
			style="margin: 20px 0; display: flex; float: right"
			:current-page="searchForm.current"
			:page-size="searchForm.size"
			:page-sizes="[10, 20, 30, 40]"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			small
		/>
	</el-card>
</template>

<style scoped></style>
