
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const dishRouter = require('./routes/dishRouter');
const leadRouter = require('./routes/leadRouter');
const promoRouter = require('./routes/promoRouter');

hostname = 'localhost';
port = 8080;

const app = express();
app.use(morgan('dev'));
app.use('/dishes', dishRouter);
app.use('/leader', leadRouter);
app.use('/promotion', promoRouter);
app.use((req, res, next) => {
    res.setHeader('Content-Type','text/html');
    res.statusCode = 200;
    res.end("Hello World");
    console.log(req.body);
});

const server = http.createServer(app);
server.listen(port, hostname, ()=>{
    console.log(`listening on ${hostname}:${port}`);
});

