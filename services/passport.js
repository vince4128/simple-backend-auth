const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Strategy = a method to authenticate a user
// Strategy1 verify JWT // Strategy2 with a usernaùe and password

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

    // payload sub and iat of the token
    // See if the user ID in the payload exists in our database
    // if it does, call 'done' with that
    // otherwise, call done without a user object
    User.findById(payload.sub, function(err,user){
        if(err) {
            return done(err, false);
        }

        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });

});

// Tell passport to use this strategy
passport.use(jwtLogin);