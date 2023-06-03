const { Service } = require('egg');

class UserService extends Service {

  async login(username, password) {
    const { app } = this;
    try {
      const find = await app.mysql.get('account', {
        username,
      });
      if (find) {
        if (find.password === password) {
          app.mysql.update('account', { last_login: new Date() }, { where: {
            id: find.id,
          } });
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
}

module.exports = UserService;
