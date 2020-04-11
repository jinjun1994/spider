const { app, assert } = require('egg-mock/bootstrap');
const url = require('url');

describe('test/service/mysql/wechatAccount.test.js', () => {
  it.skip('creates', async () => {
    // 测试已经通过 不能重复 暂时跳过
    const ctx = app.mockContext();

    const list = [
      {
        sn: 'b28f0afb87c0f19fb0b2ac92ba9ac165',
        article_url: 'https://mp.weixin.qq.com/s?__biz=MzIzNTQ4ODg4OA==&mid=2247484949&idx=2&sn=b28f0afb87c0f19fb0b2ac92ba9ac165#wechat_redirect',
        state: 0,
        biz: 'MzIzNTQ4ODg4OA=='
      }
    ];
    const result = await ctx.service.mysql.wechatArticleTask.creates(list);
    console.log(result);
    assert(result);
  });
  it('findByOptions', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    // 通过 ctx 访问到 service.user
    const account = '剪枝者';
    const result = await ctx.service.mysql.wechatAccount.findOneByOptions({ account });
    console.log(result);
    assert(result);
  });
  it('url', async () => {
    const doc_url = 'https://mp.weixin.qq.com/s?__biz=MzIzNTQ4ODg4OA==&mid=2247485277&idx=1&sn=f7e521aecce3a94a1bd896b3aeca29b7&chksm=e8e7144adf909d5cd3752bba3a9bab703878b107211b992462e154fa7be81c1af6c9c5e92d85#rd';
    const { query: { __biz, sn, hash } } = url.parse(doc_url, true);
    console.log(__biz, sn, hash);
    console.log(doc_url.replace('#rd', '&scene=27#wechat_redirect'));
    const article = {
      biz: __biz,
      sn,
      article_url: doc_url.replace('#rd', '&scene=27#wechat_redirect'),
      state: 0,
    };
    assert(__biz === 'MzIzNTQ4ODg4OA==');
  });


});