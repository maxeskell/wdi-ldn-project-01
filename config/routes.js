const router = require('express').Router();
const wildlifePostsController = require('../controllers/wildlifePosts');
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const oauth = require('../controllers/oauth');
const secureRoute = require('../lib/secureRoute');
const upload = require('../lib/upload');

router.get('/', (req, res) => res.render('statics/index'));

router.route('/wildlifePosts')
  .get(wildlifePostsController.index)
  .post(wildlifePostsController.create);

router.route('/wildlifePosts/new')
  .get(wildlifePostsController.new);

router.route('/wildlifePosts/:id')
  .get(wildlifePostsController.show)
  .put(wildlifePostsController.update)
  .delete(wildlifePostsController.delete);

router.route('/wildlifePosts/:id/edit')
  .get(wildlifePostsController.edit);

router.route('/profile')
  .get(secureRoute, registrations.show)
  .post(secureRoute, upload.single('image'), registrations.update)
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
