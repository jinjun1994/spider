const { app, assert } = require('egg-mock/bootstrap');
const url = require('url');

describe('test/service/mysql/wechatAccountTask.test.js', () => {

  it.skip('findByOptions', async () => {
    // 测试成功，不能重复创建，暂时跳过
    // 创建 ctx
    const ctx = app.mockContext();
    const result = await ctx.service.mysql.wechatAccountTask.create({ biz: 'MzIzNTQ4ODg4OA==' });
    console.log(result);
    assert(result);
  });


});