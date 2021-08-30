import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/user",
    component: () =>
      import(
        /* webpackChunkName: "UserIndex" */ "../views/user/Index.vue"
      ),
    children: [
      {
        path: 'register',
        name: 'Register',
        component: () => import(/* webpackChunkName: "Register" */ '../views/user/Register.vue')
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
