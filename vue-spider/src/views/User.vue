<template>
  <div class="user-page">
    <div class="news-view">
      <div class="news-list-nav">
        <el-table
          class="user"
          :fit="true"
          :data="tableData"
          :default-sort="{prop: 'publish_time', order: 'descending'}"
          @sort-change="sortChange"
        >
          <!-- <template slot="empty">
          ss
        </template> -->
          <el-table-column
            prop="publish_time"
            label="时间"
            sortable="custom"
            :sort-orders="['descending','ascending', null]"
          >
          </el-table-column>
          <el-table-column
            prop="retweet_num"
            label="转发"
            sortable="custom"
            :sort-orders="['descending','ascending', null]"
          >
          </el-table-column>
          <el-table-column
            prop="up_num"
            label="点赞"
            sortable="custom"
            :sort-orders="['descending','ascending', null]"
          >
          </el-table-column>
          <el-table-column
            prop="comment_num"
            label="评论"
            sortable="custom"
            :sort-orders="['descending','ascending', null]"
          >
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            layout="prev, sizes,pager, next,jumper"
            :total="total"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            @size-change="handleSizeChange"
            @current-change="currentChange"
          >
          </el-pagination>
        </div>
      </div>

      <transition :name="transition">
        <div
          v-if="displayedPage > 0"
          :key="displayedPage"
          class="news-list"
        >
          <Item
            v-if="page===1&&user_id"
            :item="user"
          >
          </Item>
          <transition-group
            tag="ul"
            name="item"
          >
            <!-- <div
            v-for="item in peoples"
            :key="item.id"
          >
            {{ item.nickname }}
            {{ item.weibo_num }}
            {{ item.following }}
            {{ item.followers }}
          </div> -->

            <WeiboItem
              v-for="item in displayedItems"
              :key="item._id"
              :item="item"
            >
            </WeiboItem>
          </transition-group>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { fetchWeibo, findUserById } from '../api';
import WeiboItem from '../components/WeiboItem';
import Item from '../components/Item';

export default {
  name: 'ItemList',

  components: {
    WeiboItem,
    Item
  },

  // props: {
  //   type: String
  // },

  data() {
    return {
      transition: 'slide-right',
      displayedPage: Number(this.$route.params.page) || 1,
      displayedItems: [],
      weibos: [],
      total: 0,
      user: {},
      tableData: []
    };
  },

  computed: {
    page() {
      return Number(this.$route.query.page) || 1;
    },
    size() {
      return Number(this.$route.query.size) || 10;
    },
    user_id() {
      return this.$route.params.user_id;
    },
    sort() {
      console.log(this.$route.query.sort);
      return this.$route.query.sort;
    },
    order() {
      return this.$route.query.order;
    },

    maxPage() {
      return 12;
      // return Math.ceil(lists[this.type].length / itemsPerPage);
    },
    hasMore() {
      return this.page < this.maxPage;
    }
  },

  watch: {
    async page(to, from) {
      await this.fetchWeibo();
    },
    async sort(to, from) {
      console.log(to);
      await this.fetchWeibo();
    },
    async order(to, from) {
      await this.fetchWeibo();
    }
  },

  async beforeMount() {
    if (this.user_id) this.user = (await findUserById(this.user_id)).data;
    console.log(this.user);
    await this.fetchWeibo();

    console.log('use', this.$route.params.user_id);
  },

  beforeDestroy() {
  },

  methods: {
    async fetchWeibo() {
      console.log(this.page);
      const { sort, order } = this.$route.query;
      const { list, total } = (await fetchWeibo(
        {
          total: true,
          page: this.page,
          size: this.size,
          ...(this.user_id ? { user_id: this.user_id } : {}),
          ...(sort ? { sort } : {}),
          ...(order ? { order } : {})
        }
      )).data;
      this.weibos = list;
      this.total = total;
      this.displayedItems = list;
      console.log(list, total);
      console.log(this.displayedPage);
    },
    currentChange(page) {
      this.$router.push({
        query: this.merge(this.$route.query, { page })
      }).catch(err => {});

    },
    handleSizeChange(size) {
      this.$router.push({
        query: this.merge(this.$route.query, { size })
      }).catch(err => {});

    },
    sortChange(v) {
      console.log(v);
      let { prop: sort, order } = v;
      if (order === 'descending') order = '-1';
      if (order === 'ascending') order = '1';
      if (order === null) {
        sort = 'publish_time';
        order = '-1';
      }
      this.$router.push({
        query: { page: this.page, size: this.size, sort, order }
      }).catch(err => {});
      // if (prop === 'publish_time') {
      //   this.$router.push({
      //     query: { page: this.page, sort, order }
      //   }).catch(err => {});
      // }
      // if (prop === 'retweet_num') {
      //   this.$router.push({
      //     query: this.merge(this.$route.query, { page: this.page })
      //   }).catch(err => {});
      // }

    }
  }
};
</script>

<style lang="stylus">
.user-page
  .news-view
    padding-top 160px

  .news-list-nav, .news-list
    background-color #fff
    border-radius 2px

  .news-list-nav
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
  .user
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
  .el-table__body-wrapper .is-scrolling-none
    display none !important
  .el-table::before
    width: 0 !important
  .el-table__empty-block
    display: none !important
  // el-table__body-wrapper is-scrolling-none
  .el-table th.is-leaf
      border-bottom: none;

@media (max-width 600px)
  .news-list
    margin 10px 0
</style>
