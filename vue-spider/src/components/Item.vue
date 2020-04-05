<template>
  <div
    class="news-item"
  >
    <el-card
      class="box-card"
    >
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

        <section
          v-if="!user_id"
          class="hand"
        >
          <i
            class="fa fa-hand-o-left"
          ></i>
          <span>点击查看微博</span>
        </section>

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
        @click.stop="1"
      >
        微博词云：
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
        <el-row>
          <template
            v-for="type in types"
          >
            <el-col
              :key="type.type"
              :span="24"
              class="chart"
              :style="{width:type.type==='monthly'?'100%':'50%'}"
            >
              <div
                :id="type.type"
              >
              </div>
              <span
                :key="type.type"
                style="text-align:center;width:100%;display: block;"
              >{{ `${item.nickname}微博数量${type.title}统计` }}</span>
            </el-col>
          </template>
        </el-row>
      </div>
      <div class="host">
        上次抓取 {{ new Date(item.time).toLocaleString() }}
      </div>
      <div class="host">
        微博合集下载：
        <a
          style="margin: 0 0.5em"
          target="_blank"
          :href="`${ossurl}/weibos/${item.nickname}/${item.id}.csv`"
          :download="`${item.nickname}.csv`"
        >  excel格式</a>
        <a
          style="margin: 0 0.5em"
          target="_blank"
          :href="`${ossurl}/weibos/${item.nickname}/${item.id}.txt`"
          :download="`${item.nickname}.txt`"
        >  text格式</a>
        <a
          style="margin: 0 0.5em"
          target="_blank"
          :href="`${ossurl}/weibos/${item.nickname}/${item.id}.json`"
          :download="`${item.nickname}.json`"
        >  json格式</a>
        <a
          style="margin: 0 0.5em"
          target="_blank"
          :href="`${ossurl}/weibos/pdfs/${item.nickname}微博合集time.pdf`"
          :download="`${item.nickname}time.pdf`"
        >  pdf格式(时间排序)</a>
        <a
          style="margin: 0 0.5em"
          target="_blank"
          :href="`${ossurl}/weibos/pdfs/${item.nickname}微博合集number.pdf`"
          :download="`${item.nickname}number.pdf`"
        >  pdf格式(热度排序)</a>
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
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      &:hover
        color #ff6600
</style>
