<template>
  <li class="news-item">
    <el-card
      class="box-card"
      @mouseenter.native="iframeVisible=true;iframeShow=true"
      @mouseleave.native="iframeShow=false"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span
          v-show="!iframeVisible||!iframeShow"
        >
          <b> {{ item.title }}</b>
        </span>
        <p
          v-show="!iframeVisible||!iframeShow"
        >
          摘要： {{ item.digest }}
        </p>
        <iframe
          v-if="iframeVisible"
          v-show="iframeShow"
          style="width:100%;height:1000px"
          :src="item.url"
          frameborder="0"
          @load="resizeIframe($event)"
        ></iframe>
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
        <a
          :href="'https://weibo.com/'+item.user_id+'/'+item.id+'?type=repost'"
          target="_blank"
          rel="noopener"
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
  data() {
    return {
      iframeVisible: false,
      iframeShow: false
    };
  },
  // http://ssr.vuejs.org/en/caching.html#component-level-caching
  methods: {
    showIframe() {
      console.log('object');
    },
    resizeIframe($event) {
      console.log($event);
      const iframe = $event.path[0];
      // iframe.style.height = 0;
      // iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    }
  },
};
</script>

<style lang="stylus" scoped >
  .image {
    display: inline-block;
    max-width:32%
  }

</style>
