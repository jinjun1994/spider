'use strict';
module.exports = {
  /**
   * 根据 page size sort order 计算 skip limit sort
   * @param {Object} options {page, size, sort, order}
   * @return {Object} {skip, limit, sort}
   */
  pageQuery(options) {
    let page = options.page;
    let size = options.size;
    let sort = options.sort;
    const order = options.order;
    if (!page) {
      page = 0;
    } else {
      page = parseInt(page) - 1;
      if (page < 0) {
        page = 0;
      }
    }
    if (!size) {
      size = 10;
    } else {
      size = parseInt(size);
    }

    if (sort) {
      if (order === '-1') {
        sort = { [sort]: -1 };
      } else {
        sort = { [sort]: 1 };
      }
      return {
        sort,
        skip: size * page,
        limit: size,
      };
    }

    return {
      skip: size * page,
      limit: size,
    };
  },


};
