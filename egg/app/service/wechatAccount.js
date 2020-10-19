
/* global location */
const { Service } = require('egg');
const allSettled = require('promise.allsettled');
const axios = require('axios');
const puppeteer = require('puppeteer');
const url = require('url');

let page;
let pageUrl;
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
      const params = { sort: sort || { publish_time: -1 } };

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
    const types = ['year', 'month', 'hour', 'dayOfWeek', 'dayOfMonth'];
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
      },
      },
      { $sort: { _id: 1 } }];
    }
    $facet.monthly = [{ $group: {
      _id: {
        // $substr: [{ $add: [ '$created_at', 28800000 ] }, 0, 10 ]
        $substr: ['$publish_time', 0, 7],
      },
      sum: { $sum: 1 },
    },
    },
    { $project: {
      _id: 0,
      monthly: '$_id',
      sum: '$sum',
    },
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
      { $facet },
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

  async getKeysFromCookie(pageUrl, page, ctx) {
    const cookiesSet = await page.cookies(pageUrl);
    const key = (key) => [...cookiesSet].filter(v => v.name === key)[0].value;
    const skey = key('wr_skey');
    const vid = key('wr_vid');
    await ctx.helper.asyncRedis('hmset', 'cookie', 'skey', skey, 'vid', vid);
  }

  async refreshCookie(ctx) {
    if (process.env.NODE_ENV === 'production') {
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          headless: false,
          userDataDir: './myUserDataDir',
        // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
        });
        pageUrl = 'https://weread.qq.com/';
        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36');

        await page.goto(pageUrl,
        // { waitUntil: 'networkidle0' }
        );
        await this.getKeysFromCookie(pageUrl, page, this.ctx);
        //   browser.close();

        //   setInterval(async () => {
        //     page.waitFor(10000);
        //     console.log(await ctx.helper.asyncRedis('hmget', 'cookie', 'skey', 'vid'));

        //   }, 10000);
        const go = async () => {
          await page.evaluate(() => {
            location.reload(true);
          });
          await this.getKeysFromCookie(pageUrl, page, this.ctx);
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
    await this.getKeysFromCookie(pageUrl, page, this.ctx);
  }

  async getKeys() {
    try {
      const { 0: skey, 1: vid } = await this.ctx.helper.asyncRedis('hmget', 'cookie', 'skey', 'vid');
      console.log(skey, vid);
      return {
        skey, vid,
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
        { headers: await this.getHeaders() });
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
   * @param {String} bookId 公众号bookid
   * @return {Array}  [{
            "reviewId": "MP_WXS_3242052866_dymTNtk3wAg0ONDICDciNA",
            "review": {
                "reviewId": "MP_WXS_3242052866_dymTNtk3wAg0ONDICDciNA",
                "userVid": 10003,
                "type": 16,
                "content": "",
                "createTime": 1478334327,
                "bookId": "",
                "belongBookId": "MP_WXS_3242052866",
                "mpInfo": {
                    "originalId": "dymTNtk3wAg0ONDICDciNA",
                    "doc_url": "https://mp.weixin.qq.com/s?__biz=MzI0MjA1Mjg2Ng==&mid=2649867007&idx=1&sn=3d55b33cc7833fdc18c091759f79c016&chksm=f1075892c670d184322b38031609a201754080f96ccd36ab6db620e4f0e6ac4a46aca0ca2fc2#rd",
                    "pic_url": "http://mmbiz.qpic.cn/mmbiz_jpg/nBKX0s8fer23boDood8zZSbR0rAB2G8Y3lGPju5LWk9uFA4owk1swiazicN5zPiclDHOLRA5oJUf3MPU0GdLGJibPg/0?wx_fmt=jpeg",
                    "title": "东南亚电商创业环境",
                    "content": "东南亚电商的格局一个字，乱，两个字，烧钱。",
                    "mp_name": "caoz的梦呓",
                    "avatar": "http://wx.qlogo.cn/mmhead/Q3auHgzwzM6KKoAryS1XgNSrsD8icEEgrk6XQWA4syu6T2ia6xR4kVAw/0",
                    "time": 1478334327,
                    "payType": 0,
                    "inner": 0
                },
                "score": 1478334327,
                "mpRank": 1,
                "isLike": 0,
                "isReposted": 0,
                "book": {
                    "bookId": "",
                    "format": "",
                    "version": 0,
                    "soldout": 0,
                    "type": 0,
                    "paytype": 0,
                    "cover": "",
                    "title": "",
                    "author": ""
                },
                "author": {
                    "userVid": 10003,
                    "name": "MP",
                    "avatar": "",
                    "isFollowing": 0,
                    "isFollower": 0
                }
            },
            "likesCount": 1
        }]
   */
  async getArticleList({ bookId } = {}) {
    const list = [];
    // 20 0 / 20 20
    const dealList = () => Array.from(list, ({ review:
      { belongBookId: bookId,
        mpInfo: {
          doc_url, // 文章地址
          pic_url, // 封面图片地址
          title, // 文章标题
          time, // 文章发布时间
          content, // 文章简介
          mp_name, // 公众号名称
          avatar, // 公众号头像
        },
      } }, i) => ({
      bookId, doc_url, pic_url, title, time, content, mp_name, avatar,
    }));
    try {
      const getBooks = async (offset, count = 20) => (await axios.get(`https://i.weread.qq.com/book/articles?bookId=${bookId}&count=${count}&offset=${offset}`,
        { headers: await this.getHeaders() })).data;
      let offset = 0;
      let { reviews } = await getBooks(offset);
      list.push(...reviews);
      while (reviews && reviews.length) {
        offset += 20;
        await this.ctx.helper.sleep(3000, 4000);
        reviews = (await getBooks(offset)).reviews;
        if (reviews && reviews.length) list.push(...reviews);
      }
      return dealList();
    } catch (error) {
      console.log(error);
      if (error.message.includes('401')) {
        await this.refreshPage();
        await this.getArticleList({ bookId });
      } else if (error.message.includes('499')) {
        // { errcode: -2003, errmsg: '参数格式错误' } 说明已经抓取完毕了
        return dealList();
      } else throw error;
    }
  }

  async getHeaders() {
    return {
      'User-Agent': 'WeRead/4.5.5 (iPhone; iOS 13.3.1; Scale/3.00)',
      channelid: 'AppStore',
      v: '4.5.5.2',
      'Accept-Encoding': 'gzip,deflate,br',
      ...(await this.getKeys()),
    };
  }

  /**
   * 创建 mysql数据库中 account_task 和article_task
   * 绕过关注公众号抓取，原理:一次性拿到所有已经存在的文章，后续抓取更新的文章因为不超过15篇，不用关注即可抓取
   * @param {String} bookId 公众号名称
   */
  async makeTask({ bookId } = {}) {
    const articles = await this.getArticleList({ bookId });
    const articleTask = Array.from(articles, ({ doc_url }) => {
      const { query: { __biz, sn } } = url.parse(doc_url, true);

      return {
        biz: __biz,
        sn,
        article_url: doc_url.replace('#rd', '&scene=27#wechat_redirect'),
        state: 0,
      };
    });
    const { biz } = articleTask[0];
    await this.ctx.service.mysql.wechatAccountTask.create({ biz });
    await this.ctx.service.mysql.wechatArticleTask.creates(articleTask);
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
