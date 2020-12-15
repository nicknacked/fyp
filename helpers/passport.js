const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('../config/config');

module.exports = function() {
  passport.use(new FacebookTokenStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret
  },
  function(accessToken, refreshToken, profile, done) {
    const user = {accessToken, profile, refreshToken};
    return done(null, user);
  }));
};