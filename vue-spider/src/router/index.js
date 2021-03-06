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
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue')
  },
  {
    path: '/accounts',
    name: 'Account',
    component: () => import(/* webpackChunkName: "about" */ '../views/AccountList.vue')
  },
  {
    path: '/account/:account',
    name: 'Account',
    component: () => import(/* webpackChunkName: "about" */ '../views/ArticleList.vue')
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import(/* webpackChunkName: "about" */ '../views/ArticleList.vue')
  },
  {
    path: '/user/:user_id',
    name: 'User',
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue')
  },
  {
    path: '/submit',
    name: 'Submit',
    component: () => import(/* webpackChunkName: "about" */ '../views/Submit.vue')
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
