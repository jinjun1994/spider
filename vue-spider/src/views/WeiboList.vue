<template>
  <div class="news-view">
    <div class="news-list-nav">
      <div class="block">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
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
</template>

<script>
import { fetchWeibo } from '../api';
import WeiboItem from '../components/WeiboItem';

export default {
  name: 'ItemList',

  components: {
    WeiboItem
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
      size: 10,
      total: 0
    };
  },

  computed: {
    page() {
      return Number(this.$route.query.page) || 1;
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
    }
  },

  async beforeMount() {
    await this.fetchWeibo();


  },

  beforeDestroy() {
  },

  methods: {
    async fetchWeibo() {
      console.log(this.page);

      const { list, total } = (await fetchWeibo(
        {
          total: true,
          page: this.page,
          size: this.size
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

    }
  }
};
</script>

<style lang="stylus">
.news-view
  padding-top 45px

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

@media (max-width 600px)
  .news-list
    margin 10px 0
</style>
