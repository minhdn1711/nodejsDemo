import fs from 'fs';
import path from 'path';
import { FILE_TYPES, MAX_FILE_SIZE, TYPE_UPLOAD, UPLOAD_TEMP_DIRS } from '../../../utils/constants.js';
import ApiError from '../../../utils/apiError.js';

class UploadService {
    async validateFile(file, type) {
        if (!file) throw ApiError.badRequest('No file uploaded');

        // Validate file type
        if (!FILE_TYPES.includes(file.mimetype)) {
            throw ApiError.unsupportedMediaType('Invalid file type');
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            throw ApiError.payloadTooLarge(`File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        }

        // Validate upload type
        if (!type) {
            throw ApiError.badRequest('Upload type is required');
        }

        if (!TYPE_UPLOAD.includes(type)) {
            throw ApiError.badRequest(`Invalid upload type. Allowed types are: ${TYPE_UPLOAD.join(', ')}`);
        }
    }
    async processImageLocal(file, type) {
        await this.validateFile(file, type); // Reuse validation
        // Tạo đường dẫn thư mục tải lên
        const uploadDir = this.getUploadDir(type);
        const relativePath = this.getRelativeUploadPath(type);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileExt = path.extname(file.originalname).toLowerCase();
        const newFilename = `${Date.now()}${fileExt}`;
        const filePath = path.join(uploadDir, newFilename);

        return new Promise((resolve, reject) => {
            fs.rename(file.path, filePath, (err) => {
                if (err) {
                    reject(ApiError.internal('File processing failed'));
                }
                resolve({
                    url: `${relativePath}/${newFilename}`,

                    mimetype: file.mimetype,
                    size: file.size
                });
            });
        });
    }

    getUploadDir(type) {
        return path.resolve(`./${UPLOAD_TEMP_DIRS[type]}`);
    }

    getRelativeUploadPath(type) {
        return UPLOAD_TEMP_DIRS[type] || '';
    }
}

export default new UploadService();
