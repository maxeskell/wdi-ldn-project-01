const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

commentSchema.methods.belongsTo = function commentBelongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};

const wildlifePostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  mainContent: { type: String, required: true },
  description: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  comments: [ commentSchema ]
});

wildlifePostSchema.methods.belongsTo = function hotelBelongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};

module.exports = mongoose.model('WildlifePost', wildlifePostSchema);
