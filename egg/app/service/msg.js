'use strict';
module.exports = {
  ok: { errcode: 0, errmsg: 'OK' },

  noErr(msg) {
    if (msg) {
      return { errcode: 0, errmsg: msg };
    }
    return this.ok;

  },
  createErr(err) {
    return { errcode: 1, errmsg: '创建失败：' + err.message || err };
  },
  updateErr(err) {
    return { errcode: 2, errmsg: '更新失败：' + err.message || err };
  },
  removeErr(err) {
    return { errcode: 3, errmsg: '删除失败：' + err.message || err };
  },
  notFoundErr(err) {
    return { errcode: 4, errmsg: '未找到：' + err.message || err };
  },
  validateErr(err) {
    return { errcode: 5, errmsg: err.message || err };
  },
  uploadErr(err) {
    return { errcode: 6, errmsg: err.message || err };
  },
  customErr(err) {
    return { errcode: 99, errmsg: err.message || err };
  },
};
