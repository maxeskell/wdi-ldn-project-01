const rp = require('request-promise');
const config = require('../config/oauth');
const User = require('../models/user');

function github(req, res, next) {
  return rp({
    method: 'POST',
    url: config.github.accessTokenURL,
    qs: {
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      code: req.query.code
    },
    json: true
  })
  .then((token) => {
    return rp({
      method: 'GET',
      url: config.github.profileURL,
      qs: token,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise'
      }
    });
  })
  .then((profile) => {
    return User
      .findOne({ $or: [{ githubId: profile.id }, { email: profile.email }] })
      .then((user) => {
        if(!user) {
          user = new User({
            username: profile.login,
            email: profile.email,
            image: profile.avatar_url
          });
        }

        user.githubId = profile.id;
        return user.save();
      });
  })
  .then((user) => {
    req.session.userId = user.id;
    req.session.isAuthenticated = true;

    req.flash('info', `Welcome back, ${user.username}!`);
    res.redirect('/profile');
  })
  .catch(next);
}

function facebook(req, res, next) {
  return rp({
    method: 'GET',
    url: config.facebook.accessTokenURL,
    qs: {
      client_id: config.facebook.clientId,
      redirect_uri: config.facebook.redirectURL,
      client_secret: config.facebook.clientSecret,
      code: req.query.code
    },
    json: true
  })
  .then((token) => {
    return rp({
      method: 'GET',
      url: 'https://graph.facebook.com/v2.5/me?fields=id,name,email,picture.height(961)',
      qs: token,
      json: true

    });
  })
  .then((profile) => {
    return User
      .findOne({ $or: [{ facebookId: profile.id }, { email: profile.email }] })
      .then((user) => {
        if(!user) {
          user = new User({
            username: profile.name,
            email: profile.email,
            image: profile.picture.data.url
          });
        }
        console.log(profile);

        user.facebookId = profile.id;
        return user.save();
      });
  })
  .then((user) => {
    console.log('*******', user);
    req.session.userId = user.id;
    req.session.isAuthenticated = true;

    req.flash('info', `Welcome back, ${user.username}!`);
    res.redirect('/profile');
  })
  .catch(next);
}

module.exports = {
  github, facebook
};
