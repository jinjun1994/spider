let {PythonShell} = require('python-shell')
const notifier = require('node-notifier');
const file = require('./src/file.js');
// const shell = require('shelljs');





PythonShell.runString('x=1+1;print(x)', null, function (err) {
  if (err) throw err;
  console.log('finished');
});

// PythonShell.run('./weiboSpider/spider.py', null, function (err) {
//   if (err) throw err;
//   console.log('finished');
// });

const time =120000
// 创建实例 
const cookies =[
  // zhenzhou
  "_T_WM=67549327500; XSRF-TOKEN=ac563a; WEIBOCN_FROM=1110006030; SUB=_2A25zSTuuDeRhGeRG7FUQ9S_JwzyIHXVQskXmrDV6PUJbkdANLUvgkW1NTeDC5UwnAwS0wPA93rl7Ab7WsZk1-Oc8; SUHB=0KAxB6GtJUe0u0; SCF=AhvJUhUx7XjzOcJTOsfg5SPCNiS1bETr998DEnIo15BdV-myJoT-GxLBcaPm655UodI6qeAm_BVi2mova3lKkac.; SSOLoginState=1582124030; MLOGIN=1; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D102803%26uicode%3D10000011%26fid%3D102803",
//apple
  "ALF=1586225880; SCF=AhkvgS54pYYJqfU9BWpywPguH16eeVHlVIhzXg6zBlumkPTx9eya1l1DUp9WXplWN7UcJouIM2E0AhbBoocohUQ.; SUB=_2A25zYCWJDeRhGeFK61YU-CrNyDSIHXVQq0vBrDV6PUNbktAKLUj1kW1NQ7eego910Jywe1zkIrzG4ZgeTjIeq_Fr; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WW0407gFQa.qmJYdCZ7eamp5JpX5KMhUgL.FoMXehBf1hBpe0n2dJLoIp7LxKML1KBLBKnLxKqL1hnLBoMNSh5XSKnXeKeR; SUHB=0TPFPYlxYipX6C; SSOLoginState=1583633881; _T_WM=01c403a19130536c596f607103ae104b",
//anqin
"SCF=AhvJUhUx7XjzOcJTOsfg5SPCNiS1bETr998DEnIo15BdV-myJoT-GxLBcaPm655UodI6qeAm_BVi2mova3lKkac.; SUB=_2A25zYN4vDeRhGeFK61oW8C_LyzSIHXVQquJnrDV6PUJbkdAfLU_nkW1NQ4_O5jNUbpPns-EsVkTX_gIcTzrOSTLU; SUHB=0ElqrveOOiA5qW; SSOLoginState=1583656575; _T_WM=14377052981; WEIBOCN_FROM=1110006030; MLOGIN=1; M_WEIBOCN_PARAMS=uicode%3D20000174"
]
async function main(where,regexp,cookie,time){

 const  userListFile= await file.getUserList(where,regexp)

  let spider = new PythonShell('./weiboSpider/weiboSpider.py', {
    mode: 'text',
    // message 模式
   //  args:['-i','2492465520','-i',"2201566133",'-c',cookie]
    args:[
      '-s','2010-01-01',
      '-c',cookie,
      '-u',userListFile,
    '-m','mongodb://jinjun:jj044019@149.248.5.21/admin'
  ]
   });
 
 spider.on('message', function (message) {
   // handle message (a line of text from stdout)
   // stderr / stdin / stdout 分别指向与标准错误流 / 标准输入流 / 标准输出流相关联的 FILE 对象
   // stdout是行缓冲的，他的输出会放在一个buffer里面，只有到换行的时候，才会输出到屏幕。而stderr是无缓冲的
   console.log(message);
   if (message==='start') {
 console.log("开始");
//  notifier.notify({
//   title: 'Node Spider ',
//   message: '开始抓取',
//   sound: false
// });
   }
 });
 
 spider.on('stderr', function (stderr) {
   // handle stderr (a line of text from stderr)
   console.log(stderr);
 });
 spider.on('close', async function (close) {
   // handle stderr (a line of text from stderr) 
   // Fires when the process has been terminated, with an error or not.
   console.log(close,'close');
  //  notifier.notify({
  //   title: 'Node Spider ',
  //   message: '抓取完毕',
  //   sound: false
  // });
  await file.updateTime(`./weiboSpider/user/${userListFile}`)
  // if (shell.exec('weibo').code !== 0) {
  //   shell.echo('error');
  //   shell.exit(1);
  // } else {
  //   shell.echo('copy weibo success');
  // }
  console.log("success runn again");
   setTimeout(main, time,where,regexp,cookie,time);
 });
 spider.on('error', function (error) {
   // handle stderr (a line of text from stderr)
   // Fires when the process terminates with a non-zero exit code.
   console.log(error,'error');
   notifier.notify({
    title: 'Node Spider ',
    message: '运行出错'
  });
 });

}

main("id","[0]$",cookies[0],60000)
main("id","[1]$",cookies[1],70000)
main("id","[2]$",cookies[2],100000)
main("id","[3]$",cookies[1],120000)
main("id","[4]$",cookies[2],90000)
main("id","[5]$",cookies[0],300000)
// main("id","[6]$",cookies[1],333000)
main("id","[7]$",cookies[2],140000)
// main("id","[8]$",cookies[0],130000)
// main("id","[9]$",cookies[2],222222)

