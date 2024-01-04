import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//记得导入element plus \下面的这个样式，否则后面使用其消息提示框时没有效果
import 'element-plus/dist/index.css'
import 'echarts'
import { createPinia } from 'pinia'
// import Echarts from 'vue-echarts'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// app.component('v-chart',Echarts)
app.use(router)
app.use(createPinia())

app.mount('#app')
