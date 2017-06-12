const User = require('../models/user');

function authentication(req, res, next) {
  if(!req.session.isAuthenticated) return next();

  User
    .findById(req.session.userId)
    .then((user) => {
      if(!user) return req.session.regenerate(() => res.unauthorized());

      req.session.userId = user.id;

      //add the whole user model to the req object
      req.user = user;

      res.locals.user = user;
      res.locals.isAuthenticated = true;

      next();
    })
    .catch(next);
}

module.exports = authentication;
