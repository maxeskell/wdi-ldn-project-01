const mongoose = require('mongoose');

const wildlifePostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('WildlifePost', wildlifePostSchema);
