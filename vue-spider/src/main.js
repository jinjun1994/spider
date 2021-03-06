// /* global Vue mapboxgl */
// import Vue from 'vue';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import ProgressBar from './components/ProgressBar.vue';
// import './plugins/element.js';
import merge from 'webpack-merge';

import VueQrcode from '@chenfengyuan/vue-qrcode';


const Vue = window.Vue;

Vue.component(VueQrcode.name, VueQrcode);

Vue.prototype.merge = merge;
// eslint-disable-next-line
Vue.prototype.ossurl = "https://jinjun1994.oss-cn-hangzhou.aliyuncs.com";
Vue.config.errorHandler = function(err, vm, info) {
  // axios 出错信息
  const message = err.response && err.response.data.error;
  vm.$message.error(message || err.message || err);
  if (process.env.NODE_ENV !== 'production') throw err;
};
Vue.config.productionTip = false;
// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount();
// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c));
    });
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);
    if (!asyncDataHooks.length) {
      return next();
    }

    bar.start();
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        bar.finish();
        next();
      })
      .catch(next);
  });
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
