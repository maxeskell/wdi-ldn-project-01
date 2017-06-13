const WildlifePosts = require('../models/wildlifePost');

function wildlifePostsIndex(req, res) {
  WildlifePosts
    .find()
    .populate('createdBy')
    .exec()
    .then(wildlifePosts => {
      res.render('wildlifePosts/index', { wildlifePosts });
    })
    .catch(err => {
      res.status(500).render('/statics/500', { error: err });
    });
}

function wildlifePostsNew(req, res) {
  res.render('wildlifePosts/new');
}

//map
function wildlifePostsMap(req, res) {
  WildlifePosts
    .find()
    .populate('createdBy')
    .exec()
    .then(wildlifePosts => {
      res.render('wildlifePosts/map', { wildlifePosts });
    })
    .catch(err => {
      res.status(500).render('/statics/500', { error: err });
    });
}

function wildlifePostsShow(req, res) {
  WildlifePosts
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then(wildlifePost => {
      if (!wildlifePost) return res.status(404).render('/statics/404', { error: 'No wildlifePost found.'});
      res.render('wildlifePosts/show', { wildlifePost });
    })
    .catch(err => {
      res.status(500).render('/statics/500', { error: err });
    });
}

function wildlifePostsCreate(req, res) {

  if(req.file) req.body.image = req.file.key;
  req.body.createdBy = req.user;

  WildlifePosts
    .create(req.body)
    .then(() => res.redirect('/wildlifePosts'))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/wildlifePosts/new`, err.toString());
    });
}

function wildlifePostsEdit(req, res)  {
  WildlifePosts
    .findById(req.params.id)
    .exec()
    .then(wildlifePost => {
      if(!wildlifePost) return res.redirect();
      if(!wildlifePost.belongsTo(req.user)) return res.unauthorized(`/wildlifePosts/${wildlifePost.id}`, 'You do not have permission to edit that resource');
      return res.render('wildlifePosts/edit', { wildlifePost });
    })
    .catch(err => {
      res.status(500).render('/statics/500', { error: err });
    });
}

function wildlifePostsUpdate(req, res) {
  WildlifePosts
    .findById(req.params.id)
    .exec()
    .then(wildlifePost => {
      if (!wildlifePost) return res.status(404).render('/statics/404', { error: 'No wildlifePost found.'});

      for(const field in req.body) {
        wildlifePost[field] = req.body[field];
      }
      return wildlifePost.save();
    })
    .then(wildlifePost => {
      res.redirect(`/wildlifePosts/${wildlifePost.id}`);
    })
    .catch(err => {
      res.status(500).render('/statics/500', { error: err });
    });
}

function wildlifePostsDelete(req, res) {
  WildlifePosts
    .findById(req.params.id)
    .exec()
    .then(wildlifePost => {
      if (!wildlifePost) return res.status(404).render('/statics/404', { error: 'No wildlifePost found.'});
      return wildlifePost.remove();
    })
    .then(() => {
      res.redirect('/wildlifePosts');
    })
    .catch(err => {
      res.status(500).render('/statics/500', { error: err });
    });
}


function createCommentRoute(req, res, next) {

  req.body.createdBy = req.user;

  WildlifePosts
    .findById(req.params.id)
    .exec()
    .then((wildlifePost) => {
      if(!wildlifePost) return res.notFound();

      wildlifePost.comments.push(req.body); // create an embedded record
      return wildlifePost.save();
    })
    .then((wildlifePost) => res.redirect(`/wildlifePosts/${wildlifePost.id}`))
    .catch(next);
}

function deleteCommentRoute(req, res, next) {
  WildlifePosts
    .findById(req.params.id)
    .exec()
    .then((wildlifePost) => {
      if(!wildlifePost) return res.notFound();
      // get the embedded record by it's id
      const comment = wildlifePost.comments.id(req.params.commentId);
      comment.remove();

      return wildlifePost.save();
    })
    .then((wildlifePost) => res.redirect(`/wildlifePosts/${wildlifePost.id}`))
    .catch(next);
}

module.exports = {
  index: wildlifePostsIndex,
  new: wildlifePostsNew,
  show: wildlifePostsShow,
  create: wildlifePostsCreate,
  edit: wildlifePostsEdit,
  update: wildlifePostsUpdate,
  delete: wildlifePostsDelete,
  createComment: createCommentRoute,
  deleteComment: deleteCommentRoute,
  mapPage: wildlifePostsMap
};
