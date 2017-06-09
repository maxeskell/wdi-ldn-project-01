const mongoose = require('mongoose');

const wildlifePostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdBy: { type: String, required: true },
  mainContent: { type: String, required: true },
  description: { type: String },
  lat: { type: Number },
  lon: { type: Number }
});

module.exports = mongoose.model('WildlifePost', wildlifePostSchema);
