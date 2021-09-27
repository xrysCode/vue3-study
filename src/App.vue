<template>
  <h1>vue 测试$0__vue{{dataTest}}</h1>
  <my-conmp v-if="false">修改插槽值v-if</my-conmp>
   <my-conmp>修改插槽值</my-conmp>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/users/zs">users</router-link>

  </div>
  <router-view />

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
  </blog-post> -->
   <!-- 如果 router-view 没有设置名字，那么默认为 default -->
  <!-- <router-view class="view left-sidebar" name="LeftSidebar"></router-view> -->
  <!-- <tree-compent/> -->

  <!-- <AppLink
    v-bind="$attrs"
    class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 focus:outline-none transition duration-150 ease-in-out hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
    active-class="border-indigo-500 text-gray-900 focus:border-indigo-700"
    inactive-class="text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300"
  >嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻
    <slot />
  </AppLink> -->

</template>
<script>
import MyConmp from './components/MyConmp.vue'
import BlogPost from './views/BlogPost.vue'
// import AppLink from './router/AppLink.vue'
// import TreeCompent from './components/TreeCompent.vue'

export default {
  name: 'RootApp',
  authority: false,
  components: {
    MyConmp,
    BlogPost//,
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
    console.log('app->Component is mounted!', this)
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
