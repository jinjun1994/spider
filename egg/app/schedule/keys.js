

module.exports = {
  schedule: {
    interval: '1200h', // 1 分钟间隔
    type: 'worker', // 指定所有的 worker 都需要执行
    immediate: true,
  },
  async task(ctx) {
    await ctx.service.wechatAccount.refreshCookie(ctx);
  },

};
