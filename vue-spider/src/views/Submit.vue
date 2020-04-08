<template>
  <div class="submit">
    <div class="news-view">
      <div class="news-list-nav">
        <div class="block">
          <img

            src="https://jinjun1994.oss-cn-hangzhou.aliyuncs.com/images/zhuye.png"
            alt=""
          >
          <p>将博主主页链接提交到下方，点击提交即可自动爬取。</p>
          <p>抓取完成通知功能正在开发中，新提交博主抓取速度约1万条/小时。</p>
          <p>已在列表中博主每分钟抓取一次</p>
          <el-input
            v-model="input"
            clearable
            :debounce="300"
            style="max-width:500px"
            placeholder="提交微博：请输入主页链接"
            @input="inputChange"
          >
          </el-input>
          <el-button
            :disabled="!input"
            @click="submit"
          >
            提交
          </el-button>
        </div>
        <div class="block">
          <img

            src="https://jinjun1994.oss-cn-hangzhou.aliyuncs.com/images/account.png"
            alt=""
          >
          <p>将微信公众号名称提交到下方，点击提交即可自动爬取。</p>

          <el-input
            v-model="title"
            clearable
            :debounce="300"
            style="max-width:500px"
            placeholder="提交公众号： 请输入公众号名称"
            @input="inputChange"
          >
          </el-input>
          <el-button
            :disabled="!title"
            @click="submitAccount"
          >
            提交
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWeibo, findUserById, submit, submitAccount } from '../api';
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
      input: '',
      title: ''
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

    },
    async submitAccount() {
      const loadingInstance = this.$loading({
        text: '查询中'
      });
      const res = await submitAccount(this.title);
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
.submit
  .news-view
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
