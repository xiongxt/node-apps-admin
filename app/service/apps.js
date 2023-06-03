const { Service } = require('egg');

class AppsService extends Service {

  async appLogin(appKey, username, password) {
    const userTableName = this.service.table.getDistTableName(appKey, 'user');
    try {
      const find = await this.app.mysql.get(userTableName, {
        username,
      });
      if (find) {
        if (find.password === password) {
          this.app.mysql.update(userTableName,
            { last_login: new Date() },
            {
              where: {
                id: find.id,
              },
            }
          );
          return { success: true, data: find };
        }
        return { success: false, message: '密码不正确' };
      }
      return { success: false, message: '用户名不存在' };
    } catch (error) {
      return {
        success: false, message: '查找失败',
      };
    }
  }

  async appList() {
    const { app } = this;
    try {
      const result = await app.mysql.select('apps', {
        // columns: [ 'id', 'app_key' ],
        orders: [[ 'last_update', 'desc' ]],
        // offset: 3,
        // limit: 3,
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

  async createApp(appKey, appName) {
    const { app } = this;
    try {
      const find = await app.mysql.get('apps', {
        app_key: appKey,
      });
      if (find) {
        return {
          success: false,
          message: 'appKey已经存在',
        };
      }
      const result = await app.mysql.insert('apps', {
        app_key: appKey,
        app_name: appName,
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

  async delApp(id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('apps', {
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


  async updateApps(rows = [{ rows: Object, where: Object }]) {
    const con = await this.app.mysql.beginTransaction();
    try {
      const result = await con.updateRows('apps', rows);
      con.commit();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      con.rollback();
      return {
        success: false,
        message: error.message,
      };
    }
  }
  // async createApp() {
  //   const { app, ctx } = this;
  //   try {
  //     await app.mysql.query(`CREATE TABLE apps (
  //       id int(11) unsigned zerofill NOT NULL AUTO_INCREMENT COMMENT 'id 自增 主键',
  //       username varchar(255) DEFAULT NULL COMMENT '用户名',
  //       phone varchar(255) DEFAULT NULL COMMENT '手机号',
  //       email varchar(255) DEFAULT NULL COMMENT '电子邮箱',
  //       password varchar(255) DEFAULT NULL COMMENT '密码',
  //       lastlogin datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次登录时间',
  //       PRIMARY KEY (id)
  //     ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);
  //     ctx.body = {
  //       status: 200,
  //       data: '创建成功',
  //     };
  //   } catch (error) {
  //     ctx.body = {
  //       status: 500,
  //       message: error.message,
  //     };
  //   }
  // }

}

module.exports = AppsService;
