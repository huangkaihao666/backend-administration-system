import httpInstance from '@/utils/http'

//获取用户数据分页信息
const getRolePageMsgAPI = ({ pageNum = 0, pageSize = 0, name, permissionIds }) => {
  return httpInstance({
    url: 'role',
    params: {
      pageNum,
      pageSize,
      name,
      permissionIds
    }
  })
}

//获取所有角色信息
const getRoleAPI = () => {
  return httpInstance({
    url: '/role/backen/list'
  })
}

//新增角色信息
const addRoleAPI = ({ name, description, permissionIds, permissionName }) => {
  return httpInstance({
    url: '/role',
    method: 'POST',
    data: {
      name,
      description,
      permissionIds,
      permissionName
    }
  })
}

//批量删除角色信息
const delRoleListAPI = (data) => {
  return httpInstance({
    url: `/role/batch/${data}`,
    method: 'DELETE'
  })
}

//删除单个角色
const delRoleInfoAPI = (data) => {
  return httpInstance({
    url: `/role/${data}`,
    method: 'DELETE'
  })
}

//编辑角色信息
const editRoleInfoAPI = (data) => {
  return httpInstance({
    url: '/role',
    method: 'PUT',
    data
  })
}
export { getRoleAPI, getRolePageMsgAPI, addRoleAPI, delRoleListAPI, delRoleInfoAPI, editRoleInfoAPI }
