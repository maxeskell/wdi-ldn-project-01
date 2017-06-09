const s3 = require('./s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid');

module.exports = multer({
  storage: multerS3({
    s3,
    bucket: 'wdi-27-aws-intro',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, next) {
      const ext = file.mimetype.replace('image/', '');
      const filename = uuid.v4();
      next(null, `${filename}.${ext}`);
    },
    fileFilter(req, file, next) {
      const whitelist = ['image/png', 'image/jpeg', 'image/gif'];
      next(null, whitelist.includes(file.mimetype));
    },
    limits: {
      fileSize: 1024 * 1024 * 2
    }
  })
});