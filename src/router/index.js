import { createRouter, createWebHashHistory } from 'vue-router' // createWebHistory
import Home from '../views/Home.vue'
import MyConmp from '../components/MyConmp.vue'
import User from '../views/User.vue'
import About from '../views/About.vue'
import TableTest from '../components/TableTest.vue'
import MenuTest from '../components/MenuTest.vue'

const routes = [
  {
    path: '/',
    name: 'AppHome',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/MyConmp',
    name: 'MyConmp',
    component: MyConmp
  },
  // 动态段以冒号开始 像 /users/johnny 和 /users/jolyne 这样的 URL 都会映射到同一个路由。
  {
    path: '/users/:id',
    component: User,
    children: [
      {
        // 当你访问 /user/eduardo 时，在 User 的 router-view 里面什么都不会呈现，因为没有匹配到嵌套路由。
        // 也许你确实想在那里渲染一些东西。在这种情况下，你可以提供一个空的嵌套路径：
        path: '',
        component: MyConmp
      },
      {
        // 当 /user/:id/profile 匹配成功
        // Home 将被渲染到 User 的 <router-view> 内部
        path: 'h',
        component: Home
      }
    ]
  },
  {
    name: 'tablePath',
    path: '/tableTest',
    component: TableTest
  },
  {
    name: 'menuTest',
    path: '/menuTest',
    component: MenuTest
  },

  {
    path: '/index',
    components: {
      default: Home,
      // LeftSidebar: LeftSidebar 的缩写
      About,
      // 它们与 `<router-view>` 上的 `name` 属性匹配
      MyConmp
    }
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
