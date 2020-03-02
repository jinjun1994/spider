<template>
  <li class="news-item">
    <span class="score">{{ item.weibo_num }}</span>
    <span class="title">
      <template v-if="item.nickname">
        <a
          :href="item.nickname"
          target="_blank"
          rel="noopener"
        >{{ item.nickname }}</a>
        <span class="host"> 关注数： {{ item.following }} 粉丝：{{ item.followers }} </span>
      </template>
      <template v-else>
        <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
      </template>
    </span>
    <br>
    <span class="meta">
      <span
        v-if="item.type !== 'job'"
        class="by"
      >
        <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
      </span>
      <span class="time">
        <!-- 上次抓取 {{ (Date.now() / 1000) | timeAgo }} ago -->
        上次抓取 {{ `十分钟` }} 前
      </span>
      <span
        v-if="item.type !== 'job'"
        class="comments-link"
      >
        | <router-link :to="'/item/' + item.id">{{ item.descendants }} comments</router-link>
      </span>
    </span>
    <span
      v-if="item.type !== 'story'"
      class="label"
    >{{ item.type }}</span>
  </li>
</template>

<script>
import { timeAgo } from '../util/filters';

export default {
  name: 'NewsItem',
  props: ['item'],
  // http://ssr.vuejs.org/en/caching.html#component-level-caching

};
</script>

<style lang="stylus">
.news-item
  background-color #fff
  padding 20px 30px 20px 80px
  border-bottom 1px solid #eee
  position relative
  line-height 20px
  .score
    color #ff6600
    font-size 1.1em
    font-weight 700
    position absolute
    top 50%
    left 0
    width 80px
    text-align center
    margin-top -10px
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      text-decoration underline
      &:hover
        color #ff6600
</style>
