<template>
  <div class="user-page">
    <div class="news-view">
      <div class="news-list-nav">
        <div class="block">
          <el-input
            v-model="input"
            clearable
            :debounce="300"
            style="max-width:500px"
            placeholder="请输内容搜索"
            @input="inputChange"
          >
          </el-input>
          <div class="search">
            <el-table
              class="user"
              style="max-width:500px"
              :fit="false"
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
            <el-checkbox
              v-model="original"
              @change="originalChange"
            >
              原创
            </el-checkbox>
          </div>
          <el-pagination
            small
            layout="prev, sizes,pager, next,jumper"
            :total="total"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            :current-page.sync="currentPage"
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
const debounce = require('debounce');
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
      tableData: [],
      input: '',
      currentPage: 1,
      original: false
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
    content() {
      return this.$route.query.content;
    },
    isOriginal() {
      // console.log(this.$route.query.original === true, this.$route.query.original);
      return this.$route.query.original;
    },
    name() {
      return this.$route.name;
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
    },
    async content(to, from) {
      await this.fetchWeibo();
    },
    async isOriginal(to, from) {
      console.log(this.isOriginal);
      await this.fetchWeibo();
    },
    async name(to, from) {
      if (this.user_id) this.user = (await findUserById(this.user_id)).data;
      await this.fetchWeibo();
    }
  },

  async beforeMount() {
    this.currentPage = this.page;
    this.input = this.content ? this.content : '';
    const { original } = this.$route.query;
    this.original = !!original;
    console.log(this.isOriginal);
    console.log(this.size);
    console.log(this.page);
    if (this.user_id) this.user = (await findUserById(this.user_id)).data;
    console.log(this.user);
    await this.fetchWeibo();

    console.log('use', this.$route.params.user_id);
    console.log('use', this.$route);
  },

  beforeDestroy() {
  },

  methods: {
    async fetchWeibo() {
      console.log(this.page);
      console.log(this.size);
      const { sort, order, original } = this.$route.query;
      const { list, total } = (await fetchWeibo(
        {
          total: true,
          page: this.page,
          size: this.size,
          ...(this.user_id ? { user_id: this.user_id } : {}),
          ...(this.content ? { content: this.content } : {}),
          ...(sort ? { sort } : {}),
          ...(order ? { order } : {}),
          ...(original ? { original } : {})
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
    // inputChange(content) {
    //   this.$router.push({
    //     query: this.merge(this.$route.query, { content })
    //   }).catch(err => {});

    // },
    inputChange: debounce(function(content) {
      console.log(content);
      this.$router.push({
        query: this.merge(this.$route.query, { content })
      }).catch(err => {});
    }, 300),

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
      const { content, original } = this.$route.query;
      this.$router.push({
        query: { page: this.page, size: this.size,
          ...(content ? { content } : {}),
          ...(original ? { original: true } : {}),
          sort, order }
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

    },
    originalChange(original) {
      const { sort, order } = this.$route.query;
      this.$router.push({
        query: {
          page: this.page,
          size: this.size,
          ...(sort ? { sort } : {}),
          ...(order ? { order } : {}),
          ...(this.content ? { content: this.content } : {}),
          ...(original ? { original } : {}),
        }
      }).catch(err => {});

    },
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
    .block
      display flex
      flex-direction column
      justify-content center
      align-items center
      .search
        display flex
        align-items center
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
