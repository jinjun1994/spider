<template>
  <li class="news-item">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span
          :to="'/user/'+item.id"
        >
          {{ item.content }}
        </span>
        <span class="host">
          <a
            :href="'https://weibo.com/'+item.user_id+'/'+item.id"
            target="_blank"
            rel="noopener"
          >{{ item.descendants }} 原文</a></span>
        <span
          class="score"
          @click="$router.push({path:`/user/${item.id}`})"
        > {{ item.weibo_num }}</span>
      </div>
      <!-- <template
        v-for="item in item.original_pictures.split(",")"
      >
        <img
          :key="item"
          :src="item"
          class="image"
        >
      </template> -->

      <template
        v-if="item.retweet_pictures&&item.original_pictures!=='无'"
      >
        <!-- <img
          v-for="img in item.original_pictures.split(',')"
          :key="img"
          :src="img"
          class="image"
          referrerpolicy="no-referrer"
        > -->
        <el-image
          v-for="img in item.original_pictures.split(',')"
          :key="img"
          :src="img"
          class="image"
          referrer-policy="no-referrer"
          :preview-src-list="item.original_pictures.split(',')"
        >
        </el-image>
      </template>
      <template
        v-if="item.retweet_pictures&&item.retweet_pictures!=='无'"
      >
        <!-- <img
          v-for="img in item.retweet_pictures.split(',')"
          :key="img"
          :src="img"
          class="image"
          referrerpolicy="no-referrer"
        > -->
        <el-image
          v-for="img in item.retweet_pictures.split(',')"
          :key="img"
          :src="img"
          class="image"
          referrer-policy="no-referrer"
          :preview-src-list="item.retweet_pictures.split(',')"
        >
        </el-image>
      </template>

      <div class="host top">
        <qrcode
          class="qr-code"
          :value="`https://weibo.com/${item.user_id}/${item.id}`"
          :options="{ width: 64 }"
        ></qrcode>
        <a
          :href="'https://weibo.com/'+item.user_id+'/'+item.id+'?type=repost'"
          target="_blank"
          rel="noopener"
        >
          转发 {{ item.retweet_num }} </a>
        <a
          :href="'https://weibo.com/'+item.user_id+'/'+item.id+'?type=comment'"
          target="_blank"
          rel="noopener"
        >
          评论 {{ item.comment_num }}</a>
        <a
          :href="'https://weibo.com/'+item.user_id+'/'+item.id+'?type=like'"
          target="_blank"
          rel="noopener"
        >
          点赞 {{ item.up_num }}
        </a>
      </div>
      <div class="host">
        {{ item.publish_tool }}
        {{ new Date(item.publish_time).toLocaleString() }}
        {{ item.publish_place==='无'?"":item.publish_place }}
        <!-- v-if="$route.name!=='User'" -->
        <a
          v-if="$route.name!=='User'"
          style="cursor: pointer;"
          @click="$router.push({path:`/user/${item.user_id}`})"
        >
          {{ item.author.nickname }}
        </a>
      </div>
    </el-card>
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
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  // http://ssr.vuejs.org/en/caching.html#component-level-caching

};
</script>

<style lang="stylus" scoped >
  .image {
    display: inline-block;
    max-width:32%
  }
.news-item
  background-color #fff
  line-height 20px
  padding 20px 30px 20px 30px
  .box-card:hover
      .hand
        display:inline-block!important;
        margin-left 0.51em

  .hand
     display none
     color  #f60
  .chart
     height:400px
     width:50%
  .score
    color #ff6600
    padding-left 10px
    font-size 1.1em
    font-weight 700
    width 80px
    text-align center
    margin-top -10px
    cursor:pointer
  .host
    margin-left 5px
    position relative
    .qr-code
          width 64px
          position absolute
          right 10px
          top -10px
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      &:hover
        color #ff6600

</style>
