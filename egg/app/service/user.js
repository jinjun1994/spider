'use strict';

const Service = require('egg').Service;
const superagent = require('superagent');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

class UserService extends Service {

  // ////////////////////////数据库或其他外部环境相关调用的封装///////////////////////////

  // 1. mongoose

  /**
   * 查询符合条件的用户
   * @param {Object} options 条件
   * @param {Object} query 参数
   * @return {Array} 用户
   */
  async list(options, query) {
    const { skip, limit, sort } = query;
    const params = { sort: sort ? sort : { publish_time: -1 } };

    if (skip !== undefined && limit !== undefined) {
      params.skip = skip;
      params.limit = limit;
    }
    return await this.app.model.User.find(options, null, params);
  }

  async listWithCooperations(options, query) {
    const { skip, limit } = query;
    const params = { sort: { username: 1 }, collation: { locale: 'zh' } };
    if (skip !== undefined && limit !== undefined) {
      params.skip = skip;
      params.limit = limit;
    }
    const aggregateOptions =
      [{ $match: options },
        {
          $lookup: {
            from: 'cooperation',
            localField: '_id',
            foreignField: 'collaborator',
            as: 'projects',
          },
        },
      ];

    if (skip !== undefined && limit !== undefined) {
      aggregateOptions.push({ $skip: skip });
      aggregateOptions.push({ $limit: limit });
    }
    return await this.app.model.User.aggregate(aggregateOptions).collation({ locale: 'zh' });

  }

  /**
   * 查询符合条件的用户总数
   * @param {Object} options 条件
   * @return {Number} 总数
   */
  async count(options) {
    return await this.app.model.User.countDocuments(options);
  }

  async findByUsername(username) {
    return await this.app.model.User.findOne({ username });
  }

  async findById(id) {
    return await this.app.model.User.findOne({ id });
  }
  async findUserByName(url) {
    // const res = await axios.get('https://weibo.com/u/6485156633?is_all=1');
    // https://juejin.im/post/5b4f007fe51d4519277b9707#heading-7
    const res = await superagent.get('https://weibo.com/u/6485156633?is_all=1');
    const $ = cheerio.load(res.text);


    const browser = await puppeteer.launch({
      // C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
      headless: true,
      // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
    });
    const page = await browser.newPage();
    await page.goto('https://weibo.com/u/6485156633?is_all=1',
      // { waitUntil: 'networkidle0' }
    );

    // 等待，直到“title”元素呈现
    // await page.waitForSelector('title');
    // await page.waitFor(30000);
    // https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v2.1.1&show=api-pagewaitforresponseurlorpredicate-options

    // await page.waitForFunction('document.title.includes("微博")');
    await page.waitForFunction('window.$CONFIG&&window.$CONFIG.oid');
    const use_id = await page.evaluate('window.$CONFIG.oid'); // 输出 "3"

    const title = await page.title();

    console.info(`标题是: ${title}`);
    console.info(`use_id: ${use_id}`);
    browser.close();
    // const html = await page.content();

    // console.log(html);
    // 将html保存到一个文件中
    // fs.writeFile('page.html', html, _ => console.log('HTML saved'));

    // ... 做一些事
    // await browser.close();
    // console.log(res.data.indexOf('oid'));
    // const res = await this.app.model.User.findOne({ nickname });
    // console.log(res);
    // if (res) {
    //   return '该用户已经存在';
    // } else {
    //   const result = axios.get()
    // }
  }
  async create(user) {
    return await this.service.crud.create(this.app.model.User, user);
  }
  async bulkWrite(arr) {
    return await this.app.model.User.bulkWrite(arr);
  }

}
module.exports = UserService;
