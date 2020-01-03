
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const Users = require('../models/users');
const cors = require('./cors');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    req.body.author = req.user._id;
    Dishes.create(req.body)
    //.populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    res.statusMessage = 403;
    res.end("operation is not supported");
})
.delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.remove({})
    .then((dishes) => {
        console.log('deleting dishes', dishes);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishid')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Dishes.find({_id:req.params.dishid})
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("Post operation not supported");
})
.put(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate({_id: req.params.dishid}, {
        $set: req.body
    }, {new: true})
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove({_id: req.params.dishid})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = dishRouter;