<template>
  <li class="news-item">
    <el-card
      class="box-card"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span>
          <b> {{ item.title }}</b>
        </span>
        <p>
          摘要： {{ item.digest }}
        </p>
        <!-- <img
          :src="item.cover"
          alt=""
          srcset=""
        > -->

        <!-- <span class="host">
          <a
            :href="'https://weibo.com/'+item.user_id+'/'+item.id"
            target="_blank"
            rel="noopener"
          >{{ item.descendants }} 原文</a>
        </span> -->
        <!-- <span
          class="score"
          @click="$router.push({path:`/user/${item.id}`})"
        > {{ item.weibo_num }}</span> -->
      </div>


      <div class="host top">
        <qrcode
          class="qr-code"
          :value="url"
          :options="{ width: 80 }"
        ></qrcode>
        <a
          target="_blank"
          rel="noopener"
          @click="$router.push({path:`/account/${item.account}`}).catch(err => {})"
        >
          作者: {{ item.author?item.author:item.account }} </a>
      </div>

      <div class="host">
        {{ item.publish_tool }}
        发布时间 {{ new Date(item.publish_time).toLocaleString() }}
        {{ item.publish_place==='无'?"":item.publish_place }}
        <!-- v-if="$route.name!=='User'" -->
        <a
          v-if="$route.name!=='User'"
          style="cursor: pointer;"
          @click="$router.push({path:`/user/${item.user_id}`})"
        >
          {{ item.author.nickname }}
        </a>
        <a
          v-if="$route.name!=='User'"
          style="cursor: pointer;"
          @click="openUrl"
        >
          点击阅读
        </a>
        <a
          v-if="$route.name!=='User'"
          style="margin: 0 0.5em"
          target="_blank"
          :href="`${pdfUrl}`"
          :download="`${item.title}.pdf`"
        >  pdf下载</a>
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
const parseUrl = require('parse-url');
const filenamify = require('filenamify');
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
  data() {
    return {
    };
  },
  computed: {
    url() {
      const { protocol, resource, pathname, query: { __biz, mid, idx, sn } } = parseUrl(this.item.url, false);
      return `${protocol}://${resource}${pathname}?__biz=${__biz}&mid=${mid}&idx=${idx}&sn=${sn}`;
    },
    pdfUrl() {
      return `${this.ossurl}/articles/${this.item.biz}/${filenamify(this.item.title)}.pdf`;
    }
  },
  // http://ssr.vuejs.org/en/caching.html#component-level-caching
  methods: {
    showIframe() {
      console.log('object');
    },
    resizeIframe($event) {
      console.log($event);
      // const iframe = $event.path[0];
      // iframe.style.height = 0;
      // iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    },
    openUrl() {

      window.open(this.item.url);
    }
  },
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
      width 80px
      position absolute
      right 10px
      top -20px
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      &:hover
        color #ff6600
</style>
