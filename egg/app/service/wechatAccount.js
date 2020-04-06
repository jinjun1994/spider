'use strict';

const Service = require('egg').Service;
const allSettled = require('promise.allsettled');
const axios = require('axios');
const puppeteer = require('puppeteer');
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
  async getKeys() {

    try {
      const browser = await puppeteer.launch({
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
        headless: false,
        userDataDir: 'D:/html/puppeteer',
        // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
      });
      const url = 'https://weread.qq.com/';
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36');

      // const cookie = ' pgv_pvid=6082038910; pgv_pvi=9851128832; eas_sid=61o5s8v5P2v231O2x1k6G2t7t5; ptui_loginuin=397043849; RK=UJLVDxLmVG; ptcz=e04d00898ef664d0835588ee49a041b78eab9e15bcb00a33de956f66be9d47ea; o_cookie=397043849; pac_uid=1_397043849; wr_logined=1; wr_avatar=http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FQ0j4TwGTfTIL34rMu8CX0rCazKMv2dWoxpib2IibLerNnnzfia0sdxeXfjEgicibKgm6qTzIicMsHyoJIT7BCicPAXzQA%2F132; wr_name=%E9%87%91%E4%BF%8A; wr_gid=234783631; wr_vid=32707621; wr_pf=1; wr_rt=web%40Gz71bHi79QaOi4rUDbo_WL; wr_localvid=7cc325d071f314257cc2a9c; wr_gender=1; wr_skey=XYd01GoA';
      // const cookieArr = Array.from(cookie.split(';'), (v) => ({
      //   domain: 'https://weread.qq.com',
      //   // hostOnly: false,
      //   // httpOnly: false,
      //   // secure: false,
      //   // session: false,
      //   // path: '/',
      //   name: v.split('=')[0].trim(),
      //   value: v.split('=')[1]
      // }));
      // console.log(cookieArr);
      // const client = await page.target().createCDPSession();
      // await client.send('Network.enable');
      // // const setCookie = await client.send('Network.setCookie', {
      // //   name: 'mycookie', value: 'Hello', domain: 'https://example.com'
      // // });
      // const setCookie = await client.send('Network.setCookie', ...cookieArr);
      // console.log('Set Cookie: ' + setCookie.success);

      // await page.setCookie(...cookieArr);
      await page.goto(url,
        // { waitUntil: 'networkidle0' }
      );
      const cookiesSet = await page.cookies(url);

      // console.log([ ...cookiesSet ]);
      const key = (key) => [ ...cookiesSet ].filter(v => v.name === key)[0].value;
      const skey = key('wr_skey');
      const vid = key('wr_vid');

      // console.log(skey, vid);
      browser.close();
      return {
        skey, vid
      };


    } catch (error) {
      console.log(error);
    }

  }
  /**
   * 通过微信读书接口查询公众号信息
   * @param {String} title 公众号名称
   * @param {String} count 搜索结果条数
   * @return {Object} 总数
   */
  async findBookByTitle(title, count = 100) {
    const result = await axios.get(`https://i.weread.qq.com/store/search?author=&authorVids=&count=${count}&fromBookId=&keyword=${encodeURI(title)}&maxIdx=0&outer=1&scene=0&type=0&v=2`,
      { headers: await this.getHeaders() }
    );
    return result.data;
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
