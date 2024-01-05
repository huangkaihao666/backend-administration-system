import { defineStore } from 'pinia'
import { getLoginAPI, getLoginTokenAPI } from '@/apis/login.js'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { getUserInfoAPI } from '@/apis/user'

export const useUserStore = defineStore('user', () => {
	//定义管理用户token的state
	const userInfo = ref({})

	// 获取用户id和token的action函数
	const getUserInfo = async ({ account, password }) => {
		const res = await getLoginAPI({ account, password })
		const { data } = res
		console.log('data', data)
		const tokenInfo = await getLoginTokenAPI(data)
		console.log('@', tokenInfo)
		userInfo.value = tokenInfo
		//登录成功
		if (tokenInfo.success) {
			//将token存储到本地
			localStorage.setItem('token', tokenInfo.data)
			//提示用户
			ElMessage.success('登录成功')
		} else {
			//登录失败
			ElMessage.error(token.msg)
		}
	}

	//将属性暴露出去，外界通过useUserStore调用属性
	return {
		userInfo,
		getUserInfo,
	}
})

export const useUserInfoStore = defineStore('userMsg', () => {
	//定义管理用户信息的state
	const userMsg = ref({})

	const getUserMsg = async ({ pageNum, pageSize }) => {
		const res = await getUserInfoAPI({ pageNum, pageSize })
		console.log(res)
		userMsg.value = res
	}
	return {
		userMsg,
		getUserMsg,
	}
})
