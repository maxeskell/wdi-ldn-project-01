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
  image: {type: String },
  lat: { type: Number },
  lng: { type: Number },
  keywords: [{ type: String }],
  comments: [ commentSchema ]
});

wildlifePostSchema.methods.belongsTo = function wildlifePostBelongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};

wildlifePostSchema
  .virtual('imageSRC')
  .get(function getImageSRC() {
    if(!this.image) return null;
    if(this.image.match(/^http/)) return this.image;
    return `https://s3-eu-west-1.amazonaws.com/${process.env.AWS_BUCKET_NAME_PROJECT1}/${this.image}`;
  });

module.exports = mongoose.model('Post', wildlifePostSchema);

module.exports = mongoose.model('WildlifePost', wildlifePostSchema);
