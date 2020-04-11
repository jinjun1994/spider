'use strict';
const redis = require('redis');
const { promisify } = require('util');
const config = require('../../../config');

const { port = 6379, host = '127.0.0.1' } = config.redis;

const redisClient = redis.createClient(port, host);


module.exports = {
  /**
   * 根据 page size sort order 计算 skip limit sort
   * @param {Object} options {page, size, sort, order}
   * @return {Object} {skip, limit, sort}
   */
  pageQuery(options) {

    let sort = options.sort;
    const order = options.order;
    const { offset, limit } = this.query(options);
    if (sort) {
      if (order === '-1') {
        sort = { [sort]: -1 };
      } else {
        sort = { [sort]: 1 };
      }
      return {
        sort,
        skip: offset,
        limit
      };
    }

    return {
      skip: offset,
      limit
    };
  },
  query(options) {
    let page = options.page;
    let size = options.size;
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

    return {
      offset: size * page,
      limit: size,
    };
  },
  mysqlPageQuery(options) {
    return this.query(options);
  },
  asyncRedis(cmd, ...args) {
    return promisify(redisClient[cmd]).call(redisClient, ...args);
  },
  random(min, max) {
    if (max === min) return max;
    if (max < min) [ min, max ] = [ max, min ];
    return Math.round(Math.random() * (max - min) + min);
  },
  sleep(min, max) {
    const ms = max ? this.random(min, max) : min;
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
};
