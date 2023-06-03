module.exports = options => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.token;
    if (token) {
      try {
        // 解码token
        ctx.app.jwt.verify(token, options.secret);
        await next();
      } catch (error) {
        ctx.body = {
          message: 'token已过期，请重新登录',
          status: 401,
        };
        return;
      }
    } else {
      ctx.body = {
        message: 'token不存在',
        status: 401,
      };
    }
  };
};

