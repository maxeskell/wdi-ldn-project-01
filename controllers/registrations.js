const User = require('../models/user');

function newRoute(req, res) {
  return res.render('registrations/new');
}

function createRoute(req, res, next) {

  User
    .create(req.body)
    .then(() => res.redirect('/login'))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest('/register', err.toString());
      next(err);
    });
}

function showRoute(req, res) {
  return res.render('registrations/show');
}

function deleteRoute(req, res, next) {
  req.user
    .remove()
    .then(() => {
      req.session.regenerate(() => res.unauthorized('/', 'Your account has been deleted'));
    })
    .catch(next);
}

function editRoute(req, res) {
  return res.render('registrations/edit');
}

function updateRoute(req, res) {

  for (const field in req.body) {
    req.user[field] = req.body[field];
  }

  return req.user.save()
    .then(() => {
      res.redirect('/profile');
    })
    .catch(err => {
      res.status(500).render('/statics/500', {
        error: err
      });
    });
}


module.exports = {
  new: newRoute,
  show: showRoute,
  create: createRoute,
  delete: deleteRoute,
  edit: editRoute,
  update: updateRoute
};
