<template>
  <my-conmp/>
   <my-conmp/>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view/>
  <tree-compent/>
</template>

<script>
import MyConmp from './components/MyConmp.vue'
import TreeCompent from './components/TreeCompent.vue'

export default {
  name: 'RootApp',
  authority: false,
  components: {
    MyConmp,
    TreeCompent
  },
  // created () {
  //   debugger
  //   // `this` 指向 vm 实例
  //   console.log('app->created is: ', this) // => "count is: 1"
  // },
  mounted () {
    debugger
    console.log('app->Component is mounted!')
  }
  // setup (props, context) {
  //   // Attribute (非响应式对象)
  //   console.log(context.attrs)
  //   debugger
  //   // 插槽 (非响应式对象)
  //   console.log(context.slots)

  //   // 触发事件 (方法)
  //   console.log(context.emit)

  //   // mounted
  //   // eslint-disable-next-line no-undef
  //   onMounted(() => {
  //     debugger
  //     console.log('setup->Component is mounted!')
  //   })
  //   // eslint-disable-next-line no-undef
  //   // created(() => {
  //   //   console.log('Component is created!')
  //   // })
  // }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
