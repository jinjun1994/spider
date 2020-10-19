

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async time() {
    const { ctx } = this;
    ctx.body = {
      time: new Date(),
    };
  }
}

module.exports = HomeController;
