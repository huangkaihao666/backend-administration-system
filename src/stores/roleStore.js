import { defineStore } from 'pinia'
import { getRoleAPI } from '@/apis/role'
import { ref } from 'vue'

export const useRoleStore = defineStore('role', () => {
  const roleInfo = ref({})
  const getRoleInfo = async () => {
    const res = await getRoleAPI()
    roleInfo.value = res.data
    // console.log('角色信息', roleInfo.value)
  }

  return {
    roleInfo,
    getRoleInfo
  }
})
