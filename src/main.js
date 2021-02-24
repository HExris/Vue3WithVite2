import {
    createApp
} from 'vue'
import App from './App.vue'

// Router
import router from 'router'
// Store
import store from 'store'
// Style
import 'style/index.scss'
import 'element3/lib/theme-chalk/index.css'
// Plugin
import element3 from 'plugin/element3'

createApp(App).use(router).use(store).use(element3).mount('#app')