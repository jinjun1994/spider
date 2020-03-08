const { app, assert } = require('egg-mock/bootstrap');


describe('get()', () => {
  it('should get exists user', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const { user_id, nickname } = await ctx.service.user.findUserIdByUrl('https://weibo.com/u/6485156633?is_all=1');
    assert(user_id);
    assert(user_id === '6485156633');
    // assert(user_id === '迎十里');
  });
  it('should get exists user', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const { user_id, nickname } = await ctx.service.user.findUserIdByUrl('https://weibo.com/svwangchuan?is_all=1');
    assert(user_id);
    assert(user_id === '5339148412');
    assert(nickname === '硅谷王川');
  });


});