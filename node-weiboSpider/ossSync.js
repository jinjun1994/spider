const configs = require('../config');
var ABU=require('alioss-batch-upload');
 
var abu=new ABU({
    ...configs.ossAuth,
    ossDir:'/weibos/',//阿里云OSS根目录，默认为'/',
    pattern:''	
})
abu.upload('./weiboSpider/weibo/',{
    //options
});//上传当前目录