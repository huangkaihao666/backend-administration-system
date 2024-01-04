import httpInstance from "@/utils/http";

//获取登录id
const getLoginAPI = ({account,password}) => {
    return httpInstance({
        url: '/authorization/login',
        params: {
            account,
            password
        },
    })
}

//根据id去获取token
const getLoginTokenAPI = (id) => {
    return httpInstance({
        url:`/authorization/token/${id}`,
        params:{
            id
        }
    })
}

export {
    getLoginAPI,
    getLoginTokenAPI
}