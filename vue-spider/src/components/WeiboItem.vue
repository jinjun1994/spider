<template>
  <li class="news-item">
    <span class="score">{{ item.weibo_num }}</span>
    <span class="title">
      <template v-if="item.content">
        <a
          :href="'https://weibo.com/'+item.user_id+'/'+item.id"
          target="_blank"
          rel="noopener"
        >
          {{ item.content }}
        </a>
        <span class="host top">
          <a
            :href="'https://weibo.com/'+item.user_id+'/'+item.id+'?type=repost'"
            target="_blank"
            rel="noopener"
          >转发{{ item.retweet_num }} </a>
          <a
            :href="'https://weibo.com/'+item.user_id+'/'+item.id+'?type=comment'"
            target="_blank"
            rel="noopener"
          >   评论：{{ item.comment_num }}</a>
          <a
            :href="'https://weibo.com/'+item.user_id+'/'+item.id+'?type=like'"
            target="_blank"
            rel="noopener"
          >  点赞 {{ item.up_num }} </a>


        </span>
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
        发布时间 {{ new Date(item.publish_time).toLocaleString() }}
      </span>
      <span
        v-if="item.type !== 'job'"
        class="comments-link"
      >
        | <a
          :href="'https://weibo.com/'+item.user_id+'/'+item.id"
          target="_blank"
          rel="noopener"
        >{{ item.descendants }} 原文</a>
      </span>
    </span>
    <span
      v-if="item.type !== 'story'"
      class="label"
    >{{ item.type }}</span>
  </li>
</template>

<script>
// {
// "_id": "5e5b6361325f3919b183c708",
// "id": "IwvgshzrD",
// "content": "[置顶]王川：宁要高维度抽象化的草，不要低维度具象化的苗  ",
// "original_pictures": "无",
// "video_url": "无",
// "publish_place": "无",
// "publish_time": "2020-02-29T16:45:00.000Z",
// "publish_tool": "Android",
// "up_num": 46,
// "retweet_num": 65,
// "comment_num": 11,
// "user_id": "5339148412"
// },
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
  .top
    display:block
    margin-top 5px
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      &:hover
        color #ff6600
</style>
