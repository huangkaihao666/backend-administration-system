import httpInstance from '@/utils/http'

//获取用户信息
const getUserInfoAPI = ({ pageNum, pageSize }) => {
  return httpInstance({
    url: '/user',
    params: {
      pageNum,
      pageSize
    }
  })
}

//新增用户
const addUserInfoAPI = (data) => {
  return httpInstance({
    url: '/user',
    method: 'POST',
    data
  })
}

//删除单个用户
const delUserInfoAPI = (data) => {
  return httpInstance({
    url: `/user/${data}`,
    method: 'DELETE'
  })
}

//批量删除用户
const DelUsersInfoAPI = (data) => {
  return httpInstance({
    url: `/user/batch/${data}`,
    method: 'DELETE'
  })
}

//查找用户
const searchUserInfoAPI = ({ pageNum, pageSize, account }) => {
  return httpInstance({
    url: '/user/',
    params: {
      pageNum,
      pageSize,
      account
    }
  })
}

//编辑用户信息
const editUserInfoAPI = (data) => {
  return httpInstance({
    url: '/user',
    method: 'PUT',
    data
  })
}
export { getUserInfoAPI, addUserInfoAPI, delUserInfoAPI, DelUsersInfoAPI, searchUserInfoAPI, editUserInfoAPI }
