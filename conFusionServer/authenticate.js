
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var facebookTokenStrategy = require('passport-facebook-token');
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

// attach facebook authentication strategy
module.exports.facebookPassport = passport.use(new facebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    },(accesstoken, refreshtoken, profile, done) => {
        Users.findOne({facebookId: profile.id}, (err, user) => {
            if(err){
                done(err, false);
            }
            if(!err && user !== null){
                done(null, user)
            }
            else{
                user = new Users({ username: profile.displayName});
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if(err){
                        return done(err, false);
                    }
                    else{
                        return done(null, user);
                    }
                });
            }
        });
    }
));




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
