<template>
  <div class="custom-tree-container">
  <div class="block">
    <p>使用 render-content</p>
    <el-tree
      :data="data"
       node-key="filePath"
      :props="defaultProps"
      show-checkbox
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
    >
    </el-tree>
  </div>
  <!-- <div class="block">
    <p>使用 scoped slot</p>
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a @click="append(data)"> Append </a>
            <a @click="remove(node, data)"> Delete </a>
          </span>
        </span>
      </template>
    </el-tree>
  </div> -->
</div>
</template>

<script>
let id = 1000

export default {
  data () {
    const data = window.sessionStorage.getItem('components')
    debugger
    // id: 1,
    // label: '一级 1',
    // children:
    // name: app._component.name,
    //   filePath: app._component.__file,
    //   authority: app.authority,
    //   childNode: []
    return {
      data: [JSON.parse(data)],
      defaultProps: {
        children: 'childNode',
        label: 'filePath'
      }
    }
  },
  computed: {
    // 计算属性的 getter
    namePath () {
      debugger
      // `this` 指向 vm 实例
      return this.name + this.filePath
    }
  },
  methods: {
    append (data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        data.children = []
      }
      data.children.push(newChild)
      this.data = [...this.data]
    },

    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
      this.data = [...this.data]
    },

    renderContent (h, { node, data, store }) {
      return h(
        'span',
        {
          class: 'custom-tree-node'
        },
        h('span', null, node.label),
        h(
          'span',
          null,
          h(
            'a',
            {
              onClick: () => this.append(data)
            },
            'Append 隐藏'
          ),
          h(
            'a',
            {
              onClick: () => this.remove(node, data)
            },
            'Delete 添加权限'
          )
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
