const { Service } = require('egg');

class TableService extends Service {

  getDistTableName(appKey, tableName) {
    return `${appKey}_${tableName}`.toLocaleLowerCase();
  }

  async createAccountTable(appKey) {
    return this.createTable(appKey, 'account', '用户表', [
      {
        name: 'username',
        type: 'varchar',
        length: '255',
        comment: '用户名',
      },
      {
        name: 'phone',
        type: 'varchar',
        length: '255',
        comment: '手机号',
      },
      {
        name: 'email',
        type: 'varchar',
        length: '255',
        comment: '邮箱',
      },
      {
        name: 'password',
        type: 'varchar',
        length: '255',
        comment: '密码',
      },
    ]);
  }

  async createTable(appKey, tableName, desc, columns) {
    const { app } = this;
    const con = await app.mysql.beginTransaction();
    try {
      const foundApp = await con.get('apps', {
        app_key: appKey,
      });

      const foundTable = await con.get('tables', {
        table_name: tableName,
        app_key: appKey,
      });

      if (foundTable) {
        await con.rollback();
        return {
          success: false,
          message: `${tableName}已经存在`,
        };
      }

      if (foundApp) {
        const distTableName = this.getDistTableName(appKey, tableName);
        await con.insert('tables', {
          app_id: foundApp.id,
          app_key: appKey,
          table_name: tableName.toLocaleLowerCase(),
          dist_table_name: distTableName,
          columns: JSON.stringify(columns),
          desc,
          last_update: new Date(),
        });

        const columnsStr = columns.map(col => {
          return `${col.name} ${col.type}(${col.length}) DEFAULT NULL COMMENT '${col.comment}',`;
        }).join('');

        await con.query(`CREATE TABLE ${distTableName} (
            id int(11) unsigned zerofill NOT NULL AUTO_INCREMENT COMMENT 'id 自增 主键',
            ${columnsStr}
            last_update datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次登录时间',
            PRIMARY KEY (id)
          ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);

        await con.commit();
        return {
          success: true,
        };
      }

      await con.rollback();
      return {
        success: false,
        message: 'appKey不存在',
      };

    } catch (error) {
      await con.rollback();
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async delTable(id) {
    const { app } = this;
    const con = await app.mysql.beginTransaction();

    try {
      const tables = await con.select('tables', {
        where: {
          id,
        },
      });

      const foundTable = tables[0];

      if (foundTable) {
        const distTableName = foundTable.dist_table_name;
        await con.delete('tables', {
          id,
        });
        await con.query(`drop table ${distTableName}`);
        await con.commit();
        return {
          success: true,
        };
      }

      await con.rollback();
      return {
        success: false,
        message: 'table不存在',
      };


    } catch (error) {
      await con.rollback();
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async allTables(appKey) {
    const { app } = this;
    try {
      const result = await app.mysql.select('tables', {
        where: {
          app_key: appKey,
        },
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

  async queryTableDataList(tableName, selectOption = {}) {
    selectOption = Object.assign({
      where: {},
      orders: [[ 'last_update', 'desc' ]],
      offset: 0,
      limit: 10,
    }, selectOption);
    try {
      const count = await this.app.mysql.count(tableName);
      const result = await this.app.mysql.select(tableName, selectOption);
      return {
        success: true,
        data: result,
        count,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }


  async delTableData(tableName, where = {}) {
    try {
      const result = await this.app.mysql.delete(tableName, where);
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

  async addTableData(tableName, rows = []) {
    rows.forEach(it => {
      it.last_update = new Date();
    });
    const con = await this.app.mysql.beginTransaction();
    try {
      const result = await con.insert(tableName, rows);
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

  async updateTableData(tableName, rows = [{ row: Object, where: Object }]) {
    const con = await this.app.mysql.beginTransaction();
    rows.forEach(it => {
      it.last_update = new Date();
    });
    try {
      const result = await con.updateRows(tableName, rows);
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

}

module.exports = TableService;
