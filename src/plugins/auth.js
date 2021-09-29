/* eslint-disable no-unused-vars */

/**
 * 组件解析
 *  node_modules\@vue\shared\dist\shared.d.ts 273
    ELEMENT = 1,
    FUNCTIONAL_COMPONENT = 2,
    STATEFUL_COMPONENT = 4,
    TEXT_CHILDREN = 8,
    ARRAY_CHILDREN = 16,
    SLOTS_CHILDREN = 32,
    TELEPORT = 64,
    SUSPENSE = 128,
    COMPONENT_SHOULD_KEEP_ALIVE = 256,
    COMPONENT_KEPT_ALIVE = 512,
    COMPONENT = 6  这是一个有毒的数字
 * @param {Array<VNode>} _vChildren 虚拟节点数组
 * @param {*} parentNode 解析的父节点
 * @returns componentNode
 */
function parseComponentTree (_vChildren, parentNode) {
  for (let i = 0; i < _vChildren.length; i++) {
    const _vNode = _vChildren[i]
    if (_vNode.shapeFlag === 6 || _vNode.shapeFlag & (2 + 4 + 256 + 512)) { // 组件节点 寻找component
      const _vComponent = _vNode.component
      if (!_vComponent) {
        console.warn('找到组件component为null', _vNode)
        continue
      }
      const componentNode = ComponentNode(_vComponent, _vNode.shapeFlag, parentNode)
      // ref 被用来给元素或子组件注册引用信息。引用信息将会被注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是那个 DOM 元素；如果用在子组件上，引用就指向组件实
      const vSubTree = _vComponent.subTree
      if (vSubTree.children) {
        parseComponentTree(_vComponent.subTree.children, componentNode)
      }
      if (vSubTree.component) { // 有引用子组件 如果是路由的RouterView 那么_vComponent.subTree.ref.r._value.$==_vComponent.subTree.component==>true
        const vSubComponent = vSubTree.component
        const subComponentNode = ComponentNode(vSubComponent, vSubTree.shapeFlag, componentNode)
        console.info('寻找到关联子树 父组件=', _vComponent, '子组件', vSubTree.component)
        parseComponentTree(vSubComponent.subTree.children, subComponentNode)
      }
    } else { // 寻找普通标签节点里面的组件  找children
      // v_node.children 有可能是文本节点
      if (_vNode.shapeFlag & (16)) { // shapeFlag: 17 16
        parseComponentTree(_vNode.children, parentNode)
      }
    }
  }

  // 组件节点   (componentNode.shapeFlag === 6 || componentNode.shapeFlag & (4 + 16 + 256 + 512))
}
const routerLinkMap = new Map()// k 路径，对应自己的to连接， v 自己的解析节点
const routerViewMap = new Map()// k 当前路径，v RouterView的整个子项
let rootComponentNode
let vRouter
// function ComponentNode() {
//   this.name,
//   this.filePath,
//   this.shapeFlag,
//   this.to,
//   this.isRouter,
//   this.childNodes= [],
//   get fullName(){
//     return this.name+this.filePath
//   }
// }

function ComponentNode (_vComponent, shapeFlag, parentNode) {
  // const componentNode = Object.create({ childNodes: [],parentNode })
  const componentNode = { childNodes: []/*, parentNode */ }
  if (parentNode != null) {
    parentNode.childNodes.push(componentNode)
  }
  componentNode.name = _vComponent.type.name// 组件名
  componentNode.filePath = _vComponent.type.__file// 组键路径
  componentNode.shapeFlag = shapeFlag
  // this.authority = vComponent.type.authority
  switch (componentNode.name) {
    case 'RouterLink':
      componentNode.to = _vComponent.props.to// 路由连接
      // componentNode.matchedPath="xxxxx"
      componentNode.isRouter = true
      routerLinkMap.set(componentNode.to, componentNode)
      break
    case 'RouterView':
      componentNode.isRouter = true

      // routerViewMap.set()
      break
    default :
      componentNode.isRouter = false
  }
  // if (componentNode.isRouter) {
  //   const vMatchedArr = vRouter.currentRoute.value.matched// 代表多个view组件
  //   vMatchedArr.forEach(a => {

  //   })
  //   if (vMatchedArr.l) { vCurrentRoute.matched }
  // }
  return componentNode
}

// function findComponent (components, parentNode) {
//   if (components) {
//     const array = Object.values(components)
//     array.forEach(element => {
//       const node = new parseComponentTree(element.name, element.__file, element.authority)
//       parentNode.childNode.push(node)
//       if (element.components) {
//         findComponent(element.components, node)
//       }
//     })
//   }
// }
// function fillTree (app, currentRoute) {
//   const rootComponent = app._component
//   const rootTree = new parseComponentTree(rootComponent.name, rootComponent.__file, rootComponent.authority, currentRoute.path, currentRoute.name)
//   findComponent(app._component.components, rootTree)
//   return rootTree
// }
// 路由解析
// function resolveRouterMap (routerConfigArr) {
//   const routeMap = new Map()
//   routerConfigArr.forEach(route => { // 路由中寻找组件
//     const comp = route.components.default
//     if (comp instanceof Function) {
//       console.log('Promise 如何拿到路由的懒加载', comp)
//       comp().then(comp => {
//         console.log('懒加载的路由s', comp)
//         const lazyComp = comp.default
//         const lazyCom = new parseComponentTree(lazyComp.name, lazyComp.__file, lazyComp.authority, route.path, route.name)
//         findComponent(lazyComp.components, lazyCom)
//         routeMap.set(route.path, lazyCom)
//       })
//     } else {
//       const com = new parseComponentTree(comp.name, comp.__file, comp.authority, route.path, route.name)
//      findComponent(comp.components, com)
//       routeMap.set(route.path, com)
//     }
//   })
//   console.log(routeMap)
//   // 将路由解析结果挂到组件中
//   // var xx=app._context.components.RouterLink.props.to.type
//   return routeMap
// }

export default {
  install: (app, options) => {
    const callCollectInfo = {
      // created () {
      //   // this.$.appContext.app===app ->true
      //   // this.$.type===app._component ->true
      //   // this.$route 当前路由
      //   // this.$route===app.config.globalProperties.$route ->true
      //   // this.$router===app.config.globalProperties.$router ->true
      //   console.log('插件 mixin 对象的钩子被调用')
      //   const rootTree = fillTree(app, this.$route)
      //   const routeMap = resolveRouterMap(app.config.globalProperties.$router.getRoutes())
      //   // window.sessionStorage.setItem('components', JSON.stringify(rootNode))
      //   console.log(routeMap, rootTree)
      // }

      mounted () {
        document.body.addEventListener('click', e => {
          console.log('---', e, document.getSelection())
          // e.target 是你当前点击的元素
          // e.currentTarget 是你绑定事件的元素
          console.log('e.target=', e.target, 'e.currentTarget', e.currentTarget)
          const recentlyComponent = e.target.__vueParentComponent// 最近的一个组件
          const rootComponet = recentlyComponent.root
          /** if (!rootComponentNode) { // 初始化整个树
            vRouter = recentlyComponent.appContext.config.globalProperties.$router
            rootComponentNode = ComponentNode(rootComponet, -1, null)
            parseComponentTree(rootComponet.subTree.children, rootComponentNode)
          }
          // 向上查找父级，直到遇到路由RouterView为止
          let fragmentUpComponet = recentlyComponent
          while (fragmentUpComponet) {
            if (fragmentUpComponet.type.name === 'RouterView') {
              break
            }
            fragmentUpComponet = fragmentUpComponet.__vueParentComponent
          }
          // 比较查看是否是和根树相同，如果相同就结束
          if (fragmentUpComponet === rootComponet) {
            return
          } */
          vRouter = recentlyComponent.appContext.config.globalProperties.$router
          rootComponentNode = ComponentNode(rootComponet, -1, null)
          parseComponentTree(rootComponet.subTree.children, rootComponentNode)

          console.log('组件树', rootComponentNode)
          // JSON.stringify(rootComponentNode)
          window.sessionStorage.setItem('cTree', JSON.stringify(rootComponentNode))
          // rootComponet.appContext.config.globalProperties.rootComponentNode = rootComponentNode
          // rootComponet.appContext.mixins
          // e.target.__vueParentComponent
          // console.log('---', e, document.getSelection())
        }, false)

        //  const message = ref('Hello!')
        //     const changeMessage = async newMessage => {
        //       message.value = newMessage
        //       await nextTick()
        //       console.log('Now DOM is updated')
        //     }
      }

    }
    const rootComponet = app._component
    if (rootComponet.mixins) {
      rootComponet.mixins.push(callCollectInfo)
    } else {
      rootComponet.mixins = []
      rootComponet.mixins.push(callCollectInfo)
    }

    // 注入全局混入代理
    // app.mixin({
    //   created () {
    //     // this.
    //     const myOption = this.$options.myOption
    //     if (myOption) {
    //       console.log(myOption)
    //     }
    //   }
    // })
  }

}
