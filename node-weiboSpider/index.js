let {PythonShell} = require('python-shell')
const notifier = require('node-notifier');
const file = require('./src/file.js');
// const shell = require('shelljs');
const configs = require('../config');




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

const cookies =configs.cookies

async function main(where,regexp,cookie,time){

 const  userListFile= await file.getUserList(where,regexp)

  let spider = new PythonShell('./weiboSpider/weiboSpider.py', {
    mode: 'text',
    // message 模式
   //  args:['-i','2492465520','-i',"2201566133",'-c',cookie]
    args:[
      '-s','2009-01-01',
      '-c',cookie,
      '-u',userListFile,
    // '-m','mongodb://jinjun:jj044019@149.248.5.21/admin'
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

main("id","[0]$",cookies[Math.floor((Math.random()*cookies.length))],60000)
main("id","[1]$",cookies[Math.floor((Math.random()*cookies.length))],70000)
main("id","[2]$",cookies[Math.floor((Math.random()*cookies.length))],100000)
main("id","[3]$",cookies[Math.floor((Math.random()*cookies.length))],120000)
main("id","[4]$",cookies[Math.floor((Math.random()*cookies.length))],90000)
main("id","[5]$",cookies[Math.floor((Math.random()*cookies.length))],300000)
main("id","[6]$",cookies[Math.floor((Math.random()*cookies.length))],333000)
main("id","[7]$",cookies[Math.floor((Math.random()*cookies.length))],140000)
main("id","[8]$",cookies[Math.floor((Math.random()*cookies.length))],130000)
main("id","[9]$",cookies[Math.floor((Math.random()*cookies.length))],222222)

