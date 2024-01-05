import httpInstance from "@/utils/http";

//获取用户信息
const getUserInfoAPI = ({pageNum,pageSize}) => {
    return httpInstance({
        url: '/user',
        params: {
            pageNum,
            pageSize
        }
    })
}

export {
    getUserInfoAPI
}