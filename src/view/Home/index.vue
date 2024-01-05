<script setup>
import menberOfEcharts from '@/components/menberOfEcharts.vue';
</script>

<template>
<div> 
    <menberOfEcharts />
    <div class="container">
        <el-image class="image" src="/src/assets/banner.jpg"/>
    </div>
</div>
</template>

<style scoped>
.container {    
    width: 250px;
    position: absolute;    
    margin: 0 auto;
    top: 13%;
    left: 40%;
}
</style>
