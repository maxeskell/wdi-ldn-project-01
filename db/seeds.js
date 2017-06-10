const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI } = require('../config/environment');

mongoose.connect(dbURI);

const WildlifePost = require('../models/wildlifePost');

WildlifePost.collection.drop();

WildlifePost
.create([{
  title: 'otters at play',
  createdBy: `max eskell`,
  mainContent: `otters`,
  description: `Two sea otters, holding kelp floating on the sea`,
  image: `https://alaska.usgs.gov/science/biology/nearshore_marine/images/sea_otters/otter_mom_pup1.jpg`,
  lat: 50.1,
  lon: 0.01
} , {
  title: 'otters',
  createdBy: `maell`,
  mainContent: `beavers`,
  description: `Two sea otters, holding kelp floating on the sea`,
  image: `https://alaska.usgs.gov/science/biology/nearshore_marine/images/sea_otters/otter_mom_pup1.jpg`,
  lat: 50.1,
  lon: 0.01
} , {
  title: ' play',
  createdBy: `eskell`,
  mainContent: `meercat`,
  description: `Two sea otters, holding kelp floating on the sea`,
  image: `https://alaska.usgs.gov/science/biology/nearshore_marine/images/sea_otters/otter_mom_pup1.jpg`,
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
