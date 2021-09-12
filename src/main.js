import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import authPlugin from './plugins/auth'

const i18nStrings = {
  greetings: {
    hi: 'Hallo!'
  }
}

var app = createApp(App).use(store)// .use(router)
  .use(ElementPlus).use(authPlugin, i18nStrings)
  .use(router)
var vm = app.mount('#app')
debugger
console.log(app, vm)

console.log(app._context.components.RouterLink.props.to.type, app.config.globalProperties.$router.getRoutes())
// var routerDesc=app._context.components
// 组件解析
// var rootNode = {
//   name: app._component.name,
//   filePath: app._component.__file,
//   authority: app.authority,
//   childNode: []
// }

// function findComponent (components, parentNode) {
//   if (components) {
//     var array = Object.values(components)
//     array.forEach(element => {
//       var node = {
//         name: element.name,
//         filePath: element.__file,
//         authority: element.authority,
//         childNode: []
//       }
//       parentNode.childNode.push(node)
//       if (element.components) {
//         findComponent(element.components, node)
//       }
//     })
//   }
// }
// findComponent(app._component.components, rootNode)

// console.log(rootNode)

// // 路由解析
// var routeArr = []// new Array()
// var routerConfigArr = app.config.globalProperties.$router.getRoutes()
// routerConfigArr.forEach(route => { // 路由中寻找组件
//   var comp = route.components.default
//   if (!(comp instanceof Promise)) {
//     var com = {
//       name: comp.name,
//       filePath: comp.__file,
//       authority: comp.authority,
//       childNode: []
//     }
//     findComponent(comp.components, com)

//     var node = {
//       path: route.path,
//       name: route.name,
//       component: com
//     }

//     routeArr.push(node)
//   } else {
//     console.log('Promise 如何拿到路由的懒加载', comp)
//   }
// })
// console.log(routeArr)

// // 将路由解析结果挂到组件中
// // var xx=app._context.components.RouterLink.props.to.type

// window.sessionStorage.setItem('components', JSON.stringify(rootNode))

// app.use(router)
// var vm = app.mount('#app')
// // debugger
// console.log(app, vm)
