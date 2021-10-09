/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import { h, resolveComponent } from 'vue'
import AuthRule from './AuthRule.vue'

class DefaultOptions {
  constructor (interceptModel, configModel) {
    this.interceptModel = interceptModel === null ? true : interceptModel// 默认开启拦截
    this.configModel = configModel === null ? false : configModel// 默认关闭配置模式
  }
}

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
function parseComponentTree (vNode, parentNode) {
  if (vNode == null) {
    return
  }
  if (vNode.shapeFlag & 6) { // 组件节点 寻找component 不去找children
    const vComponent = vNode.component// 虚拟节点的组件实例
    const componentNode = new ComponentNode(vComponent, parentNode)
    // 继续寻找当前是否有下一个组件节点
    const vSubTreeVNode = vComponent.subTree// subTree是一个虚拟节点
    parseComponentTree(vSubTreeVNode, componentNode)

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
      parseComponentTree(vNodes[i], parentNode)
    }
  }

  // 组件节点   (componentNode.shapeFlag === 6 || componentNode.shapeFlag & (4 + 16 + 256 + 512))
}

class ComponentNode {
  constructor (_vComponent, parentNode) {
    const vType = _vComponent.type
    const vNode = _vComponent.vnode
    this.uid = _vComponent.uid
    this.name = vType.name != null ? vType.name : vType.__file.substring(vType.__file.lastIndexOf('/') + 1)// 组件名
    this.filePath = vType.__file// 组键路径
    this.shapeFlag = vNode.shapeFlag// 组键标记
    // this.isRouter = this.name === 'RouterLink' || this.name === 'RouterView'
    this.childNodes = []
    this.sequence = 0// 默认自己是0
    if (parentNode) {
      const parentChildNodes = parentNode.childNodes
      parentChildNodes.push(this)
      this.sequence = parentChildNodes.length - 1
    }
    this.parentNode = parentNode

    this.props = JSON.parse(JSON.stringify(_vComponent.props, (key, value) => { // 提前验证能转json的
      if (key === 'context') { // 循环引用的临时方法
        return value.type ? value.type.name : value
      }
      return value
    }))
    this._vnode = vNode
    // 这里要结合路由 将RouterLink 变成RouterView 以便

    // 唯一标记将名字相同的视为同一个功能点
    this.uniqueFlag = parentNode ? (parentNode.uniqueFlag + ':' + this.name + '[' + this.sequence + ']') : (this.name + '[' + this.sequence + ']')
    // 访问路径，顶层就是一个数组为[0]
    this.accessPath = parentNode ? (parentNode.accessPath + '.' + 'childNodes[' + this.sequence + ']') : ('[' + this.sequence + ']')
  }

  toJSON () {
    return {
      name: this.name,
      filePath: this.filePath,
      shapeFlag: this.shapeFlag,
      childNodes: this.childNodes,
      sequence: this.sequence,
      uniqueFlag: this.uniqueFlag,
      accessPath: this.accessPath,
      props: this.props,
      needAuth: false,
      needDataAuth: false
    }
  }
}

export class MessageNotify {
  constructor (massageType, data, currentRoute) {
    this.massageType = massageType
    this.dataJson = data ? JSON.stringify(data) : data
    // this.dataJson = data ? data.toJSON() : data
    this.currentRouteJson = currentRoute ? JSON.stringify(currentRoute.value) : currentRoute
  }
}

export const START_COMPONENT_LISTENER = 'startBodyListener'
export const NEW_COMPONENT_TREE = 'newComponetTree'
// export const START_COMPONENT_LISTENER = 'startBodyListener'

// const routerLinkMap = new Map()// k 路径，对应自己的to连接， v 自己的解析节点
// const routerViewMap = new Map()// k 当前路径，v RouterView的整个子项
// let vRouter

class EachOtherNotify {
  constructor (app) {
    this.app = app
    this.hasWindownListener = false
    this.hasBodyListener = false
    this.otherWin = null
  }

  registerWindownEventListener () { // 注册窗口监听 用于不同窗口间通讯
    if (!this.hasWindownListener) {
      const _this = this
      window.addEventListener('message', function (event) {
        return _this.windowMsgHandle(event)
      })
      this.hasWindownListener = true
    } else {
      console.log('已经有一个监听，不需要再注册了 hasWindownListener', this)
    }
  }

  registerBodyClickEventListener () { // 注册body点击监听
    if (!this.hasBodyListener) {
      const _this = this
      document.body.addEventListener('click', e => {
        _this.scanTreeAndSendMsg(e)
      }, false)
      this.hasBodyListener = true
    } else {
      console.log('已经有一个监听，不需要再注册了 hasBodyListener', this)
    }
  }

  scanTreeAndSendMsg (e) { // 每次点击都扫描树并发送数据到另外一个窗口
    const vRootComponet = this.app._instance
    const rootComponentNode = new ComponentNode(vRootComponet, null)
    // vRouter = recentlyComponent.appContext.config.globalProperties.$router
    parseComponentTree(vRootComponet.subTree, rootComponentNode)
    console.log('组件树==', rootComponentNode)
    // 将数据传递给外部的树去接受
    const currentRoute = this.app.config.globalProperties.$router.currentRoute
    this.otherWin.source.postMessage(new MessageNotify(NEW_COMPONENT_TREE, rootComponentNode, currentRoute), this.otherWin.origin)// http://localhost:8080/#/iframeTree'
  }

  windowMsgHandle (winEvent) { // 处理窗口消息，与上乘进行消息交互
    if (winEvent.source === window) {
      // console.log('Auth忽略自己', window.location, 'data=', winEvent.data, winEvent)
      return
    }
    this.otherWin = winEvent
    // 接收消息 开始监听body所有点击事件，以便实时组件收集。
    const messageNotify = winEvent.data
    console.log('Auth收到的信息', winEvent, 'data=', messageNotify, 'origin=', winEvent.origin, 'source=', winEvent.source)
    if (messageNotify.massageType) {
      switch (messageNotify.massageType) {
        case START_COMPONENT_LISTENER:// 收到开启body的监听，用于
          this.registerBodyClickEventListener()
          this.scanTreeAndSendMsg()
      }
    }
  }
}

function findMySelfSequence (vSubTreeVNode, mySelfComponent, selfPosition) {
  // const vSubTreeVNode = parentComponent.subTree
  if (vSubTreeVNode.shapeFlag & 6) { // 只有一个组件就是自己
    if (vSubTreeVNode.component !== mySelfComponent) { // vSubTreeVNode.el==null
      // ++lastIndex
      selfPosition.sequence++
    } else {
      return selfPosition
    }
  }
  if (vSubTreeVNode.shapeFlag & (16)) { // 数组节点
    const vNodes = vSubTreeVNode.children
    for (let i = 0; i < vNodes.length; i++) {
      const sequence = findMySelfSequence(vNodes[i], mySelfComponent, selfPosition)
      if (sequence !== undefined) { // 服了，0的时候直接给undefined
        return sequence
      }
    }
  }
}

class SelfPosition {
  constructor (selfType) {
    this.sequence = 0
    this.componentName = selfType.name != null ? selfType.name : selfType.__file.substring(selfType.__file.lastIndexOf('/') + 1)// 组件名
    this.uniqueFlag = null
    this.accessPath = null
  }

  setUniqueFlag (parent) {
    parent = parent ? parent.selfPosition ? parent : parent.$.ctx : parent// ctx 不是this的情况？why
    this.uniqueFlag = parent ? (parent.selfPosition.uniqueFlag + ':' + this.componentName + '[' + this.sequence + ']') : (this.componentName + '[' + this.sequence + ']')
    this.accessPath = parent ? (parent.selfPosition.accessPath + '.' + 'childNodes[' + this.sequence + ']') : ('[' + this.sequence + ']')
  }
}

/**
 * 根据配置树，及当前路由信息，动态生成运行时匹配的树
 */
class DynamicPraseTree {
    routerLinkMap = new Map()// k 路径，对应自己的to连接， v 自己的解析节点 RouterLink
    //  routerViewMap = new Map()// k 当前路径，v RouterView 的整个子项
    routerViewArr = []
    constructor (useTreeConfigs) {
      this.useTreeConfigs = useTreeConfigs
      this.prase(useTreeConfigs)
    }

    prase (treeNodes) { // 拆解路由
      for (let i = 0; i < treeNodes.length; i++) {
        const node = treeNodes[i]
        if (node.name === 'RouterLink') {
          this.routerLinkMap.set(node.props.to, node.childNodes)
          continue
        }
        if (node.name === 'RouterView') {
        // routerViewMap.set(node.props.to,node)
        // 多个展示节点，需要记录为准来精确匹配，待做
          this.routerViewArr.push(node)
          continue
        }
        this.prase(node.childNodes)
      }
    }

    getCurrentRouterTree (currentRoute) {
      const childNodes = this.routerLinkMap.get(currentRoute.path)
      for (let i = 0; i < this.routerViewArr.length; i++) {
        this.routerViewArr[i].childNodes = childNodes
      }
      return this.useTreeConfigs
    }
}
export default {

  install: (app, options) => {
    // 全局注册相关的组件
    app.component('AuthRule', AuthRule)
    // debugger
    const msgNotify = new EachOtherNotify(app)
    msgNotify.registerWindownEventListener()

    // 注入全局混入代理  这里对比是否需要拦截或者展示auth按钮配置
    // 默认开启
    app.mixin({
      data () {
        return {
          dataRule: { a: 'a' }
        }
      },
      beforeCreate () {
      // debugger
      // console.log('beforeCreate', this)
        const parent = this.$parent
        const mySelfComponent = this.$

        // <transition> 元素作为单个元素/组件的过渡效果。<transition> 只会把过渡效果应用到其包裹的内容上，
        // 而不会额外渲染 DOM 元素，也不会出现在可被检查的组件层级中。
        // todo 动画组件的完善？？
        // if (mySelfComponent.type.name.endsWith('Transition')) { // transition
        //   console.log('内部组件', mySelfComponent)
        //   return
        // }
        let useTreeConfig = this.useTreeConfig
        if (!useTreeConfig) {
          const use = JSON.parse(localStorage.getItem('useTreeConfig'))
          if (!use) {
            return
          }
          const dynamicPraseTree = new DynamicPraseTree(use)
          // .config.globalProperties.$router.currentRoute.value
          useTreeConfig = dynamicPraseTree.getCurrentRouterTree(this.$router.currentRoute.value)
          this.useTreeConfig = useTreeConfig
        }

        let selfPosition = new SelfPosition(mySelfComponent.type)
        if (parent !== null) { // 内部组件的特殊情况。这里特殊处理
          selfPosition = findMySelfSequence(parent.$.subTree, mySelfComponent, selfPosition) ? selfPosition : selfPosition
        }
        selfPosition.setUniqueFlag(parent)
        this.selfPosition = selfPosition

        let needAuth = false
        let needDataAuth = false
        try {
          // eslint-disable-next-line no-eval
          const treeConfig = eval('useTreeConfig' + selfPosition.accessPath)
          if (treeConfig.uniqueFlag === selfPosition.uniqueFlag) {
            needAuth = treeConfig.needAuth
            needDataAuth = treeConfig.needDataAuth
            console.log('treeConfig', treeConfig)
          } else {
            // console.warn('运行时树与配置树不一致', selfPosition, useTreeConfig)
          }
        } catch (error) {
          // console.warn('运行时树与配置树不一致', selfPosition, useTreeConfig, error)
          needAuth = false
        }// 从这里要得到访问的准确路

        if (needAuth) { // 组件优先级最高 && vc.props.label === 'Operations' typeName === 'RouterLink'
          const target = mySelfComponent.render
          const handler = {
            apply: function (target, ctx, args) {
              if (!needAuth) {
                return Reflect.apply(target, ctx, args)
              } else { // 组件不需要渲染，这时它可以返回 null。这样我们在 DOM 中会渲染一个注释节点。
                return null
              }
            }
          }
          const proxy = new Proxy(target, handler)
          mySelfComponent.render = proxy
          console.log(this, target)
        } else if (needDataAuth) { // 显示数据级弹框规则配置
        // if (typeName === 'ElTableColumn' && this.$props && this.$props.label === 'Operations') {
          // debugger
          const slot = this.$.slots.default
          // <el-button type="text" size="small">Edit</el-button> AuthRule ElButton
          const AuthRule = resolveComponent('AuthRule')
          const currentRowKey = this.$parent.currentRowKey

          const proxy = new Proxy(slot, {
            apply: function (target, ctx, args) {
            // 这一定是个数组
              return Reflect.apply(target, ctx, args).concat(
                h(AuthRule, { rowData: args, currentRowKey }, args))
            }
          })
          this.$.slots.default = proxy
        }
      }

    })
  }

}
