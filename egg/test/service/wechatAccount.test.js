const { app, assert } = require('egg-mock/bootstrap');


describe('test/service/wechatAccount.test.js', () => {
  it('should get  key', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const { skey, vid } = await ctx.service.wechatAccount.getKeys();
    assert(skey);
    assert(vid);
    // assert(user_id === '迎十里');
  });
  it('should get headers', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const { skey, vid, channelid } = await ctx.service.wechatAccount.getHeaders();
    assert(skey);
    assert(vid);
    assert(channelid === 'AppStore',);
  });
  it('should  findBookByTitle', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const { books } = await ctx.service.wechatAccount.findBookByTitle('剪枝者');
    assert(books);
  });


});