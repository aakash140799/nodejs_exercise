var express = require('express');
var bodyParser = require('body-parser');
var Users = require('../models/users');
var passport = require('passport');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  Users.register(new Users({username: req.body.username}), req.body.password, (err, user) => {
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
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success:'true', 'status':'Login successful'});
});


router.get('/logout', function(req, res, next) {
  if(!req.user){
    const err = new Error('You are already logged out');
    err.status = 403;
    next(err);
  }
  else{
    req.session.destroy();
    res.clearCookie('session_id');
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are logged out successfully');
    res.redirect('/');
  }
});


module.exports = router;
