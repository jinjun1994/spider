<template>
  <div class="account-list">
    <div class="news-view">
      <div class="news-list-nav">
        <div class="block">
          <el-input
            v-model="input"
            size="small"
            clearable
            :debounce="300"
            style="max-width:500px"
            placeholder="请输入昵称搜索"
            @input="inputChange"
          >
          </el-input>
          <el-pagination
            small
            layout="prev, sizes,pager, next,jumper"
            :total="total"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            :current-page.sync="currentPage"
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
            <item
              v-for="item in displayedItems"
              :key="item.id"
              :item="item"
            >
            </item>
          </transition-group>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { fetchAccount } from '../api';
import Item from '../components/AccountItem.vue';
const debounce = require('debounce');
export default {
  name: 'ItemList',

  components: {
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
      peoples: [],
      total: 0,
      tableData: [],
      input: '',
      currentPage: 1
    };
  },

  computed: {
    page() {
      return Number(this.$route.query.page) || 1;
    },
    size() {
      return Number(this.$route.query.size) || 10;
    },
    sort() {
      console.log(this.$route.query.sort);
      return this.$route.query.sort;
    },
    order() {
      return this.$route.query.order;
    },
    nickname() {
      return this.$route.query.nickname;
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
    page(to, from) {
      this.fetchPeople();
    },
    async sort(to, from) {
      console.log(to);
      await this.fetchPeople();
    },
    async order(to, from) {
      await this.fetchPeople();
    },
    async input(to, from) {
    //
    },
  },

  async beforeMount() {
    this.currentPage = this.page;
    await this.fetchPeople();


  },

  beforeDestroy() {
  },

  methods: {
    async fetchPeople() {
      console.log(this.page);

      const { sort, order } = this.$route.query;
      const { rows, count } = (await fetchAccount(
        {
          total: true,
          page: this.page,
          size: this.size,
          ...(this.nickname ? { account: this.nickname } : {}),
          ...(sort ? { sort } : {}),
          ...(order ? { order } : {})
        }
      )).data;
      this.peoples = rows;
      this.total = count;
      this.displayedItems = rows;
      console.log(rows, count);
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
    inputChange: debounce(async function(nickname) {
      console.log(nickname);
      this.$router.push({
        query: this.merge(this.$route.query, { nickname })
      }).catch(err => {});
      await this.fetchPeople();
    }, 300),
    sortChange(v) {
      console.log(v);
      let { prop: sort, order } = v;
      if (order === 'descending') order = '-1';
      if (order === 'ascending') order = '1';
      if (order === null) {
        sort = '';
        order = '';
      }
      this.$router.push({
        query: {
          page: this.page,
          size: this.size,
          ...(sort ? { sort } : {}),
          ...(order ? { order } : {})
        }
      }).catch(err => {});


    }
  }
};
</script>

<style lang="stylus" >
.account-list
  .news-view
    padding-top 80px

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
  .user
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
  .item-leave-active
    position absolute
    opacity 0
    transform translate(30px, 0)
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
