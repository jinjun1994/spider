/* global location */
const configs = require('../../../config');
const puppeteer = require('puppeteer');
async function getKey(url, page, ctx) {
  const cookiesSet = await page.cookies(url);
  const key = (key) => [ ...cookiesSet ].filter(v => v.name === key)[0].value;
  const skey = key('wr_skey');
  const vid = key('wr_vid');
  await ctx.helper.asyncRedis('hmset', 'cookie', 'skey', skey, 'vid', vid);
}
module.exports = {
  schedule: {
    interval: '1200h', // 1 分钟间隔
    type: 'worker', // 指定所有的 worker 都需要执行
    immediate: true
  },
  async task(ctx) {
    // if (!process.env.NODE_ENV === 'production') {
    try {
      const browser = await puppeteer.launch({
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
        headless: false,
        userDataDir: './myUserDataDir',
        // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
      });
      const url = 'https://weread.qq.com/';
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36');

      await page.goto(url,
        // { waitUntil: 'networkidle0' }
      );
      await getKey(url, page, ctx);
      //   browser.close();

      //   setInterval(async () => {
      //     page.waitFor(10000);
      //     console.log(await ctx.helper.asyncRedis('hmget', 'cookie', 'skey', 'vid'));

      //   }, 10000);
      const go = async () => {
        await page.evaluate(() => {
          location.reload(true);
        });
        await getKey(url, page, ctx);
        console.log(await ctx.helper.asyncRedis('hmget', 'cookie', 'skey', 'vid'));
        setTimeout(go, ctx.helper.random(1000 * 60 * 20, 1000 * 60 * 30));
        // setTimeout(go, ctx.helper.random(1000 * 10, 1000 * 15));
      };
      await go();

    } catch (error) {
      console.log(error);
    }

  },
  //   }

};