const multer = require('multer');
const path = require('path');
const User = require('../dao/db/models/userModel')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'general';
        if (file.fieldname === 'profile') {
            folder = 'profiles';
        } else if (file.fieldname === 'product') {
            folder = 'products';
        } else if (file.fieldname === 'document') {
            folder = 'documents';
        }
        cb(null, path.join(__dirname, '..', 'public', 'uploads', folder));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
