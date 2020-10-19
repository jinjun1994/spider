

const { Service } = require('egg');
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
    const params = { sort: sort || { publish_time: -1 } };

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

  async findUserIdByUrl(url) {
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
        // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
      });
      const page = await browser.newPage();
      await page.goto(url,
        // { waitUntil: 'networkidle0' }
      );
      await page.waitForNavigation();
      // await page.waitFor(2000);
      await page.goto(url,

        // { waitUntil: 'networkidle0' }
      );

      await page.waitForFunction('window.$CONFIG&&window.$CONFIG.oid');
      const user_id = await page.evaluate('window.$CONFIG.oid'); // 输出 "3"
      const title = await page.title();
      const nickname = title.substring(0, title.length - 6);

      console.info(`标题是: ${title}`);
      console.info(`use_id: ${user_id}`);
      browser.close();
      return { user_id, nickname };
    } catch (error) {
      console.log(error);
    }
  }

  async create(user) {
    return await this.service.crud.create(this.app.model.User, user);
  }

  async bulkWrite(arr) {
    return await this.app.model.User.bulkWrite(arr);
  }
}
module.exports = UserService;
