// var PDFDocument = require('pdfkit');
// const doc = new PDFDocument();
// var json = { list: ['Test', 'Array'], success: true }
// doc.fontSize(15)
//     .fillColor('blue')
//     .text(JSON.stringify(json, null, 2), 100, 100)
// // .link(100, 100, 160, 27, link);

// // doc.pipe(res);

// doc.end();

const PDFDocument = require('pdfkit');
const fs = require('fs');
const jsonfile = require('jsonfile')
const file = 'weiboSpider/weibo/硅谷王川/5339148412.json'
const baseUrl ="weiboSpider/weibo/pdfs"
if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl);
}
jsonfile.readFile(file)
.then(obj => {
    const {user:{nickname,id},weibo}=obj
    
    console.dir(obj.weibo[0])
    // Create a document
    const doc = new PDFDocument(); 
    doc.info['Title'] = `${nickname}微博合集`;
    doc.info['Author'] = '金俊';
    doc.font('./fonts/MicrosoftYaHeiLight-01.ttf');//指定微软雅黑字体
    doc.pipe(fs.createWriteStream(`weiboSpider/weibo/pdfs/${nickname}微博合集.pdf`));
   console.log(doc.x,doc.y);
    doc.text(`版权所有: `,doc.x,doc.y,{lineBreak :false});
    // doc.text(`版权所有:`);
    const width = doc.widthOfString(nickname);
    const height = doc.currentLineHeight();
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
       // underline: true, bug?? 不能和 underline: true,共存
        // lineBreak :false
      })
    //    https://github.com/foliojs/pdfkit/blob/e641a785082b80c0f88e04ddcab04e3c726ea6b4/docs/annotations.md
    doc.moveDown()
       .fillColor('black');
     for (const weibo of obj.weibo) {
        doc.text(weibo.content,doc.page.margins.left,doc.y,{ align: 'justify'});
        doc.moveDown();
     }

     const example= {"id": "Ixt7RnHVq", 
     "content": "据说提高创意的一个秘诀，是在你和你要完成的任务之间制造一种心理距离。如果没有心理距离，我们对问题的分析理解会过于局部化，没有意识到它的潜在的很多应用和连接，这就是所谓的\"灯下黑\"。古话说 \"当局者迷 旁观者清\" ，似乎也是因为旁观者有距离感，可以更加全面的考虑各种可能性。哪怕是想象一个东西物理上离你很远，或者发生在很久的时间以后，或者某个罕见的事情 (几率空间的距离)，都可能提高创意。当一个东西离你越近，你很容易看到一些局限，然后内心本能地会被局限压制了想象力。而距离感会导致一种更加抽象不受人为限制的思考，因此更容易天马行空地产生创意和意外发现。这个理论在 2009年被当时在 Indiana 大学的心理学学者 Lile Jia (现为国立新加坡大学教授) 的研究佐证。                                ",
      "original_pictures": "无", 
      "retweet_pictures": "无", 
      "original": true, 
      "video_url": "无", 
      "publish_place": "无", 
      "publish_time": "2020-03-07 09:08", 
      "publish_tool": "Android", "up_num": 6, "retweet_num": 3, "comment_num": 1}
    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
   
     
    // Embed a font, set the font size, and render some text
    // doc
    // //   .font('fonts/PalatinoBold.ttf')
    //   .fontSize(25)
    //   .text('Some text with an embedded font!', 100, 100);
     
    // // Add an image, constrain it to a given size, and center it vertically and horizontally
    // // doc.image('path/to/image.png', {
    // //   fit: [250, 300],
    // //   align: 'center',
    // //   valign: 'center'
    // // });
     
    // // Add another page
    // doc
    //   .addPage()
    //   .fontSize(25)
    //   .text('Here is some vector graphics...', 100, 100);
     
    // // Draw a triangle
    // doc
    //   .save()
    //   .moveTo(100, 150)
    //   .lineTo(100, 250)
    //   .lineTo(200, 250)
    //   .fill('#FF3300');
     
    // // Apply some transforms and render an SVG path with the 'even-odd' fill rule
    // doc
    //   .scale(0.6)
    //   .translate(470, -380)
    //   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    //   .fill('red', 'even-odd')
    //   .restore();
     
    // // Add some text with annotations
    // doc
    //   .addPage()
    //   .fillColor('blue')
    //   .text('Here is a link!', 100, 100)
    //   .underline(100, 100, 160, 27, { color: '#0000FF' })
    //   .link(100, 100, 160, 27, 'http://google.com/');
     
    //   doc.pipe(result);
    // Finalize PDF file
    doc.end();
}
)
.catch(error => console.error(error))
