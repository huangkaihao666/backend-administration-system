<script setup>
import {ref,watch,onMounted} from 'vue'
import {useRoute,useRouter} from 'vue-router'

//控制菜单折叠
const isFold = ref(false)
const handleIsFold = () => {
    isFold.value = !isFold.value
}

//路由切换
const route = useRoute()
const breadcrumbData = ref([])
const getBreadcrumbData = () => {
    if(route.path !== '/login') {
        breadcrumbData.value = []
        breadcrumbData.value.push('首页')
        if(route.path === '/') return
        for(let i = 1; i < route.matched.length; i++) {
            let matchName = route.matched[i].name
            // console.log('当前路径',matchName);
            breadcrumbData.value.push(matchName)
        }
    } else {
        breadcrumbData.value.push('/login')

    }

}
watch(
    route,
    () => {
        getBreadcrumbData()
    },
    {
        immediate: true,
        deep: true
    }
)

const router = useRouter()
//登录
// const login = () => {
    
//     console.log(route);
// }
//退出登录
const isLogin = ref(false)
onMounted(() => {
    if(localStorage.getItem('token')) isLogin.value = true 
})

const confirm = () => {
    localStorage.removeItem('token')
    router.replace('/login')
}


</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div @click="handleIsFold">
            <el-icon v-if="isFold" size="30px"><Fold /></el-icon>
            <el-icon v-else size="30px"><Expand /></el-icon>
        </div>
        91课堂后台管理系统
        <div class="topAvatar">
            <el-avatar class="avatar"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <el-dropdown>
                <span class="el-dropdown-link">
                admin
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-popconfirm @confirm="confirm" title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
                        <template #reference>
                            <a class="logoutLink" href="javascript:;"><el-dropdown-item v-if="isLogin">退出登录</el-dropdown-item></a>
                        </template>
                    </el-popconfirm>
                    <el-dropdown-item v-if="!isLogin" @click="$router.push('/login')">去登录</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside class="aside" :class="{asideFold: isFold}">
            <el-menu
                default-active="/"
                class="el-menu-vertical-demo"
                :collapse="isFold"
                background-color="#324157"
                text-color="#fff"
                :router="true"
            >
                <el-menu-item  index="/">
                    <el-icon><House /></el-icon>
                    <template #title>首页</template>
                </el-menu-item>
                <el-menu-item index="/user">
                    <el-icon><User /></el-icon>
                    <template #title>用户</template>
                </el-menu-item>
                <el-menu-item index="/role">
                    <el-icon><UserFilled /></el-icon>
                    <template #title>角色管理</template>
                </el-menu-item>
                <!-- 下拉导航后期再维护 -->
                <el-sub-menu index="/error"> 
                    <template #title>
                        <el-icon><location /></el-icon>
                        <span>sb蔡植疯</span>
                    </template>
                        <el-menu-item index="/error">打倒卷王蔡植疯</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <el-main class="main">
            <div class="breadcrumb">
                <el-breadcrumb separator=">">
                    <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
                    <el-breadcrumb-item v-for="(item) in breadcrumbData"
                    :key="item"
                    >
                    {{ item }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <!-- 二级路由出口 -->
            <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.common-layout {
    .header {
        padding: 0;
        background-color: rgb(36, 47, 66);
        color: white;
        font-size: larger;
        line-height: 60px;
        >div {
            display: flex;
            align-items: center;
            float: left;
            padding: 0 15px;
            height: 60px;
        }
        .topAvatar {
            float:right;
            margin-right: 40px;
            div {
                display: inline-block;
            }
            .el-dropdown-link {
                color: #fff;
            }
            .el-avatar {
                margin: 0 20px;
            }
            .logoutLink {
                text-decoration: none;
            }
        }
    }
    .aside {
        height: 92.3vh;
        width: auto;
    }
    .el-menu-vertical-demo {
        min-height: 100%;
        height: 100%;

    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 245px;
    }
    .el-menu--collapse {
        width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2);
    }
    .main {
        height: 92.3vh;
        margin: 0;
        padding: 0;
        background-color: rgb(240, 240, 240);
        .breadcrumb {
            height: 25px;
            line-height: 20px;
            background-color: #fff;
            .el-breadcrumb {
                line-height: 25px;
                margin-left: 10px;
            }
        }
    }
}

</style>
