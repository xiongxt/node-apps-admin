'use strict';

const { Controller } = require('egg');

class AppsController extends Controller {
  async createApp() {
    const { ctx } = this;
    const { appKey, appName } = ctx.query;
    try {
      const result = await ctx.service.apps.createApp(appKey, appName);
      if (result.success) {
        ctx.body = {
          status: 200,
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

  async appList() {
    const { ctx } = this;
    const result = await ctx.service.apps.appList();
    if (result) {
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
  }

  async delApp() {
    const { ctx } = this;
    const { id, appKey } = ctx.query;
    const result = await ctx.service.apps.delApp(id, appKey);
    if (result) {
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
  }


}

module.exports = AppsController;
