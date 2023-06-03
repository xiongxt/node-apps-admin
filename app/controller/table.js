'use strict';

const { Controller } = require('egg');

class TableController extends Controller {

  async createTable() {
    const { ctx } = this;

    const { appKey, tableName, desc, columns } = ctx.request.body;

    try {
      const result = await ctx.service.table.createTable(appKey, tableName, desc, columns);
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


  async createAccountTable() {
    const { ctx } = this;

    const { appKey } = ctx.request.body;

    try {
      const result = await ctx.service.table.createAccountTable(appKey);
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

  async delTable() {
    const { ctx } = this;
    const { id } = ctx.request.body;

    try {
      const result = await ctx.service.table.delTable(id);
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

  async allTables() {
    const { ctx } = this;

    const { appKey } = ctx.request.body;

    try {
      const result = await ctx.service.table.allTables(appKey);
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

  async queryTableDataList() {
    const { ctx } = this;


    const { tableName } = ctx.query;
    let { current, pageSize } = ctx.query;

    current = parseInt(current);
    pageSize = parseInt(pageSize);

    try {
      const result = await ctx.service.table.queryTableDataList(tableName, {
        offset: pageSize * (current - 1),
        limit: pageSize,
      });
      if (result.success) {
        ctx.body = {
          status: 200,
          data: {
            list: result.data,
            total: result.count,
          },
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

  async delTableData() {
    const { ctx } = this;
    const { id, tableName } = ctx.request.body;

    try {
      const result = await ctx.service.table.delTableData(tableName, { id });
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

  async insertTableData() {
    const { ctx } = this;
    const { tableName, data } = ctx.request.body;

    try {
      const result = await ctx.service.table.addTableData(tableName, [ data ]);
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

  async updateTableData() {
    const { ctx } = this;
    const { tableName, id, data } = ctx.request.body;

    try {
      const result = await ctx.service.table.updateTableData(tableName, [{ row: data, where: { id } }]);
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


}

module.exports = TableController;
