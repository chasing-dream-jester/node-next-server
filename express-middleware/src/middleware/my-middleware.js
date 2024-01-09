// 创建可配置的中间件
function configurableMiddleware(config) {
  // 返回实际的中间件处理函数
  return function (req, res, next) {
    // 使用配置对象中的参数来决定中间件的行为
    if (config.enableLogging) {
      req.logger = `[${new Date()}] Request received for ${req.method} ${
        req.url
      }`;
    }

    if (config.authorizationRequired && !req.user) {
      return res.status(401).send('Unauthorized');
    }

    // 继续请求处理链
    next();
  };
}

module.exports = configurableMiddleware;
