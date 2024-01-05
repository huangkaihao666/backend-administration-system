<script setup>
import { getRoleAPI } from '@/apis/role'
import { onMounted } from 'vue'

const getRole = async () => {
	const res = await getRoleAPI()
	console.log('roleList', res)
}

onMounted(() => {
	getRole()
})
</script>

<template>
	<div>This is Role</div>
</template>

<style scoped></style>
