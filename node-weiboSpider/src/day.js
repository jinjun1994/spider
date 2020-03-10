var utc = require('dayjs/plugin/utc')


const day = require('dayjs');
day.extend(utc)
day().utcOffset(8) 

const  time = "2020-03-08T10:43:00.000Z"

const a =day(time)

// console.log(a.utc().format());
console.log(a.format("YYYY-MM-DD HH:mm") );

const b =day("2020-03-09 06:01")
console.log(b.utc().format());

//存的时候是 东八区 早了八个小时

