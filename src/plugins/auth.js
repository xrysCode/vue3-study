/* eslint-disable no-unused-expressions */

// 组件解析
function ComponentTree (name, filePath, authority, routerPath, routerName) {
  this.name = name
  this.filePath = filePath
  this.authority = authority
  this.childNode = []
  this.routerPath = routerPath
  this.routerName = routerName
}

function findComponent (components, parentNode) {
  if (components) {
    const array = Object.values(components)
    array.forEach(element => {
      const node = new ComponentTree(element.name, element.__file, element.authority)
      parentNode.childNode.push(node)
      if (element.components) {
        findComponent(element.components, node)
      }
    })
  }
}

function fillTree (app, currentRoute) {
  const rootComponent = app._component
  const rootTree = new ComponentTree(rootComponent.name, rootComponent.__file, rootComponent.authority, currentRoute.path, currentRoute.name)
  findComponent(app._component.components, rootTree)
  return rootTree
}

// 路由解析
function resolveRouterMap (routerConfigArr) {
  const routeMap = new Map()
  routerConfigArr.forEach(route => { // 路由中寻找组件
    const comp = route.components.default
    if (comp instanceof Function) {
      console.log('Promise 如何拿到路由的懒加载', comp)
      comp().then(comp => {
        console.log('懒加载的路由s', comp)
        const lazyComp = comp.default
        const lazyCom = new ComponentTree(lazyComp.name, lazyComp.__file, lazyComp.authority, route.path, route.name)

        findComponent(lazyComp.components, lazyCom)
        routeMap.set(route.path, lazyCom)
      })
    } else {
      const com = new ComponentTree(comp.name, comp.__file, comp.authority, route.path, route.name)

      findComponent(comp.components, com)

      routeMap.set(route.path, com)
    }
  })
  console.log(routeMap)

  // 将路由解析结果挂到组件中
  // var xx=app._context.components.RouterLink.props.to.type
  return routeMap
}

export default {
  install: (app, options) => {
    const callCollectInfo = {
      created () {
        // this.$.appContext.app===app ->true
        // this.$.type===app._component ->true
        // this.$route 当前路由
        // this.$route===app.config.globalProperties.$route ->true
        // this.$router===app.config.globalProperties.$router ->true
        console.log('插件 mixin 对象的钩子被调用')
        const rootTree = fillTree(app, this.$route)
        const routeMap = resolveRouterMap(app.config.globalProperties.$router.getRoutes())
        // window.sessionStorage.setItem('components', JSON.stringify(rootNode))
        console.log(routeMap, rootTree)
      }
    }
    const rootComponet = app._component
    if (rootComponet.mixins) {
      rootComponet.mixins.push(callCollectInfo)
    } else {
      rootComponet.mixins = []
      rootComponet.mixins.push(callCollectInfo)
    }

    // const message = ref('Hello!')
    // const changeMessage = async newMessage => {
    //   message.value = newMessage
    //   await nextTick()
    //   console.log('Now DOM is updated')
    // }
  }

}
