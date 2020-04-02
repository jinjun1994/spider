const PDFDocument = require('pdfkit');
const fs = require('fs');
const jsonfile = require('jsonfile')

const rp = require('request-promise');
const sizeOf = require('buffer-image-size');
const dayjs = require('dayjs');

const baseUrl ="weiboSpider/weibo/pdfs"
if (!fs.existsSync(baseUrl)) {
  fs.mkdirSync(baseUrl);
}
let n=1;

(async()=>{


const list= fs.readdirSync("weiboSpider/weibo")

console.log(list);
const path=[]
for (const item of list) {
   if( statsObj = fs.statSync("weiboSpider/weibo/"+item).isDirectory()) {

    const json =  fs.readdirSync("weiboSpider/weibo/"+item).filter(e=>e.includes('.json'))[0]
    if (json){
        path.push("weiboSpider/weibo/"+item+"/"+json)
    }
    console.log(json);
}
}

for (const json of path) {
  // n++
  // if(n>2) return
  if(!json.includes("但斌")) {
// const json = 'weiboSpider/weibo/硅谷王川/5339148412.json'
// const obj = jsonfile.readFileSync(json, { encoding: 'utf8' })
const obj = JSON.parse(fs.readFileSync(json), { encoding: 'utf8' });
await makePdf(obj,{
  sort:"time",
  image:false
})
// await makePdf(obj,{
//   sort:"time",
//   image:true
// })
await makePdf(obj,{
  sort:"number",
  image:false
})
// await makePdf(obj,{
//   sort:"number",
//   image:true
// })

  } 


}

})()

async function makePdf(obj,{sort,image}={}) {


    let {user:{nickname,id},weibo}=obj
if (sort==="time") {
  weibo.sort((a,b)=>dayjs(b.publish_time).valueOf()-dayjs(a.publish_time).valueOf())
}
if (sort==="number") {
  weibo.sort((a,b)=> (b.up_num+b.comment_num+b.retweet_num)-(a.up_num+a.comment_num+a.retweet_num))
}
  

    console.dir(obj.weibo[0])
    // Create a document
    const doc = new PDFDocument(); 
    doc.info['Title'] = `${nickname}微博合集${sort}${image?"有图":""}`;
    doc.info['Author'] = '金俊';
    doc.font('./fonts/MicrosoftYaHeiLight-01.ttf');//指定微软雅黑字体
    const pdf = fs.createWriteStream(`weiboSpider/weibo/pdfs/${nickname}微博合集${sort}${image?"有图":""}.pdf`)
    doc.pipe(pdf);
    doc.text(`版权所有: `,doc.x,doc.y,{lineBreak :false});
    // doc.text(`版权所有:`);
    // const width = doc.widthOfString(nickname);
    // const height = doc.currentLineHeight();
    doc
       .fillColor('blue')
       .text(`${nickname}`,doc.x,doc.y, {
        width : doc.widthOfString(nickname),
        link: `https://www.weibo.com/u/${id}`,
        // underline: true, bug?? 不能和 underline: true,共存
        // lineBreak :false 
      })
    doc
       .fillColor('black')
       .text(`整理: `,doc.page.margins.left,doc.y,{lineBreak :false})
       .fillColor('blue');
    doc.text(`金俊`, doc.x,doc.y, {
        link: `https://www.weibo.com/u/2877151580`,
        width : doc.widthOfString("金俊"),
      })
    //    https://github.com/foliojs/pdfkit/blob/e641a785082b80c0f88e04ddcab04e3c726ea6b4/docs/annotations.md
    doc.moveDown()
       .fillColor('black');
     for (const item of weibo) {
         const { 
      id:weiboId, content, original_pictures, 
      retweet_pictures, 
      original, 
      video_url, 
      publish_place , 
      publish_time, 
      publish_tool, up_num, retweet_num, comment_num
    } = item
       doc
       .fillColor('black');
        doc.text(content,doc.page.margins.left,doc.y,{ align: 'justify'});
        doc.text(publish_time,doc.page.margins.left,doc.y,{ align: 'justify'});
        
        // doc.fillColor('blue');
     doc.text(`原文地址`, doc.x,doc.y, {
         link: `https://www.weibo.com/${id}/${weiboId}`,
         width : doc.widthOfString("原文地址"),
       })
       if (image){
        if(original_pictures!=='无'){
          await  addImage(original_pictures,doc)
            }
            if(retweet_pictures!=='无'){
          await  addImage(retweet_pictures,doc)
            }
       }
    
        doc.moveDown();
     }
     const a=  await rp({
      url: 'https://dummyimage.com/640.jpeg',
      encoding: null // Prevents Request from converting response to string
      // https://stackoverflow.com/questions/22887464/serve-dynamically-generated-pdf-with-remote-images-in-node-js
  })
  //   console.log(a,"640000000000000000000000")
  //  const{width,height}= sizeOf(a)
  //  console.log(width,height);
  //   doc.image(a, doc.page.margins.left,doc.y
  //     ,{scale: 0.25}
  //     );
// console.log(a);
     const example= {"id": "Ixt7RnHVq", 
     "content": "据说提高创意的一个秘诀，是在你和你要完成的任务之间制造一种心理距离。如果没有心理距离，我们对问题的分析理解会过于局部化，没有意识到它的潜在的很多应用和连接，这就是所谓的\"灯下黑\"。古话说 \"当局者迷 旁观者清\" ，似乎也是因为旁观者有距离感，可以更加全面的考虑各种可能性。哪怕是想象一个东西物理上离你很远，或者发生在很久的时间以后，或者某个罕见的事情 (几率空间的距离)，都可能提高创意。当一个东西离你越近，你很容易看到一些局限，然后内心本能地会被局限压制了想象力。而距离感会导致一种更加抽象不受人为限制的思考，因此更容易天马行空地产生创意和意外发现。这个理论在 2009年被当时在 Indiana 大学的心理学学者 Lile Jia (现为国立新加坡大学教授) 的研究佐证。                                ",
      "original_pictures": "无", 
      "retweet_pictures": "无", 
      "original": true, 
      "video_url": "无", 
      "publish_place": "无", 
      "publish_time": "2020-03-07 09:08", 
      "publish_tool": "Android", "up_num": 6, "retweet_num": 3, "comment_num": 1}
    doc.end();


}

async function addImage(url,doc){
  for (const p of url.split(',')) {
    try {
      const a=  await rp({
        url: p,
        encoding: null // Prevents Request from converting response to string
        // https://stackoverflow.com/questions/22887464/serve-dynamically-generated-pdf-with-remote-images-in-node-js
    })
      // console.log(a)
      doc.image(a, doc.page.margins.left,doc.y,{scale: 0.25});
    } catch (error) {
      console.log(error);
    }

  }
}