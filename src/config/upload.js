import multer from 'multer';
import { MAX_FILE_SIZE, UPLOAD_TEMP_PRODUCT_DIR } from '../utils/constants.js';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), UPLOAD_TEMP_PRODUCT_DIR);

        // Kiểm tra nếu folder chưa tồn tại thì tạo
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true, mode: 0o755 });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `image-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
        return cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter,
});

export default upload;
