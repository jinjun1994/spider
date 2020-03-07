
const axios =require('axios')

const axiosInstance = axios.create({ baseURL: "http://127.0.0.1:7002" });
axiosInstance.defaults.headers.Cookie = "csrfToken=iKR4tho-ZwEA4zDWvk-4twH4"; // attach cookie to axiosInstance for future requests
axiosInstance.defaults.headers["x-csrf-token"] = "iKR4tho-ZwEA4zDWvk-4twH4"; // attach cookie to axiosInstance for future requests
// https://github.com/eggjs/egg/issues/3050#issuecomment-429039813



module.exports = {
    
async updateTime(path){
    try{
    const bulkWrite = []
    const fs = require('fs');
    const users = fs.readFileSync(path).toString().split("\n");
    for(user of users) {
        info = user.split(" ")
        console.log(info)
        if (!info[2]) return
        bulkWrite.push(
            { updateOne :
           {
              "filter": { id : info[0] },
              "update": {
                time: info[2] + (info[3] ? ' ' + info[3]:'')
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
       
}
}