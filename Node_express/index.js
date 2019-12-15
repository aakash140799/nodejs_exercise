
const http = require('http');
const express = require('express');
const path = require('path');
const morgan = require('morgan');

hostname = 'localhost';
port = 8080;

const app = express();
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end("Hello world");
})

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`listening on ${hostname}:${port}`);
});
