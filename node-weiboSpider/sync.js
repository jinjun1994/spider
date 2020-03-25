const shell = require('shelljs');


shell.rm('-rf', 'db/weibo');
shell.exec('mongodump  -d weibo -o db')
shell.exec('mongorestore -h 149.248.5.21 -u jinjun -p jj044019 --authenticationDatabase admin -d weibo db/weibo/')
// shell.exec('mongorestore -h 149.248.5.21  -d weibo db/weibo/')
// if (shell.exec('mongodump  -d weibo -o db').code !== 0) {
//     shell.echo('dump success');
//     if (shell.exec('mongorestore -h 149.248.5.21 -u jinjun -p jj044019 --authenticationDatabase admin -d weibo dump/weibo/').code !== 0) {
//         shell.echo('restore success');
//         shell.exit(1);
        
//       } else {
//         shell.echo('restore failed');
//       }

    
//   } else {
//     shell.echo('dump failed');
//   }