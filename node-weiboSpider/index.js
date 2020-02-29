let {PythonShell} = require('python-shell')

PythonShell.runString('x=1+1;print(x)', null, function (err) {
  if (err) throw err;
  console.log('finished');
});

// PythonShell.run('./weiboSpider/spider.py', null, function (err) {
//   if (err) throw err;
//   console.log('finished');
// });

const time =60000
// 创建实例 
const cookie ="_T_WM=67549327500; XSRF-TOKEN=ac563a; WEIBOCN_FROM=1110006030; SUB=_2A25zSTuuDeRhGeRG7FUQ9S_JwzyIHXVQskXmrDV6PUJbkdANLUvgkW1NTeDC5UwnAwS0wPA93rl7Ab7WsZk1-Oc8; SUHB=0KAxB6GtJUe0u0; SCF=AhvJUhUx7XjzOcJTOsfg5SPCNiS1bETr998DEnIo15BdV-myJoT-GxLBcaPm655UodI6qeAm_BVi2mova3lKkac.; SSOLoginState=1582124030; MLOGIN=1; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D102803%26uicode%3D10000011%26fid%3D102803"
function main(){
  let spider = new PythonShell('./weiboSpider/weiboSpider.py', {
    mode: 'text',
    // message 模式
   //  args:['-i','2492465520','-i',"2201566133",'-c',cookie]
    args:['-s','2020-02-27','-c',cookie]
   });
 
 spider.on('message', function (message) {
   // handle message (a line of text from stdout)
   // stderr / stdin / stdout 分别指向与标准错误流 / 标准输入流 / 标准输出流相关联的 FILE 对象
   // stdout是行缓冲的，他的输出会放在一个buffer里面，只有到换行的时候，才会输出到屏幕。而stderr是无缓冲的
   console.log(message);
   if (message==='start') {
 console.log("开始");
   }
 });
 
 spider.on('stderr', function (stderr) {
   // handle stderr (a line of text from stderr)
   console.log(stderr);
 });
 spider.on('close', function (close) {
   // handle stderr (a line of text from stderr) 
   // Fires when the process has been terminated, with an error or not.
   console.log(close,'close');
 });
 spider.on('error', function (error) {
   // handle stderr (a line of text from stderr)
   // Fires when the process terminates with a non-zero exit code.
   console.log(error,'error');
 });
 setTimeout(main, time);
}

main()