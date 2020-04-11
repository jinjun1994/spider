'use strict';
/* global location */
const Service = require('egg').Service;
const allSettled = require('promise.allsettled');
const axios = require('axios');
const puppeteer = require('puppeteer');
let page;
let url;
class WechatAccountService extends Service {

  // ////////////////////////数据库或其他外部环境相关调用的封装///////////////////////////

  // 1. mongoose

  /**
   * 查询符合条件的微博
   * @param {Object} options 条件
   * @param {Object} query 参数
   * @return {Array} 微博
   */
  async list(options, query) {
    try {
      const { skip, limit, sort } = query;
      const params = { sort: sort ? sort : { publish_time: -1 } };

      if (skip !== undefined && limit !== undefined) {
        params.skip = skip;
        params.limit = limit;
      }
      // https://cn.mongoosedoc.top/docs/populate.html#populate-virtuals
      return await this.app.model.WechatAccount.find(options, null, params)
        .populate({ path: 'author', select: 'nickname -_id -id weibo' });


    } catch (error) {
      throw error;
    }

  }
  /**
   * 微博分析
   * @param {Object} options 条件
   * @return {Object} 分析结果
   */
  async analyze({ user_id } = {}) {
    // user_id = this.service.crud.objectId(user_id);
    const types = [ 'year', 'month', 'hour', 'dayOfWeek', 'dayOfMonth' ];
    return (await this.analyzeByTime({ user_id, types }))[0];
  }
  async analyzeByTime({ user_id, types } = {}) {

    const $facet = {

    };

    for (const type of types) {
      $facet[type] = [{ $group: {
        _id: {
          [`$${type}`]: { $toDate: '$publish_time' },
        },
        sum: { $sum: 1 },
      },
      },
      { $project: {
        _id: 0,
        [type]: '$_id',
        sum: '$sum',
      }
      },
      { $sort: { _id: 1 } }];
    }
    $facet.monthly = [{ $group: {
      _id: {
        // $substr: [{ $add: [ '$created_at', 28800000 ] }, 0, 10 ]
        $substr: [ '$publish_time', 0, 7 ]
      },
      sum: { $sum: 1 },
    },
    },
    { $project: {
      _id: 0,
      monthly: '$_id',
      sum: '$sum',
    }
    },
    { $sort: { _id: 1 } }];
    console.log($facet);
    return await this.app.model.Weibo.aggregate([
      {
        $match: {
          user_id,
          publish_time: {
            $ne: null,
          },
        },

      },
      { $facet }
      // { $project: {
      //   _id: 0,
      //   publish_time: IOSDate('$publish_time'),
      //   gender: '$gender',
      // }
      // },

    ]);
  }

  /**
   * 查询符合条件的用户总数
   * @param {Object} options 条件
   * @return {Number} 总数
   */
  async count(options) {
    return await this.app.model.WechatAccount.countDocuments(options);
  }

  async findByUsername(username) {
    return await this.app.model.WechatAccount.findOne({ username });
  }
  async getKeysFromCookie(url, page, ctx) {
    const cookiesSet = await page.cookies(url);
    const key = (key) => [ ...cookiesSet ].filter(v => v.name === key)[0].value;
    const skey = key('wr_skey');
    const vid = key('wr_vid');
    await ctx.helper.asyncRedis('hmset', 'cookie', 'skey', skey, 'vid', vid);
  }
  async refreshCookie(ctx) {
    if (process.env.NODE_ENV === 'production') {
      try {
        const browser = await puppeteer.launch({
          args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
          headless: false,
          userDataDir: './myUserDataDir',
        // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
        });
        url = 'https://weread.qq.com/';
        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36');

        await page.goto(url,
        // { waitUntil: 'networkidle0' }
        );
        await this.getKeysFromCookie(url, page, this.ctx);
        //   browser.close();

        //   setInterval(async () => {
        //     page.waitFor(10000);
        //     console.log(await ctx.helper.asyncRedis('hmget', 'cookie', 'skey', 'vid'));

        //   }, 10000);
        const go = async () => {
          await page.evaluate(() => {
            location.reload(true);
          });
          await this.getKeysFromCookie(url, page, this.ctx);
          console.log(await this.ctx.helper.asyncRedis('hmget', 'cookie', 'skey', 'vid'));
          setTimeout(go, this.ctx.helper.random(1000 * 60 * 20, 1000 * 60 * 30));
        // setTimeout(go, ctx.helper.random(1000 * 10, 1000 * 15));
        };
        await go();

      } catch (error) {
        console.log(error);
      }

    }
  }
  async refreshPage() {
    await page.evaluate(() => {
      location.reload(true);
    });
    await this.getKeysFromCookie(url, page, this.ctx);
  }
  async getKeys() {
    try {
      const { 0: skey, 1: vid } = await this.ctx.helper.asyncRedis('hmget', 'cookie', 'skey', 'vid');
      console.log(skey, vid);
      return {
        skey, vid
      };
    } catch (error) {
      throw error;
    }

  }
  /**
   * 通过微信读书接口查询公众号信息
   * @param {String} title 公众号名称
   * @param {String} count 搜索结果条数
   * @return {Object} 总数
   */
  async findBookByTitle(title, count = 100) {
    try {
      const result = await axios.get(`https://i.weread.qq.com/store/search?author=&authorVids=&count=${count}&fromBookId=&keyword=${encodeURI(title)}&maxIdx=0&outer=1&scene=0&type=0&v=2`,
        { headers: await this.getHeaders() }
      );
      return result.data;
    } catch (error) {
      console.log(error);
      if (error.message.includes('401')) {
        await this.refreshPage();
        await this.findBookByTitle(title, count);
      } else throw error;
    }

    // result格式如下
  //   {
  //     "records": [],
  //     "parts": [
  //         "者",
  //         "剪",
  //         "枝"
  //     ],
  //     "books": [
  //         {
  //             "bookInfo": {
  //                 "bookId": "MP_WXS_3576045465",
  //                 "title": "剪枝者",
  //                 "author": "公众号",
  //                 "cover": "http://wx.qlogo.cn/mmhead/Q3auHgzwzM6W4djkZaUHbHSKWF16fiazL8VyMrk93GPxHgUKNw72C8w/0",
  //                 "intro": "探索工业化信息化城市化时代的选择问题，力图将8-9条分枝路径修剪为可操作的2-3条。搜索不是智能的一部，搜索是智能的全部。",
  //                 "price": 0,
  //                 "type": 3,
  //                 "payType": 32,
  //                 "bookStatus": 2,
  //                 "ispub": 0,
  //                 "cpid": 0,
  //                 "format": "epub"
  //             },
  //             "searchIdx": 1,
  //             "scope": 0,
  //             "type": 4,
  //             "readingCount": 0,
  //             "reading": 0
  //         }
  //     ],
  //     "totalCount": 1,
  //     "hasMore": 0
  // }
  }
  /**
   * 通过微信读书接口查询公众号文章列表
   * @param {String} bookId 公众号名称
   * @return {Object} article
   */
  async getArticleList({ bookId } = {}) {
    const list = [];
    // 20 0 / 20 20
    try {
      const getBooks = async (offset, count = 20) => (await axios.get(`https://i.weread.qq.com/book/articles?bookId=MP_WXS_3242052866&count=${count}&offset=${offset}`,
        { headers: await this.getHeaders() }
      )).data;
      let offset = 0;
      let { reviews } = await getBooks(offset);
      list.push(...reviews);
      console.log(reviews);
      while (reviews) {
        offset += 20;
        await this.ctx.helper.sleep(3000, 4000);
        reviews = (await getBooks(offset)).reviews;
        console.log(reviews);
        if (reviews) list.push(...reviews);
      }
      return list;
    } catch (error) {
      console.log(error);
      if (error.message.includes('401')) {
        await this.refreshPage();
        await this.getArticleList({ bookId });
      } else if (error.message.includes('499')) {
        // { errcode: -2003, errmsg: '参数格式错误' } 说明已经抓取完毕了
        return list;
      } else throw error;
    }
  }
  async getHeaders() {
    return {
      'User-Agent': 'WeRead/4.5.5 (iPhone; iOS 13.3.1; Scale/3.00)',
      channelid: 'AppStore',
      v: '4.5.5.2',
      'Accept-Encoding': 'gzip,deflate,br',
      ...(await this.getKeys())
    };
  }

  async findByTitle(title) {
    return await this.app.model.WechatAccount.findOne({ title });
  }
  async findById(id) {
    return await this.app.model.WechatAccount.findById(id);
  }
  async create(account) {
    return await this.service.crud.create(this.app.model.WechatAccount, account);
  }

}
module.exports = WechatAccountService;
