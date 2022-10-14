const multer = require('multer');

const fileStorageEngineAvatar = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, './assets/avatars');
    },
    filename: (_req, file, cb) => {
        console.log('aboba')
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileStorageEnginePost = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, './assets/picture-post');
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const uploadAvatar = multer({ storage: fileStorageEngineAvatar });
const uploadPost = multer({ storage: fileStorageEnginePost });

module.exports = { uploadAvatar, uploadPost };



