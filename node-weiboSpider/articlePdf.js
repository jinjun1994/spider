const PDFDocument = require("pdfkit");
const fs = require("fs");
const filenamify = require("filenamify");
const api = require("./src/file.js");
const PDFMerge = require("pdf-merge");
const { Cluster } = require("puppeteer-cluster");
const PDFMerger = require("pdf-merger-js");
const merge = require("easy-pdf-merge");

(async function mkdir() {
  const { data: accounts } = await api.fetchAccount({
    total: true,
    full: true,
  });
  console.log(accounts);
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 8,
    timeout: 300000,
  });
  await cluster.task(async ({ page, data: { url, biz, title } }) => {
    console.log(biz, title);
    await page.goto(url, { waitUntil: "networkidle0" });
    await autoScroll(page);
    console.log("2");
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
    console.log(3);
  });
  const mergeFiles = {};
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
    const articleFiles = [];
    const newArticleFiles = [];
    for (const article of articles.rows) {
      articleFiles.push(baseUrl + `/${filenamify(article.title)}.pdf`);
      try {
        if (!fs.existsSync(baseUrl + `/${filenamify(article.title)}.pdf`)) {
          newArticleFiles.push(baseUrl + `/${filenamify(article.title)}.pdf`);
          cluster.queue(article);
        }
      } catch (error) {
        console.log(error);
      }
    }
    mergeFiles[
      `${baseUrl}/${
        account.account ? account.account : account.biz
      }_微信文章合集`
    ] = {
      all: articleFiles,
      new: newArticleFiles,
    };
  }
  await cluster.idle();
  await cluster.close();
  for (const [k, v] of Object.entries(mergeFiles)) {
    if(v.new.length ||!fs.existsSync(`${k}.pdf`) ) {
      if (fs.existsSync(`${k}.pdf`) ) {
        fs.unlinkSync(`${k}.pdf`)
      }
      if (v.all.length > 0) {
        await mergePdfs(v.all, k);
      }
    }
    
  }
})();

// async function printPDF({ page ,url, biz, title } = {}) {

//   await page.goto(url, { waitUntil: "networkidle0" });
//   await autoScroll(page);
//   const pdf = await page.pdf({
//     path: `./articles/${biz}/${filenamify(title)}.pdf`,
//     format: "A4",
//     preferCSSPageSize: true,
//     // printBackground: true,
//     margin: {
//       top: 10,
//       right: 60,
//       bottom: 10,
//       left: 60,
//     },
//   });

//   // await page.close();
//     // return pdf
// }

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

async function mergePdfs(pdfs, name) {
  try {
    if (pdfs.length > 50) {
      await PDFMerge(
        [
          ...(fs.existsSync(`${name}.pdf`) ? [`${name}.pdf`] : []),
          ...pdfs.slice(0, 50),
        ],
        { output: `${name}.pdf` }
      );
      await mergePdfs(pdfs.slice(50), name);
    } else {
      await PDFMerge(
        [...(fs.existsSync(`${name}.pdf`) ? [`${name}.pdf`] : []),...pdfs, ],
        { output: `${name}.pdf` }
      );
    }

    console.log(name);
  } catch (error) {
    console.log(error);
  }
}
