<template>
  <div class="news-item">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <router-link
          :to="'/user/'+item.id"
        >
          {{ item.nickname }}
        </router-link>
        <span
          class="score"
          @click="$router.push({path:`/user/${item.id}`}).catch(err=>{})"
        > {{ item.weibo_num }}</span>
        <!-- <el-button
          style="float: right; padding: 3px 0"
          type="text"
        >
          操作按钮
        </el-button> -->
      </div>
      <div class="host">
        关注数： {{ item.following }}
      </div>
      <div class="host">
        粉丝：{{ item.followers }}
      </div>
      <div
        v-if="page===1&&user_id"
        class="host"
      >
        <el-image
          v-if="item.nickname"
          :src="`${ossurl}/weibos/${item.nickname}/${item.id}.csv.png`"
          class="image"
          :preview-src-list="[`${ossurl}/weibos/${item.nickname}/${item.id}.csv.png`]"
        >
        </el-image>
        <!-- <img
          :src="`/weibos/${item.nickname}/${item.id}.csv.png`"
          class="image"
          referrer-policy="no-referrer"
        /> -->
      </div>
      <div class="host">
        上次抓取 {{ new Date(item.time).toLocaleString() }}
      </div>
      <div class="host">
        微博合集下载：
        <a
          style="margin: 0 0.5em"
          :href="`${ossurl}/weibos/${item.nickname}/${item.id}.csv`"
          :download="`${item.nickname}.csv`"
        >  excel格式</a>
        <a
          style="margin: 0 0.5em"
          :href="`${ossurl}/weibos/${item.nickname}/${item.id}.txt`"
          :download="`${item.nickname}.txt`"
        >  text格式</a>
        <a
          style="margin: 0 0.5em"
          :href="`${ossurl}/weibos/${item.nickname}/${item.id}.json`"
          :download="`${item.nickname}.json`"
        >  json格式</a>
      </div>
    </el-card>
  </div>
</template>

<script>
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
  computed: {
    page() {
      return Number(this.$route.query.page) || 1;
    },

    user_id() {
      return this.$route.params.user_id;
    },

  },
  // http://ssr.vuejs.org/en/caching.html#component-level-caching

};
</script>

<style lang="stylus" >
.news-item
  background-color #fff
  line-height 20px
  padding 20px 30px 20px 30px
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
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      &:hover
        color #ff6600
</style>
