var express = require('express');
var bodyParser = require('body-parser');
var Users = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');


var router = express.Router();
router.use(bodyParser.json());


router.options('*', cors.corsWithOptions, (req, res) => res.sendStatus(200))
/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyAdmin, function(req, res, next) {
  Users.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch((err) => next(err));
});


router.post('/signup', cors.corsWithOptions, function(req, res, next) {
  Users.register(new Users({username: req.body.username,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname }), req.body.password, (err, user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({success:'true', status:'Registration successful'});
      });
    }
  });
});



router.post('/login', cors.corsWithOptions,  (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err){
      next(err);
    }
    if(!user){
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      return res.json({success:'false', status:'Login Unsuccessful', err:info});
    }
    req.logIn(user, (err) => {
      if(err){
          next(err);
      }
      else{
        var token = authenticate.getToken(user);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({success:'true', token:token, status:'Login successful'});
      }
    });
  })(req, res, next);
});



router.get('/logout', cors.corsWithOptions, function(req, res, next) {
  if(!req.user){
    const err = new Error('You are already logged out');
    err.status = 403;
    next(err);
  }
  else{/*
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are logged out successfully');
    res.redirect('/');*/
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if(req.user){
    var token = authenticate.getToken({_id:req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token:token, status: 'Login Successful'});
  }
});


router.get('/checkJWT', (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if(err){
      next(err);
    }
    else{
      if(!user){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful', err:info});
      }
      else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Login Successful', user:user});
      }
    }
  });
});

module.exports = router;
