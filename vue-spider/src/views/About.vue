<template>
  <div class="about">
    <div class="news-view">
      <div class="news-list-nav">
        <div class="block">
          <p>提供优质微博、twitter抓取等 </p>
          <p>有问题请联系 </p>
          <p>微博： <a href="https://weibo.com/u/2877151580">程序员金俊</a> </p>
          <p>微信： jinjun199403</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWeibo, findUserById, submit } from '../api';
const debounce = require('debounce');
export default {
  name: 'ItemList',

  components: {
  },

  // props: {
  //   type: String
  // },

  data() {
    return {
      input: ''
    };
  },

  computed: {

  },

  watch: {

  },


  beforeDestroy() {
  },

  methods: {
    inputChange: debounce(function(content) {
      console.log(content);
    //   this.$router.push({
    //     query: this.merge(this.$route.query, { content })
    //   }).catch(err => {});
    }, 300),
    async submit() {
      const loadingInstance = this.$loading({
        text: '查询中'
      });
      const res = await submit(this.input);
      console.log(res.data);
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        loadingInstance.close();
        this.$message(res.data.message || '未知错误');
      });

    }
  }
};
</script>

<style lang="stylus">
.about
  .news-view
    height 100%
    padding-top 160px

  .news-list-nav, .news-list
    background-color #fff
    border-radius 2px

  .news-list-nav
    height 100%
    padding 15px 30px
    position fixed
    text-align center
    top 55px
    left 0
    right 0
    z-index 998
    box-shadow 0 1px 2px rgba(0,0,0,.1)
    a
      margin 0 1em
    .disabled
      color #ccc

  .news-list
    position absolute
    margin 30px 0
    width 100%
    height 30px
    transition all .5s cubic-bezier(.55,0,.1,1)
    ul
      list-style-type none
      padding 0
      margin 0

  .slide-left-enter, .slide-right-leave-to
    opacity 0
    transform translate(30px, 0)

  .slide-left-leave-to, .slide-right-enter
    opacity 0
    transform translate(-30px, 0)

  .item-move, .item-enter-active, .item-leave-active
    transition all .5s cubic-bezier(.55,0,.1,1)

  .item-enter
    opacity 0
    transform translate(30px, 0)

  .item-leave-active
    position absolute
    opacity 0
    transform translate(30px, 0)


@media (max-width 600px)
  .news-list
    margin 10px 0
</style>
