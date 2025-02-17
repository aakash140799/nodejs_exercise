
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comments = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors');

var commentsRouter = express.Router();
commentsRouter.use(bodyParser.json());

commentsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Comments.find(req.query)
    .populate('author')
    .then((comments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(comments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if(req.body != null){
        req.body.author = req.user._id;
        Comments.create(req.body)
        .then((comment) => {
            Comments.findById(comment._id)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish.comments);
            }, (err) => next(err))
        })
        .catch((err) => next(err));
    }
    else{
        const err = new Error('no comment found on request body');
        err.status = 404;
        next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation on /comments not supported');
})
.delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    Comments.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        return res.json(resp);        
    }, (err) => next(err))
    .catch((err) => next(err));
});


commentsRouter.route('/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Comments.findById(req.params.commentId)
    .populate('author')
    .then((comment) => {
        if(comment != null){
            Comments.findById(comment._id)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(comment);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            const err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`Post operation not supported on /comments/${req.params.commentId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
    .then((comment) => {
        if(comment != null){
            if(comment.author != req.user._id){
                var err = new Error('You are not authorized!');
                err.status = 403;
                next(err);
            }
            req.body.author = req.user._id;
            Comments.findByIdAndUpdate(req.params.commentId, {
                $set: req.body
            }, { new : true})
            .then((comment) => {
                Comments.findById(Comment._id)
                .populate('author')
                .then((comment) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(comment);
                }, (err) => next(err))
                .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            const err = new Error(`Comment ${req.params.commentid} not found`);
            err.status = 404;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
    .then((comment) => {
        if(comment != null){
            if(comment.author != req.user._id){
                var err = new Error('You are not authorized!');
                err.status = 403;
                next(err);
            }
            Comments.findByIdAndRemove(comment._id)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            const err = new Error(`Comment ${req.params.commentid} not found`);
            err.status = 404;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = commentsRouter;