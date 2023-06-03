/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1683041344957_2018';

  // add your middleware config here
  config.middleware = [];


  config.view = {
    mapping: { '.html': 'ejs' }, // 左边写成.html后缀，会自动渲染.html文件
  };

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'admin12345',
      // 数据库名
      database: 'myapps',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.jwt = {
    secret: 'tinyblog20210502',
    enable: true, // 默认是关闭，如果开启，这会对所有请求进行自动校验；限定请求，请设置match做路径匹配
    match: /^\/api/, // 匹配的请求，会走jwt校验，否则忽略；例如登录接口需要被忽略；
    sign: {	// jwt.sign(***,***,[options,***])方法中，options的默认设置可以在这里配置；
      expiresIn: 10, // 多少s后过期。actionToken.js中,jwt.sing(plyload,secret,{expiresIn:number})会被合并，调用时设置优先级更高;
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
