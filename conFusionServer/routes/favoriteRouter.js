
const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userid: req.user._id})
    .then((favorites) => {
        if(!favorites){
            Favorites.create({userid: req.user._id})
            .catch((err) => next(err));
        }
    })
    
    Favorites.findOne({userid: req.user._id})
    .populate('favorites.dishid')
    .populate('userid')
    .then((favorites) => {
        console.log(favorites);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userid: req.user._id})
    .then((favorites) => {
        if(!favorites){
            Favorites.create({userid: req.user._id})
            .catch((err) => next(err));
        }
    })

    Favorites.findOne({userid: req.user._id})
    .then((favorites) => {
        for(var i = 0;i < req.body.length;i++){
            if(favorites.favorites.find((favorite) => {
                if(favorite.dishid == req.body[i].dishid){return true;}
                return false;
            }) == null){
                favorites.favorites.push({dishid: req.body[i].dishid});
            }
        }
        favorites.save()
        .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported on /favorites")
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userid: req.user._id})
    .then((favorites) => {
        if(!favorites){
            Favorites.create({userid: req.user._id})
            .catch((err) => next(err));
        }
    })

    Favorites.findOne({userid: req.user._id})
    .then((favorites) => {
        console.log(favorites);
        for(var i = favorites.favorites.length-1;i >= 0;i--){
            favorites.favorites.id(favorites.favorites[i]._id).remove();
        }
        favorites.save()
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});


favoriteRouter.route('/:dishid')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userid:req.user._id})
    .then((favorites) => {
        if(!favorites){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({exits:false, favorites:favorites});
        }
        else{
            if(favorites.favorites.dishid.indexOf(req.params.dishid) < 0){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({exits:false, favorites:favorites});
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({exits:true, favorites:favorites});
            }
        }
    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userid: req.user._id})
    .then((favorites) => {
        if(!favorites){
            Favorites.create({userid: req.user._id})
            .catch((err) => next(err));
        }
    })

    Favorites.findOne({userid: req.user._id})
    .then((favorites) => {
        if(favorites.favorites.find((favorite) => {
            return favorite.dishid == req.params.dishid;
        }) == null){
            favorites.favorites.push({dishid: req.params.dishid});
        }

        favorites.save()
        .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put Operation not supported on /favorites/'+req.params.dishid);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userid: req.user._id})
    .then((favorites) => {
        if(!favorites){
            Favorites.create({userid: req.user._id})
            .catch((err) => next(err));
        }
    })

    Favorites.findOne({userid: req.user._id})
    .then((favorites) => {
        favorite = favorites.favorites.find((favorite) => {
            return favorite.dishid == req.params.dishid;
        });

        if(favorite){favorite.remove();}
        favorites.save()
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
})

module.exports = favoriteRouter;