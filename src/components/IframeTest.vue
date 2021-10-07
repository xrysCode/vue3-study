<template>
  <div id="app2" class="three"></div>
</template>

<script>
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// import authPlugin from '@/plugins/auth2'
const app = createApp(App).use(store)// .use(router)
  .use(ElementPlus)
//   .use(authPlugin)
  .use(router)

export default {
  name: 'IfeameTest',
  mounted () {
    this.$nextTick(() => {
      const vm = app.mount('#app2')

      console.log('新实例创建', vm)
    })
  },
  beforeUnmount () {
    app.unmount()
    console.log('新实例卸载app', app)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app2 {
  border-style: dotted;
  border-width: 2px;
}
</style>
