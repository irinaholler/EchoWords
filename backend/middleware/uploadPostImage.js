import multer from 'multer';
import path from 'path';

const postStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/posts'),
    filename: (req, file, cb) =>
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});

const uploadPostImage = multer({
    storage: postStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
    }
});

export default uploadPostImage;
