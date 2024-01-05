<script setup>
import { onMounted } from 'vue'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core'
// 引入折线图图表，图表后缀都为 Chart
import { LineChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	LineChart,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer,
])
onMounted(() => {
	let myChart = echarts.init(document.getElementById('main'), 'light')
	myChart.setOption({
		title: {
			text: '91特邀嘉宾名单',
		},
		tooltip: {},
		xAxis: {
			data: ['蔡植疯', '黄开浩', '章淋阅', '赖熔劲', '哥舞坑', '冯夹菌'],
		},
		yAxis: {},
		series: [
			{
				type: 'bar',
				data: [23, 24, 18, 25, 27, 28],
			},
			{
				type: 'bar',
				data: [26, 24, 18, 22, 23, 20],
			},
		],
	})
})
</script>

<template>
	<div id="main"></div>
</template>

<style scoped>
#main {
	display: inline-block;
	height: 400px;
	width: 400px;
	margin: 10px 0 0 10px;
}
</style>
