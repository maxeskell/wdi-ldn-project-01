const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI } = require('../config/environment');
mongoose.connect(dbURI);

const WildlifePost = require('./models/WildlifePost');
const User = require('./models/User');

User.collection.drop();
WildlifePost.collection.drop();

User
.create([{
  username: 'markescort',
  email: 'mark@escort.com',
  postcode: 'SW1 1HW',
  lat: 51.515,
  lng: -0.05,
  image: 'download.jpeg',
  password: '',
  githubId: '',
  facebookId: ''
}])
.then((users) => {
  console.log(`${users.length} user(s) created!`);
  return WildlifePost
  .create([{
    title: 'Owl on the wing',
    createdBy: users[0],
    mainContent: 'Barn owl',
    description: 'Close up of white owl in flight over a green field',
    image: 'download.jpeg',
    lat: 51.5103,
    lng: -0.07,
    keywords: ['owl', 'bird'],
    comments: [{
      content: 'Great photo!',
      createdBy: users[0]
    }]
  }]);
})
.then((wildlifePosts) => {
  console.log(`${wildlifePosts.length} WildlifePost(s) created!`);
})
.catch((err) => {
  console.log(err);
})
.finally(() => {
  mongoose.connection.close();
});
