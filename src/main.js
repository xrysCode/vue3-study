import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from '@/axios/axios'
import VueAxios from 'vue-axios'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import authPlugin from './plugins/auth2'

const i18nStrings = {
  greetings: {
    hi: 'Hallo!'
  }
}

var app = createApp(App).use(store)// .use(router)
  .use(ElementPlus)
  .use(authPlugin, i18nStrings)
  .use(router)
  .use(VueAxios, axios)

var vm = app.mount('#app')
console.log(app, vm)

console.log(app._context.components.RouterLink.props.to.type, app.config.globalProperties.$router.getRoutes())
// document.onclick(e => {
//   console.log('当前页面', e)
// })
