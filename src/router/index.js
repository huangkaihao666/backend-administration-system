import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../view/Layout/index.vue'
import Home from '../view/Home/index.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'layout',
			component: Layout,
			children: [
				{
					path: '', //设置默认二级路由时，path为空即可（访问该一级路由时，此路由也会渲染）
					name: '首页',
					component: Home,
				},
				{
					path: '/user',
					name: '用户',
					component: () => import('@/view/User/index.vue'),
				},
				{
					path: '/role',
					name: '角色管理',
					component: () => import('@/view/Role/index.vue'),
				},
			],
		},
		{
			path: '/error',
			component: () => import('@/components/ERROR.vue'),
		},
		{
			path: '/login',
			component: () => import('@/view/Login/index.vue'),
		},
	],
})

export default router
