const Koa = require('koa');
const fs = require('fs');
const app = new Koa();
const router = require('./src/controller')
const cors = require('koa2-cors');
app.use(cors());
// app.use();
// 上传分片
  console.log('test 1234')

app.use(router.routes()); 
app.use(router.allowedMethods());
// app.use(async ctx => {
//   ctx.body = 'Hello World';
// });
 
  

app.listen(3003);