const router = require('express').Router();
const wildlifePostsController = require('../controllers/wildlifePosts');
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const oauth = require('../controllers/oauth');
const secureRoute = require('../lib/secureRoute');
const upload = require('../lib/upload');

router.get('/', (req, res) => res.render('statics/homepage'));

router.route('/wildlifePosts')
  .get(wildlifePostsController.index)
  .post(secureRoute, upload.single('image'), wildlifePostsController.create);

router.route('/wildlifePosts/new')
  .get(secureRoute, wildlifePostsController.new);

router.route('/wildlifePosts/:id')
  .get(wildlifePostsController.show)
  .post(secureRoute, upload.single('image'), wildlifePostsController.update)
  .delete(secureRoute, wildlifePostsController.delete);

router.route('/wildlifePosts/:id/edit')
  .get(secureRoute, wildlifePostsController.edit);

// router.route('/wildlifePosts/:id/comments')
//   .post(secureRoute, wildlifePostsController.createComment);
//
// router.route('/wildlifePosts/:id/comments/:commentId')
//   .delete(secureRoute, wildlifePostsController.deleteComment);

router.route('/profile')
  .get(secureRoute, registrations.show);

router.route('/profile')
  .delete(secureRoute, registrations.delete);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

router.route('/oauth/github')
  .get(oauth.github);

router.all('*', (req, res) => res.notFound());

module.exports = router;
