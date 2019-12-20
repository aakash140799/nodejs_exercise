var express = require('express');
var bodyParser = require('body-parser');
var Users = require('../models/users');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  username = req.body.username;
  Users.findOne({username:username})
  .then((user) => {
    if(user == null){
      Users.create(req.body)
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end(`User ${username} created`);
      })
      .catch((err) => next(err));
    }
    else{
      const err = new Error(`Username ${username} already exists`);
      err.status = 403;
      next(err);
    }
  })
  .catch((err) => next(err));
});


router.post('/login', function(req, res, next) {
  if(req.session.user){
    if(req.session.user === 'Authenticated'){
      const err = new Error(`You are already authenticated`);
      err.status = 403;
      next(err);
    }
    else{
      const err = new Error(`Incorrect Authentication`);
      err.status = 401;
      res.setHeader('WWW-Authenticate','Basic');
      next(err);
    }
  }

  else if(req.headers.authorization){
      var auth = new Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');
      const username = auth[0];
      const password = auth[1];

      Users.findOne({username:username})
      .then((user) => {
        if(user == null){
          const err = new Error(`Username ${username} does not exists`);
          err.status = 401;
          res.setHeader('WWW-Authenticate','Basic');
          next(err);
        }
        else if(user.password != password){
          const err = new Error('incorrect authentication');
          err.status = 401;
          res.setHeader('WWW-Authenticate','Basic');
          next(err);
        }
        else if(username === user.username && password === user.password){
          req.session.user = 'Authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type','text/plain');
          res.end('You are authenticated successfully');
          res.redirect('/');
        }
      })
      .catch((err) => next(err));
  }

  else {
    const err = new Error('incorrect authentication');
    err.status = 401;
    res.setHeader('WWW-Authenticate','Basic');

    next(err);
  }

});


router.get('/logout', function(req, res, next) {
  if(!req.session.user){
    const err = new Error('You are already logged out');
    err.status = 403;
    next(err);
  }
  else{
    req.session.destroy();
    res.clearCookie('user');
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are logged out successfully');
    res.redirect('/');
  }
});


module.exports = router;
