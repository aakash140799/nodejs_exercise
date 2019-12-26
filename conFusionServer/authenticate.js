
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');



// attach local athentication strategy
var Users = require('./models/users');
module.exports.localPassport = passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());



// attach jwt athentication strategy
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
module.exports.jwtPassport = passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
    Users.findById(jwt_payload._id, (err, user) => {
        if(err){
            done(err, false);
        }
        else if(user){
            done(null, user);
        }
        else{
            done(null, false);
        }
    });
}));


module.exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
}

module.exports.verifyUser = passport.authenticate('jwt', {session: false});
module.exports.verifyAdmin = function(req, res, next) {
    passport.authenticate('jwt',{session: false}, (err, user) => {
        if(err){next(err);}
        else if(!user){
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
        else{
            next();
        }
    })(req, res, next);
}
