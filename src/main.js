import { createApp } from 'vue'

// 初始化CSS
import 'normalize.css/normalize.css'

// Element Plus Css
import 'element-plus/dist/index.css'

// 引入VueRouter
import router from '@/router'

import App from './App.vue'

const app = createApp(App)
app.use(router).mount('#app')