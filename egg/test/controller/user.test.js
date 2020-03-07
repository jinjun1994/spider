const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/user.test.js', () => {
  describe('GET /', () => {
    it('should status 200 and get the body', async () => {
      // 对 app 发起 `GET /` 请求
      app.mockCsrf();
      const res = await app.httpRequest()
        .post('/user/submit')
        .send({ url: 'https://weibo.com/u/2189910831?is_all=1' });
        // .expect(200) // 期望返回 status 200
        // .expect('hello world'); // 期望 body 是 hello world

      assert(res.body.message = '该微博用户已经收录，无须提交');
    });
    it('should status 200 and get the body', async () => {
      // 对 app 发起 `GET /` 请求
      app.mockCsrf();
      const res = await app.httpRequest()
        .post('/user/submit')
        .send({ url: 'https://weibo.com/u/21899QW' });
        // .expect(200) // 期望返回 status 200
        // .expect('hello world'); // 期望 body 是 hello world

      assert(res.body.message = '该微博用户已经收录，无须提交');
    });

    // it('should send multi requests', async () => {
    //   // 使用 generator function 方式写测试用例，可以在一个用例中串行发起多次请求
    //   await app.httpRequest()
    //     .get('/')
    //     .expect(200) // 期望返回 status 200
    //     .expect('hello world'); // 期望 body 是 hello world

    //   // 再请求一次
    //   const result = await app.httpRequest()
    //     .get('/')
    //     .expect(200)
    //     .expect('hello world');

    //   // 也可以这样验证
    //   assert(result.status === 200);
    // });
  });
});