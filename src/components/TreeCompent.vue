
<template>
  <div class="custom-tree-container">
    <iframe id="iframeTest" title="寻找组件与树通讯" name="组件拾取" width="50%" height="500" src="/"></iframe>
    <div class="block">
      <button @click="openScan">开启组件扫描</button>
       <button @click="saveTree">保存组件配置</button>
        <button @click="useTree">使用组件配置</button>
      <p>扫描页面框中的组件</p>
      <el-tree
        :data="componentTree"
        node-key="uniqueFlag"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent"
      >
      </el-tree>
  </div>
</div>
</template>

<script>
/* eslint-disable no-unused-vars */

// import authPlugin from './plugins/auth2'
import { MessageNotify, START_COMPONENT_LISTENER } from '@/plugins/auth2'
const id = 1000
const routerLinkMap = new Map()// k 路径，对应自己的to连接， v 自己的解析节点
const routerViewMap = new Map()// k 当前路径，v RouterView的整个子项
/**
 * 比较并合并两个树，按照如下规则
比较并找出routerLink
将新树合并到老树
如果新树有节点，老树没有，那么直接吧新树的给老树
对于有RouterLink的则根据路由，直接将RouterView下的树挂载过去
 */
function compareTree (oldTrees, newTrees, currentRoute) { // 后端id===前段uniqueFlag 都可以作为唯一标识
  const maxOldIndex = oldTrees.length
  const maxNewIndex = newTrees.length
  for (let i = 0; i < maxOldIndex || i < maxNewIndex; i++) {
    if (i < maxOldIndex && i < maxNewIndex) { // 比较两个树
      const oldNode = oldTrees[i]
      const newNode = newTrees[i]
      oldNode.isSame = oldNode.uniqueFlag === newNode.uniqueFlag// 是否相同
      if (!oldNode.isSame) { // 不同 ,需要用户参与选择使用那个
        oldNode.diffTree = newNode
      }
      if (oldNode.name === 'RouterView' && oldNode.isSame) { // 老树的view下的全部换成新路由的值，因此只需要直接赋值即可
      // 嵌套路由等，命名路由等，待完善
        oldNode.childNodes = newNode.childNodes
      } else {
        compareTree(oldNode.childNodes, newNode.childNodes, currentRoute)
      }
    }
    if (i >= maxNewIndex) { // 余下老树，全设置不同标记，由后面用户自己决定是覆盖，还是新增，还是删除
      oldTrees[i].isSame = false
    }
    if (i >= maxOldIndex) { // 剩下新树自动移动到老树
      oldTrees[i] = newTrees[i]
    }
    // 'RouterLink'  'RouterView'
    if (oldTrees[i].name === 'RouterLink') {
      routerLinkMap.set(oldTrees[i].props.to, oldTrees[i])
    }
    if (oldTrees[i].name === 'RouterView') { // 老树的view下的全部换成新路由的值，因此只需要直接赋值即可
      // 嵌套路由等，命名路由等，待完善
      routerViewMap.set(currentRoute.fullPath, oldTrees[i])
    }
  }
}

function fillRouterLinkbyView () {
  for (const [key, value] of routerViewMap) {
    console.log(key, value)
    routerLinkMap.get(key).childNodes = value.childNodes
  }
  routerViewMap.clear()
  routerViewMap.clear()
}
// name: this.name,
// filePath: this.filePath,
// shapeFlag: this.shapeFlag,
// childNodes: this.childNodes,
// sequence: this.sequence,
// uniqueFlag: this.uniqueFlag,
// accessPath: this.accessPath

export default {
  name: 'TreeCompent',
  data () {
    return {
      componentTree: [],
      defaultProps: {
        children: 'childNodes',
        label: 'name'
      }
    }
  },
  created () {
    const data = window.localStorage.getItem('componentTreeConfig')
    const componentTree = JSON.parse(data)
    if (componentTree) {
      this.componentTree = [...componentTree]
    }
  },

  mounted () {
    const _this = this
    let otherWin = null
    function receiveMessage (event) {
      if (event.source === window) {
        // console.log('树忽略自己', window.location, 'data=', event.data, event)
        return
      }
      debugger
      const newTrees = new Array(JSON.parse(event.data.dataJson))
      const currentRoute = JSON.parse(event.data.currentRouteJson)
      console.log('树收到的信息', event, 'data=', event.data, 'origin=', event.origin, 'source=', event.source)
      const oldTrees = _this.componentTree
      // 比较两个树，并找到相关的路由link,将相关的组件挂载过去
      console.log('新旧树', oldTrees, newTrees)
      // 合并树
      compareTree(oldTrees, newTrees, currentRoute)
      fillRouterLinkbyView()
      // const proxy0 = JSON.stringify(_this.componentTree.pop())
      // _this.componentTree.push(JSON.parse(proxy0))
      _this.componentTree = [...oldTrees]
      // 假设你已经验证了所受到信息的origin (任何时候你都应该这样做), 一个很方便的方式就是把event.source
      // 作为回信的对象，并且把event.origin作为targetOrigin
      otherWin = event.source
      // event.source.postMessage(new MessageNotify(), event.origin)
    }
    // 这里添加对另外一个窗口的组件树的监听
    window.addEventListener('message', receiveMessage, false)
    // 发个消息告诉子窗口开始点击扫描树
    // window.postMessage(new MessageNotify('startBodyListener', null), '*')
    // document.getElementById('iframeTest').contentWindow.postMessage(new MessageNotify('startBodyListener', null), '*')
  },
  unmounted () {
    console.log('离开树了，卸载监听')
    // window.removeEventListener('message')
  },
  methods: {
    openScan (event) {
      // 开启点击触发树刷新
      const iframeWindown = document.getElementById('iframeTest').contentWindow
      iframeWindown.postMessage(new MessageNotify(START_COMPONENT_LISTENER, null), iframeWindown.origin)
    },

    openCloseAuth (data) {
      data.needAuth = !data.needAuth
      this.data = [...this.data]
    },
    dataLevelAuth (data) {
      data.needDataAuth = !data.needDataAuth
      this.data = [...this.data]
    },
    saveTree () {
      window.localStorage.setItem('componentTreeConfig', JSON.stringify(this.componentTree))
      alert('保存成功')
    },
    useTree () {
      localStorage.setItem('useTreeConfig', JSON.stringify(this.componentTree))
      alert('重置使用的配置，并使其生效')
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
      this.data = [...this.data]
    },

    renderContent (h, { node, data, store }) {
      // debugger
      return h('span', { class: 'custom-tree-node' },
        h('span', null, node.label),
        h('span', null,
          h('a', { onClick: () => this.openCloseAuth(data) }, data.needAuth ? '关闭权限' : '开启权限'),
          h('span', null, ' | '),
          h('a', { onClick: () => this.dataLevelAuth(data) }, data.needDataAuth ? '关闭数据级权限' : '开启数据级权限')
        )
      )
    }
  }
}
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
