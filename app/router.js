'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;

  const jwtErr = middleware.jwtErr(app.config.jwt);

  router.post('/login', controller.home.login);

  router.get('/appList', jwtErr, controller.apps.appList);
  router.post('/delApp', jwtErr, controller.apps.delApp);
  router.post('/createApp', jwtErr, controller.apps.createApp);

  router.post('/allTables', jwtErr, controller.table.allTables);
  router.post('/createTable', jwtErr, controller.table.createTable);
  router.post('/createAccountTable', jwtErr, controller.table.createAccountTable);
  router.delete('/delTable', jwtErr, controller.table.delTable);

  router.get('/table/detail', jwtErr, controller.table.queryTableDataList);
  router.delete('/table/detail/delItem', jwtErr, controller.table.delTableData);
  router.post('/table/detail/insertItem', jwtErr, controller.table.insertTableData);
  router.post('/table/detail/updateItem', jwtErr, controller.table.updateTableData);


  router.get('/allApis', jwtErr, controller.api.allApis);

};
