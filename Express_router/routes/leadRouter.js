
const express = require('express');
const bodyParser = require('body-parser');

const leadRouter = express.Router();
leadRouter.use(bodyParser.json());
leadRouter.route('/')
.all((req, res, next) => {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    next();
})
.get((req, res, next) => {
    res.end("will send all leader");
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end("post operation not supported");
})
.put((req, res, next) => {
    res.end("will update leader "+req.body.name+","+req.body.description);
})
.delete((req, res, next) => {
    res.end("deleting all leaders");
});


leadRouter.route('/:leadid')
.all((req, res, next) => {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    next();
})
.get((req, res, next) => {
    res.end("will send details of leader:" +req.params.leadid);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end("post operation not supported");
})
.put((req, res, next) => {
    res.end("will update leader on: "+req.params.leadid+req.body.name+","+req.body.description);
})
.delete((req, res, next) => {
    res.end("deleting leader: "+req.params.leadid);
});

module.exports = leadRouter;