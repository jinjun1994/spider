
const axios =require('axios')
const fs = require('fs');
const day = require('dayjs');
const utc = require('dayjs/plugin/utc')
day.extend(utc)
// day().utcOffset(8) 
const axiosInstance = axios.create({ baseURL: "http://127.0.0.1:7001" });
// const axiosInstance = axios.create({ baseURL: "https://jizhi.jinjun.wiki/api" });
axiosInstance.defaults.headers.Cookie = "csrfToken=TBGV4KxSTGN9mwe263tvl6ZY"; // attach cookie to axiosInstance for future requests
axiosInstance.defaults.headers["x-csrf-token"] = "TBGV4KxSTGN9mwe263tvl6ZY"; // attach cookie to axiosInstance for future requests
// https://github.com/eggjs/egg/issues/3050#issuecomment-429039813



module.exports = {
    
async updateTime(path){
    try{
    const bulkWrite = []
  
    const users = fs.readFileSync(path).toString().split("\n");
    for(user of users) {
        info = user.split(" ")
        console.log(info)
      
        if (!info[2]) return
        const  time = day(info[2] + (info[3] ? ' ' + info[3]:'')).utc().format()
        bulkWrite.push(
            { updateOne :
           {
              "filter": { id : info[0] },
              "update": {
                time: time
              },           

           }
          }
        )
    }
  
    const res =await axiosInstance.post('/user/bulkWrite',{bulkWrite})
    console.log(res.data)
    } catch (err){
        console.log(err)
    }
       
},
async getUserList(where,regexp){
 try {
    const users =await  axiosInstance.get('/user',{params:{
        full:true,
        where:'id',
        ...(where ? { where } : {}),
        ...(regexp ? { regexp } : {}),
    }})

    console.log(users.data.list)
    const list = users.data.list
    let text =''
    
    for (const user of list){
        console.log(user.time);
        const line =  user.id+' '+user.nickname+' '+day(user.time).format("YYYY-MM-DD HH:mm") 
        if (text){
            text =text +'\n' + line 
        } else{
            text =line 
        }
       
    
    }
    console.log(text)
    const filter = (where && regexp) ?`_${where}_${regexp}`:''
    const fileName = day().format("YYYYMMDDHHmm")+filter
    console.log(text)
   await fs.writeFileSync(`./weiboSpider/user/${fileName}.txt`, text, "utf8");

    console.log("write use list file success")
    return fileName+'.txt'
 } catch(error) {
   console.log(error)
}
},
  async  fetchAccount(params) {
    return await axiosInstance.get('mysql/wechat/account', { params });
  },
   async  findAccountById(id) {
    return await axiosInstance.get('mysql/wechat/account/' + id);
  },
   async  fetchArticle(params) {
    return await axiosInstance.get('mysql/wechat/article', { params });
  }
}