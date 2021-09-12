
import { onMounted } from 'vue'
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.')
        .reduce((o, i) => { if (o) return o[i] }, options)
    }
    debugger
    //   app.provide('i18n', options)

    //   app.directive('my-directive', {
    //     mounted (el, binding, vnode, oldVnode) {
    //       // some logic ...
    //     }
    //     ...
    //   })

    //   app.mixin({
    //     created() {
    //       // some logic ...
    //     }
    //     ...
    //   })
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
    // console.log(routeArr)
  },
  setup (props, context) {
    // Attribute (非响应式对象)
    console.log(context.attrs)
    debugger
    // 插槽 (非响应式对象)
    console.log(context.slots)

    // 触发事件 (方法)
    console.log(context.emit)

    onMounted(() => {
      debugger
      console.log('setup->Component is mounted!')
    })
  }
}
