const express = require('express');
const { resolve } = require('path');
const server = express();
const configurableMiddleware = require('./middleware/my-middleware');

// 配置中间件
const middlewareConfig = {
  enableLogging: true,
  authorizationRequired: false,
};

const requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};
// 设置 EJS 模板引擎
server.set('view engine', 'ejs');
server.set('views', __dirname + '/views');

server.use(requestTime);

// 使用中间件
server.use(configurableMiddleware(middlewareConfig));

server.get('/home', function (req, res) {
  res.json({
    data: 'Hello World!',
    t: req.requestTime,
    logger: req.logger,
  });
});

server.use('/example/a', function (req, res, next) {
  console.log('Request Type:', req.method);
  res.send('/example/a');
});
server.get('/example/b', function (req, res, next) {
  res.send('/example/b');
});
server.use(
  '/stack',
  function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
  },
  function (req, res, next) {
    console.log('Request Type:', req.method);
    res.send(req.method);
  },
);
server.get(
  '/example/c',
  function (req, res, next) {
    console.log('ID:', req.params.id);
    next();
  },
  function (req, res, next) {
    req.requestTime = Date.now();
    next();
  },
);

server.get('/example/c', function (req, res, next) {
  res.json({
    url: req.url,
    t: req.requestTime,
  });
});

server.get(
  '/user/:id',
  function (req, res, next) {
    // 当id为0时我们将控制权传递给下一个路由
    if (req.params.id === '0') next('route');
    else next();
  },
  function (req, res, next) {
    res.send('regular');
  },
);

server.get('/user/:id', function (req, res, next) {
  res.send('special');
});

function logOriginalUrl(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}

function logMethod(req, res, next) {
  console.log('Request Type:', req.method);
  next();
}

const logStuff = [logOriginalUrl, logMethod];
server.get('/log', logStuff, function (req, res, next) {
  res.send('log Info');
});

server.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// 定义一个简单的路由
server.get('/template', (req, res) => {
  const data = {
    title: 'EJS Demo',
    message: 'Hello, EJS!'
  };
  // 渲染 EJS 模板并将数据传递给模板
  res.render('index', data);
});

const port = parseInt(process.env.PORT || '8080');
const publicDir = resolve('public');
server.use(express.static(publicDir));
server.listen(port, () => console.log(`Listening on port ${port}`));
