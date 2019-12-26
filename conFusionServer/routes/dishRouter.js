
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const Users = require('../models/users');


var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyAdmin, (req, res, next) => {
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
.put(authenticate.verifyAdmin, (req, res, next) => {
    res.statusMessage = 403;
    res.end("operation is not supported");
})
.delete(authenticate.verifyAdmin, (req, res, next) => {
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
.get((req, res, next) => {
    Dishes.find({_id:req.params.dishid})
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("Post operation not supported");
})
.put(authenticate.verifyAdmin, (req, res, next) => {
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
.delete(authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove({_id: req.params.dishid})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});


dishRouter.route('/:dishid/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }
        else{
            const err = new Error('Dish '+req.params.dishid+' not found');
            err.status = 404;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .populate('comments.author')
            .then((newdish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(newdish);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            const err = new Error('Dish '+req.params.dishid+' not found');
            err.status = 404;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation on '+req.params.dishid+'/comments not supported');
})
.delete(authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishid)
    .then((dish) => {
        if(dish != null){
            for(var i = dish.comments.length-1;i >= 0;i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((newdish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(newdish);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            const err = new Error('Dish '+req.params.dishid+' not found');
            err.status = 404;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


dishRouter.route('/:dishid/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if(dish == null){
            const err = new Error('Dish '+req.params.dishid+' not found');
            err.status = 404;
            next(err);
        }
        else {
            const err = new Error('Comment '+req.params.commentid+' not found on dish '+req.params.dishid);
            err.status = 404;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Post operation not supported on dish "+req.params.dishid+'/ '+req.params.commentId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    
    Dishes.findById(req.params.dishid)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){
            if(dish.comments.id(req.params.commentId).author != req.user._id){
                var err = new Error('You are not authorized!');
                err.status = 403;
                next(err);
            }
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .populate('comments.author')
            .then((newDish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(newDish);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else if(dish == null){
            const err = new Error('Dish '+req.params.dishid+' not found');
            err.status = 404;
            next(err);
        }
        else {
            const err = new Error('Comment '+req.params.commentid+' not found on dish '+req.params.dishid);
            err.status = 404;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishid)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){
            if(dish.comments.id(req.params.commentId).author != req.user._id){
                var err = new Error('You are not authorized!');
                err.status = 403;
                next(err);
            }
            dish.comments.id(req.params.commentId).remove();
            dish.save((newdish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(newdish);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else if(dish == null){
            const err = new Error('Dish '+req.params.dishid+' not found');
            err.status = 404;
            next(err);
        }
        else {
            const err = new Error('Comment '+req.params.commentid+' not found on dish '+req.params.dishid);
            err.status = 404;
            next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = dishRouter;