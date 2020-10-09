const fs = require("fs");
let { PythonShell } = require("python-shell");
const notifier = require("node-notifier");

const imageMin = require("./imageMin");

let index = 0;
function main(time) {
  const list = fs.readdirSync("weiboSpider/weibo");
  console.log(list);
  const path = [];
  for (const item of list) {
    if ((statsObj = fs.statSync("weiboSpider/weibo/" + item).isDirectory())) {
      const csv = fs
        .readdirSync("weiboSpider/weibo/" + item)
        .filter((e) => e.includes(".csv"))[0];
      if (csv) {
        path.push("weiboSpider/weibo/" + item + "/" + csv);
      }
      console.log(csv);
    }
  }
  console.log(path);

  makeImg(path);

  (async () => {
    await imageMin.CompressAll();
  })();
  setTimeout(main, time, time);
}

function makeImg(path) {
  let spider = new PythonShell("./weiboSpider/EDA/eda_api.py", {
    mode: "text",
    // message 模式
    //  args:['-i','2492465520','-i',"2201566133",'-c',cookie]
    args: [
      // "weiboSpider/weibo/剪枝者/2201566133.csv"
      // "weiboSpider/weibo/迎十里/6485156633.csv"
      // "weiboSpider/weibo/顾芷沐/5315308583.csv"
      path[index],
    ],
  });

  spider.on("message", function (message) {
    console.log(message);
  });

  spider.on("close", async function (close) {
    console.log(close, "close");
    // await   imageMin.Compress(path[index])
    index++;
    if (index > path.length - 1) {
      index = 0;
    } else {
      console.log("success run again");
      makeImg(path);
    }
  });

  spider.on("error", function (error) {
    console.log(error, "error");
    notifier.notify({
      title: "Node Spider ",
      message: "运行出错",
    });
  });
}
main(1000 * 60 * 60);
