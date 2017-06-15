const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI } = require('../config/environment');
mongoose.connect(dbURI);

const WildlifePost = require('../models/WildlifePost');
const User = require('../models/User');

User.collection.drop();
WildlifePost.collection.drop();

// User
// .create([{
//   username: 'maxeskell',
//   email: 'max@hotmail.com',
//   postcode: 'SW1 1HW',
//   lat: 51.515,
//   lng: -0.05,
//   image: '0a162dd6-afb3-4d0e-9458-b44edfc36712.jpeg',
//   password: '',
//   githubId: 12345678,
//   facebookId: 123456
// }])
// .then((users) => {
//   console.log(`${users.length} user(s) created!`);
//   return WildlifePost
//   .create([{
//     title: 'Otter',
//     createdBy: users[0],
//     mainContent: 'otter',
//     description: 'otter in river',
//     image: '0a162dd6-afb3-4d0e-9458-b44edfc36712.jpeg',
//     lat: 51.5103,
//     lng: -0.07,
//     keywords: ['otter', 'fauna'],
//     comments: [{
//       content: 'content',
//       createdBy: users[0]
//     }]
//   }]);
// })
.then((wildlifePosts) => {
  console.log(`${wildlifePosts.length} WildlifePost(s) created!`);
})
.catch((err) => {
  console.log(err);
})
.finally(() => {
  mongoose.connection.close();
});
