
const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.all((req, res, next) => {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    next();
})
.get((req, res, next) => {
    res.end("will send all promotions");
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end("post operation not supported");
})
.put((req, res, next) => {
    res.end("will update promotionss with"+req.body.name+req.body.description);
})
.delete((req, res, next) => {
    res.end("deleting all promotions");
});

promoRouter.route('/:promoid')
.all((req, res, next) =>{
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    next();
})
.get((req, res, next) => {
    res.end("will send promotions:"+req.params.promoid);
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end("post operation not supported");
})
.put((req, res, next) => {
    res.end("will update promotion:"+req.params.promoid+" with"+req.body.name+req.body.description);
})
.delete((req, res, next) => {
    res.end("deleting promotion: "+req.params.promoid);
});

module.exports = promoRouter;