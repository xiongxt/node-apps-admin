'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html', {
      title: '你妈贵姓',
    });
  }
  async test() {
    const { ctx } = this;
    ctx.body = 'test';
  }

  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    try {
      const result = await ctx.service.user.login(username, password);

      if (result.success) {
        const token = app.jwt.sign({
          uuid: result.username, // 需要存储的 token 数据
        }, app.config.jwt.secret, { expiresIn: '60m' });

        ctx.body = {
          status: 200,
          data: {
            account: result.data,
            token,
          },
        };
      } else {
        ctx.body = {
          status: 401,
          message: result.message,
        };
      }

    } catch (error) {
      ctx.body = {
        status: 401,
        message: error.message,
      };
    }

  }

  async accountList() {
    const { ctx } = this;
    const result = await ctx.service.apps.accountList();
    if (result) {
      ctx.body = {
        status: 200,
        data: result,
      };
    } else {
      ctx.body = {
        status: 500,
        message: '获取失败',
      };
    }
  }


}

module.exports = HomeController;
