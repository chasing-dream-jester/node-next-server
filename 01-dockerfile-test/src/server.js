const express = require('express');
const { resolve } = require('path');
const server = express();
const port = parseInt(process.env.PORT || '8080');
const publicDir = resolve('public');
server.use(express.static(publicDir));
server.listen(port, () => console.log(`Listening on port ${port}`));