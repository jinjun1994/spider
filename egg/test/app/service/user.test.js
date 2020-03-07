const { app, assert } = require('egg-mock/bootstrap');


describe('get()', () => {
  it('should get exists user', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const user = await ctx.service.user.findUserByName('fengmk2');
    assert(user);
    assert(user.name === 'fengmk2');
  });


});