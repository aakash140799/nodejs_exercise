var express = require('express');
var bodyParser = require('body-parser');
var Users = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyAdmin, function(req, res, next) {
  Users.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch((err) => next(err));
});


router.post('/signup', function(req, res, next) {
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



router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id:req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success:'true', token:token, 'status':'Login successful'});
});



router.get('/logout', function(req, res, next) {
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


module.exports = router;
