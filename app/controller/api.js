'use strict';

const { Controller } = require('egg');

class ApiController extends Controller {

  async allApis() {
    const { ctx } = this;
    const { appKey } = ctx.query;
    try {
      const result = await ctx.service.api.allApis(appKey);
      if (result.success) {
        ctx.body = {
          status: 200,
          data: result.data,
        };
      } else {
        ctx.body = {
          status: 500,
          message: result.message,
        };
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        message: error.message,
      };
    }
  }
}

module.exports = ApiController;
