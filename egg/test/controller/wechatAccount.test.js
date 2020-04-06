const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/wechatAccount.test.js', () => {

  it('should status 200 and get the body', async () => {
    // 对 app 发起 `GET /` 请求
    app.mockCsrf();
    const res = await app.httpRequest()
      .post('/wechat/submit')
      .send({ title: '剪枝者' });

    assert(res.body.message === '剪枝者 已经收录，无须提交');
  });
  it('should status 200 and get the body', async () => {
    // 对 app 发起 `GET /` 请求
    app.mockCsrf();
    const res = await app.httpRequest()
      .post('/wechat/submit')
      .send({ title: 'investguru' });

    assert(res.body.message === 'investguru 已经收录，无须提交');
  });
  it('should 404', async () => {
    // 对 app 发起 `GET /` 请求
    app.mockCsrf();
    const title = 'investguruasdadwawe';
    const res = await app.httpRequest()
      .post('/wechat/submit')
      .send({ title });

    assert(res.body.message === title + ' 未找到，请确认输入正确');
  });


});