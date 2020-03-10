
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
    headless: true,
  // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
  });
  const page = await browser.newPage();
  await page.goto('https://weibo.com/healthcare120?refer_flag=0000015010_&from=feed&loc=nickname&is_all=1',
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
})();
