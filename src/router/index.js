import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入用户列表组件
import UserList from '@/components/userList.vue'
import UserDetail from '@/components/UserDetail.vue'

Vue.use(VueRouter)
// 创建路由实例对象
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/users' },
    { path: '/users', component: UserList },
    { path: '/users/:id', component: UserDetail, props: true },
  ]
})

export default router