const express = require('express');
const { resolve } = require('path');

const server = express();
server.get('/home', function (req, res) {
  res.send('Hello World!');
});
server.post('/home', function (req, res) {
  res.send('Got a POST request');
});
server.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});
server.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user');
});
server.all('/secret', function (req, res, next) {
  res.send('Got a  request at /secret');
});
server.get('/ab?cd', function (req, res) {
  res.send('ab?cd');
});
server.get('/plantae/:genus.:species', function (req, res) {
  res.send(req.params);
});
server.get('/flights/:from-:to', function (req, res) {
  res.send(req.params);
});

server.get('/user/:userId(\\d+)', function (req, res) {
  res.send(req.params);
});
server.get('/example/a', function (req, res) {
  res.send('Hello from A!')
})
server.get(
  '/example/b',
  function (req, res, next) {
    console.log('the response will be sent by the next function ...');
    next();
  },
  function (req, res) {
    res.send('Hello from B!');
  },
);
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}

server.get('/example/c', [cb0, cb1, cb2])
const port = parseInt(process.env.PORT || '8080');
const publicDir = resolve('public');
server.use(express.static(publicDir));
server.listen(port, () => console.log(`Listening on port ${port}`));
