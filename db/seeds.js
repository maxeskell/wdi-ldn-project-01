const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(dbURI);

const WildlifePost = require('../models/wildlifePost');

WildlifePost.collection.drop();

WildlifePost
.create([{
  title: 'otters at play',
  createdBy: `max eskell`,
  mainContent: `otters`,
  description: `In George Orwell`,
  lat: 50.1,
  lon: 0.01

}])
.then((wildlifePosts) => {
  console.log(`${wildlifePosts.length} wildlifePosts created!`);
})
.catch((err) => {
  console.log(err);
})
.finally(() => {
  mongoose.connection.close();
});
