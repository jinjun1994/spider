
# 体验地址 
https://jizhi.amazingtm.com/

# 功能
自动抓取微博、微信公众号；

配套前端网站；数据展示，用户查询，内容查询，数据分析。

自动生成微信文章、微博合集PDF；

提交微博用户主页地址自动入库用户；

提交微信公众号昵称自动入库；



# 部署方法
待更新

# 项目架构
## egg
提供后端服务

查询公众号接口通过微信读书抓包得到

##  Vue 
前端网站

## Node
爬虫及文件数据处理
weiboSpider 爬虫抓取（无限循环）
ossSync 抓取的微博数据，生成的词云，生成的Pdf等同步到阿里云Oss（）
wordCloud 定时生成词云
imageMin.js 提供图片压缩功能
pdf.js  
遍历所有微博json文件生成pdf
读取超大json文件会内存溢出 解决方法：
(node --max-old-space-size=15555  pdf.js 
)
  articlePdf.js 生成微信文章


# 配置

参考 config.js 
需要指定电脑或者服务器上的中文字体路径
  doc.font('c:/Windows/Fonts/msyh.ttc');//指定微软雅黑字体
  


config:
puppeteer userDataDir  // 保存cookie所用


# ToDo
Electron 桌面版

使用到的 开源库

egg

vue

https://www.npmjs.com/package/pdfkit 

https://www.npmjs.com/package/jsonfile

https://www.npmjs.com/package/request-promise

https://www.npmjs.com/package/buffer-image-size

https://www.npmjs.com/package/redis

https://www.npmjs.com/package/pdf-merger-js