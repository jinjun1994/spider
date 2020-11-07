const configs = require('../config');
var ABU=require('./utils/ossUpload.js');
 













// 记录上传时间；文件时间晚于上传时间再上传
// 文件一样不上传
// var abu=new ABU({
//     ...configs.ossAuth,
//     ossDir:'/weibos/',//阿里云OSS根目录，默认为'/',
//     pattern:''	
// })
// abu.upload('./weiboSpider/weibo/',{
//     //options
// });//上传当前目录
articles=new ABU({
    ...configs.ossAuth,
    ossDir:'/articles/',//阿里云OSS根目录，默认为'/',
    pattern:''	
})
articles.upload('./articles/',{
    //options
});//上传当前目录