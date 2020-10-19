<template>
  <div
    class="account-item"
  >
    <el-card
      class="box-card"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <router-link
          :to="'/account/'+item.account"
        >
          <section class="head-url">
            <img
              :src="item.head_url"
            />
            <span> {{ item.account }}</span>
            <section
              v-if="!user_id"
              class="hand"
            >
              <i
                class="fa fa-hand-o-left"
              ></i>
              <span>点击查看文章</span>
            </section>
          </section>
        </router-link>
        <img
          class="qr-code"
          :src="item.qr_code"
          alt=""
        >
        <span
          class="score"
          @click="$router.push({path:`/account/${item.account}`}).catch(err=>{})"
        > {{ item.weibo_num }}</span>


        <!-- <el-button
          style="float: right; padding: 3px 0"
          type="text"
        >
          操作按钮
        </el-button> -->
      </div>
      <div class="host">
        简介： {{ item.summary }}
      </div>
      <div
        v-if="item.verify"
        class="host"
      >
        认证信息：{{ item.verify }}
      </div>

      <div class="host">
        上次抓取 {{ item && item.accountTask? new Date(item.accountTask.last_spider_time).toLocaleString():'' }}
        上次发文 {{ item && item.accountTask? new Date(item.accountTask.last_publish_time).toLocaleString():'' }}
      </div>
      <div class="host">
        微信文章合集下载：

        <a
          style="margin: 0 0.5em"
          target="_blank"
          :href="`${ossurl}/articles/${item.biz}/${item.account}_微信文章合集.pdf`"
          :download="`${item.account}_微信文章合集.pdf`"
        >  pdf格式</a>
      </div>
    </el-card>
  </div>
</template>

<script>
/* global G2 mapboxgl */
import { timeAgo } from '../util/filters';
import { analyze } from '../api';
const dayjs = require('dayjs');
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
      // analyze: null
      types: [
        { type: 'monthly', label: '月', title: '逐月' },
        { type: 'year', label: '年', title: '年' },
        { type: 'month', label: '月', title: '月' },
        { type: 'hour', label: '时', title: '小时' },
        { type: 'dayOfWeek', label: '周', title: '星期' },
        { type: 'dayOfMonth', label: '号', title: '日期' },
      ]
    };
  },
  computed: {
    page() {
      return Number(this.$route.query.page) || 1;
    },

    user_id() {
      return this.$route.params.user_id;
    },

  },
  async mounted() {
    console.log(this.user_id, 'item');
    if (this.user_id) {
      this.analyze = (await analyze(
        { user_id: this.user_id }
      )).data.analyze;
      this.analyze.monthly = this.analyze.monthly.sort(
        (a, b) => dayjs(a.monthly).valueOf() - dayjs(b.monthly).valueOf()
      );
      console.log(this.analyze);
      for (const itme of this.types) {
        this.drawChart(itme);
      }

    }
    this.$nextTick(() => {

    });
    // this.drawChart();
  },
  methods: {
    drawChart({ type, label } = {}) {

      // Step 1: 创建 Chart 对象
      const chart = new G2.Chart({
        container: type, // 指定图表容器 ID
        // width: 300, // 指定图表宽度
        height: 350, // 指定图表高度
        padding: [40, 40, 60],
        autoFit: true
      });

      // Step 2: 载入数据源
      const data = this.analyze[type];
      console.log(data);
      chart.data(data);

      // Step 3：创建图形语法，绘制柱状图
      chart.line().position(`${type}*sum`).label('sum');
      chart.axis('sum', {
        label: {
          formatter: (val) => {
            return val;
          },
        },
      });
      chart.axis(`${type}`, {
        label: {
          formatter: (val) => {
            if (type === 'dayOfWeek') {

              return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][val - 1];
            }
            return val + ` ${label}`;
          },
        },
      });

      // Step 4: 渲染图表
      chart.render();

    }

  }

};
</script>

<style lang="stylus" >
.account-item
  background-color #fff
  line-height 20px
  padding 20px 30px 20px 30px

  .box-card:hover
      .hand
        display:inline-block!important;
        margin-left 0.51em
  .box-card
      position relative
      .clearfix
        display flex
        align-items center
        .qr-code
          width 64px
          position absolute
          right 10px
          top 3px
  .head-url
      display flex
      align-items center
  .head-url img
       width 32px
       margin 0 12px 0 0
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
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      &:hover
        color #ff6600
</style>
