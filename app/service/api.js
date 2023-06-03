const { Service } = require('egg');
const template = require('art-template');


class ApiService extends Service {

  async createApi(apiData) {
    try {
      const found = await this.app.mysql.get('apis', {
        app_key: apiData.appKey,
        path: apiData.path,
      });
      if (found) {
        return {
          success: false,
          message: 'path已经存在',
        };
      }
      const result = await this.app.mysql.insert('apis', {
        app_key: apiData.appKey,
        sql: apiData.sql,
        path: apiData.path,
        default_param: apiData.defaultParam,
        last_update: new Date(),
      });
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async delApi(id) {
    try {
      const result = await this.app.mysql.delete('apis', {
        id,
      });
      if (result.affectedRows > 0) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        message: '删除失败',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async executeApi(appKey, path, params) {
    try {
      const found = await this.app.mysql.get('apis', {
        app_key: appKey,
        path,
      });
      if (found) {
        const result = await this.app.mysql.query(template.render(found.sql, params));
        return {
          success: true,
          data: result,
        };
      }
      return {
        success: false,
        message: 'api不存在',
      };

    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async allApis(appKey) {
    const { app } = this;
    try {
      const result = await app.mysql.select('apis', {
        where: { app_key: appKey },
        orders: [[ 'last_update', 'desc' ]],
      });
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = ApiService;
