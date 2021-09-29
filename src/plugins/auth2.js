/* eslint-disable no-unused-vars */
import { h } from 'vue'
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
    COMPONENT = 6  这是一个有毒的数字  6=4+2~~~~
 * @param {Array} vNodes 虚拟节点数组
 * @param {*} parentNode 解析的父节点
 * @returns componentNode
 */
function parseComponentTree2 (vNode, parentNode) {
  if (vNode.shapeFlag & 6) { // 组件节点 寻找component 不去找children
    const vComponent = vNode.component// 虚拟节点的组件实例
    const componentNode = new ComponentNode(vComponent, parentNode)
    // 继续寻找当前是否有下一个组件节点
    const vSubTreeVNode = vComponent.subTree// subTree是一个虚拟节点
    parseComponentTree2(vSubTreeVNode, componentNode)

    // ref 被用来给元素或子组件注册引用信息。引用信息将会被注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是那个 DOM 元素；如果用在子组件上，引用就指向组件实
    // if (vSubTree.component) { // 有引用子组件 如果是路由的RouterView 那么_vComponent.subTree.ref.r._value.$==_vComponent.subTree.component==>true
    //   const vSubComponent = vSubTree.component
    //   const subComponentNode = ComponentNode(vSubComponent, vSubTree.shapeFlag, componentNode)
    //   console.info('寻找到关联子树 父组件=', vComponent, '子组件', vSubTree.component)
    //   parseComponentTree(vSubComponent.subTree.children, subComponentNode)
    // }
  }
  if (vNode.shapeFlag & (16)) { // 数组节点
    const vNodes = vNode.children
    for (let i = 0; i < vNodes.length; i++) {
      parseComponentTree2(vNodes[i], parentNode)
    }
  }

  // 组件节点   (componentNode.shapeFlag === 6 || componentNode.shapeFlag & (4 + 16 + 256 + 512))
}

const routerLinkMap = new Map()// k 路径，对应自己的to连接， v 自己的解析节点
const routerViewMap = new Map()// k 当前路径，v RouterView的整个子项
let rootComponentNode
let vRouter
class ComponentNode {
  constructor (_vComponent, parentNode) {
    const vType = _vComponent.type
    const vNode = _vComponent.vnode
    this._uid = _vComponent.uid
    this.name = vType.name != null ? vType.name : vType.__file.substring(vType.__file.lastIndexOf('/') + 1)// 组件名
    this.filePath = vType.__file// 组键路径
    this.shapeFlag = vNode.shapeFlag// 组键标记
    this._el = vNode.el
    this.isRouter = this.name === 'RouterLink' || this.name === 'RouterView'
    if (this.isRouter) {
      this.to = _vComponent.props.to// 路由连接配置 路由
    }
    this.childNodes = []
    if (parentNode) {
      parentNode.childNodes.push(this)
    }
  }
}
export default {

  install: (app, options) => {
    const callCollectInfo = {
      mounted () {
        document.body.addEventListener('click', e => {
          console.log('---', e, document.getSelection())
          // e.target 是你当前点击的元素
          // e.currentTarget 是你绑定事件的元素
          console.log('e.target=', e.target, 'e.currentTarget', e.currentTarget)
          let recentlyComponent = e.target.__vueParentComponent// 最近的一个组件
          if (recentlyComponent == null) {
            recentlyComponent = e.target.__vue_app__._instance
          }
          const vRootComponet = recentlyComponent.root
          const rootComponentNode = new ComponentNode(vRootComponet, null)
          // vRouter = recentlyComponent.appContext.config.globalProperties.$router
          parseComponentTree2(vRootComponet.subTree, rootComponentNode)

          console.log('组件树', rootComponentNode)
          // JSON.stringify(rootComponentNode)
          window.sessionStorage.setItem('cTree', JSON.stringify(rootComponentNode))
          // rootComponet.appContext.config.globalProperties.rootComponentNode = rootComponentNode
          // rootComponet.appContext.mixins
          // e.target.__vueParentComponent
          // console.log('---', e, document.getSelection())
        }, false)
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
    app.mixin({
      created () {
        const typeName = this.$.type.name
        if (typeName === 'ElTableColumn') {
          console.log(typeName)
          const target = this.$.render
          const handler = {
            noAuth: (ctx) => [
              h('h1', {}, '隐身')
            ],
            apply: function (target, ctx, args) {
              // if (!ctx.isAuth) {
              return Reflect.apply(target, ctx, args)
              // } else {
              // return this.noAuth(ctx)
              // }
            }
          }
          var proxy = new Proxy(target, handler)
          this.$.render = proxy
          console.log(this, target)
        }
      }
    })
  }

}
