<template>
  <h1>vue 测试$0__vue{{dataTest}}</h1>
  <my-conmp v-if="false">修改插槽值v-if</my-conmp>
   <my-conmp>修改插槽值</my-conmp>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/users/zs">users</router-link> |
    <router-link to="/tableTest">tableTest</router-link> |
    <router-link to="/menuTest">menuTest</router-link> |
    <router-link to="/iframeTree">嵌套扫描组件Tree</router-link>
  </div>
  <router-view />
  <!-- <table-test/> -->
  <blog-post>
    <template v-slot:header>
      <h1>About Me</h1>
    </template>

    <template v-slot:default>
      <p>
        Here's some page content, which will be included in $slots.default.
      </p>
    </template>

    <template v-slot:footer>
      <p>Copyright 2020 Evan You</p>
    </template>
  </blog-post>

</template>
<script>
import MyConmp from './components/MyConmp.vue'
// import TableTest from './components/TableTest.vue'
import BlogPost from './views/BlogPost.vue'
// import TreeCompent from './components/TreeCompent.vue'

export default {
  name: 'RootApp',
  authority: false,
  components: {
    MyConmp,
    BlogPost//,
    // TableTest//,
    // AppLink
    // TreeCompent
  },
  // mixins: [{
  //   created () {
  //     console.log('mixin 对象的钩子被调用')
  //   }
  // }],
  created () {
    console.log(this.$router, this.$route)
    // `this` 指向 vm 实例
    console.log('app->created is: ', this) // => "count is: 1"
  },
  mounted () {
    debugger
    const d = this.$http.post('/web/component-tree', {
      params: this.$data,
      data: { data: this.$data }
    })//, { headers: { AuthData: 'AuthData' } }
    console.log('app->Component is mounted!', this, d)
  },
  data () {
    return {
      dataTest: true
    }
  },
  // template () {
  //   return 'xxxx' //这个没有用
  // }
  render () {
    return 'Hello world!'
  },
  methods: {

  }

  // setup (props, context) {
  //   // Attribute (非响应式对象)
  //   console.log(context.attrs)
  //   // 插槽 (非响应式对象)
  //   console.log(context.slots)

  //   // 触发事件 (方法)
  //   console.log(context.emit)

  //   // mounted
  //   // eslint-disable-next-line no-undef
  //   onMounted(() => {
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
