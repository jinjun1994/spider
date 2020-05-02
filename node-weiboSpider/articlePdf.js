const PDFDocument = require("pdfkit");
const fs = require("fs");
const puppeteer = require("puppeteer");
const filenamify = require('filenamify');
const api = require("./src/file.js");
const PDFMerge = require('pdf-merge');

let browser;

(async function mkdir() {
  const { data: accounts } = await api.fetchAccount({
    total: true,
    full: true,
  });
  console.log(accounts);
  browser = await puppeteer.launch({ headless: true });
  for (const account of accounts.rows) {
    const baseUrl = "./articles/" + account.biz;
    if (!fs.existsSync(baseUrl)) {
      fs.mkdirSync(baseUrl);
    }
    const { data: articles } = await api.fetchArticle({
      total: true,
      full: true,
      biz: account.biz,
    });
    const articleFiles=[]
    for (const article of articles.rows) {
        console.log(article.title);
        articleFiles.push(baseUrl + `/${filenamify(article.title)}.pdf`)
        console.log(filenamify(article.title));
      console.log(account.biz);
      try {
        if (!fs.existsSync(baseUrl + `/${filenamify(article.title)}.pdf`)) {
          await printPDF(article);
        }
      } catch (error) {
        console.log(error);
      }
    }
    PDFMerge(articleFiles, {output: `${baseUrl}/${account.account?account.account:account.biz}.pdf`})
.then((buffer) => {
  console.log('done');
});


  
   
  }
  await browser.close();
})();

async function printPDF({ url, biz, title } = {}) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  await autoScroll(page);
  const pdf = await page.pdf({
    path: `./articles/${biz}/${filenamify(title)}.pdf`,
    format: "A4",
    preferCSSPageSize: true,
    // printBackground: true,
    margin: {
      top: 10,
      right: 60,
      bottom: 10,
      left: 60,
    },
  });

  await page.close();
    return pdf
}

// 滚动到底部懒加载图片
async function autoScroll(page) {
  return page.evaluate(() => {
    return new Promise((resolve, reject) => {
      //滚动的总高度
      var totalHeight = 0;
      //每次向下滚动的高度 100 px
      var distance = 200;
      var timer = setInterval(() => {
        //页面的高度 包含滚动高度
        var scrollHeight = document.body.scrollHeight;
        //滚动条向下滚动 distance
        window.scrollBy(0, distance);
        totalHeight += distance;
        //当滚动的总高度 大于 页面高度 说明滚到底了。也就是说到滚动条滚到底时，以上还会继续累加，直到超过页面高度
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
