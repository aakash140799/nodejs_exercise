
const express = require('express');
const bodyParser = require('body-parser');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    next();
})
.get((req, res, next) => {
    res.end("sending all dishes");
})
.post((req, res, next) => {
    res.end("creating new dish "+req.body.name+","+req.body.description);
})
.put((req, res, next) => {
    res.statusMessage = 403;
    res.end("operation is not supported");
})
.delete((req, res, next) => {
    res.end("deleting all dishes");
});

dishRouter.route('/:dishid')
.all((req, res, next) => {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    next();
})
.get((req, res, next) => {
    res.end("sending  dish: "+req.params.dishid);
})
.post((req, res, next) => {
    res.end("creating new dish "+req.body.name+","+req.body.description+","+req.params.dishid);
})
.put((req, res, next) => {
    res.statusMessage = 403;
    res.end("operation is not supported");
})
.delete((req, res, next) => {
    res.end("deleting dish "+req.params.dishid);
});
module.exports = dishRouter;