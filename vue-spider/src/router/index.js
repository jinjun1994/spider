import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/people',
    name: 'People',
    component: () => import(/* webpackChunkName: "about" */ '../views/ItemList.vue')
  },
  {
    path: '/weibo',
    name: 'Weibo',
    component: () => import(/* webpackChunkName: "about" */ '../views/WeiboList.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  { path: '/', redirect: '/people' }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
