# egg
提供后端服务




# Vue 
前端网站

# Node
爬虫及文件数据处理
weiboSpider 爬虫抓取
ossSync 抓取的微博数据，生成的词云，生成的Pdf等同步到阿里云Oss
wordCloud 定时生成词云
imageMin.js 提供图片压缩功能
pdf.js  
遍历所有微博json文件生成pdf
读取超大json文件会内存溢出 解决方法：
(node --max-old-space-size=15555  pdef.js 
)
  


配置：
需要指定电脑或者服务器上的中文字体路径
  doc.font('c:/Windows/Fonts/msyh.ttc');//指定微软雅黑字体
  



config:
puppeteer userDataDir  // 保存cookie所用

使用到的 开源库
egg
vue
https://www.npmjs.com/package/pdfkit 
https://www.npmjs.com/package/jsonfile
https://www.npmjs.com/package/request-promise
https://www.npmjs.com/package/buffer-image-size
https://www.npmjs.com/package/redis