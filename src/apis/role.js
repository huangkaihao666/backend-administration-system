import httpInstance from '@/utils/http'

//获取所有角色信息
export const getRoleAPI = () => {
  return httpInstance({
    url: '/role/list'
  })
}
