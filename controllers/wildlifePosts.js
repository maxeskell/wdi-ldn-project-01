const wildlifePosts = require('../models/wildlifePost');

function wildlifePostsIndex(req, res) {
  wildlifePosts
    .find()
    .exec()
    .then(wildlifePosts => {
      res.render('wildlifePosts/index', { wildlifePosts });
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

function wildlifePostsNew(req, res) {
  res.render('wildlifePosts/new');
}

function wildlifePostsShow(req, res) {
  wildlifePosts
    .findById(req.params.id)
    .exec()
    .then(wildlifePost => {
      if (!wildlifePost) return res.status(404).render('error', { error: 'No wildlifePost found.'});
      res.render('wildlifePosts/show', { wildlifePost });
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

function wildlifePostsCreate(req, res) {
  wildlifePosts
    .create(req.body)
    .then(() => {
      res.redirect('/wildlifePosts');
    });
}

function wildlifePostsEdit(req, res)  {
  wildlifePosts
    .findById(req.params.id)
    .exec()
    .then(wildlifePost => {
      if (!wildlifePost) return res.status(404).render('error', { error: 'No wildlifePost found.'});
      res.render('wildlifePosts/edit', { wildlifePost });
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

function wildlifePostsUpdate(req, res) {
  wildlifePosts
    .findById(req.params.id)
    .exec()
    .then(wildlifePost => {
      if (!wildlifePost) return res.status(404).render('error', { error: 'No wildlifePost found.'});

      for(const field in req.body) {
        wildlifePost[field] = req.body[field];
      }
      return wildlifePost.save();
    })
    .then(wildlifePost => {
      res.redirect(`/wildlifePosts/${wildlifePost.id}`);
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

function wildlifePostsDelete(req, res) {
  wildlifePosts
    .findById(req.params.id)
    .exec()
    .then(wildlifePost => {
      if (!wildlifePost) return res.status(404).render('error', { error: 'No wildlifePost found.'});
      return wildlifePost.remove();
    })
    .then(() => {
      res.redirect('/wildlifePosts');
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

module.exports = {
  index: wildlifePostsIndex,
  new: wildlifePostsNew,
  show: wildlifePostsShow,
  create: wildlifePostsCreate,
  edit: wildlifePostsEdit,
  update: wildlifePostsUpdate,
  delete: wildlifePostsDelete
};
