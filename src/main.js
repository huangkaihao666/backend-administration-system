import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//记得导入element plus \下面的这个样式，否则后面使用其消息提示框时没有效果
import 'element-plus/dist/index.css'
//引入element-plus中文包
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'echarts'
import { createPinia } from 'pinia'
// import Echarts from 'vue-echarts'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(createPinia())
app.use(ElementPlus, { locale })

app.mount('#app')
