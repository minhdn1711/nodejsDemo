import UploadService from '../services/upload.service.js';
import ApiResponse from '../../../utils/apiResponse.js';
import ApiError from '../../../utils/apiError.js';

class UploadController {
    async uploadImage(req, res, next) {
        try {
            if (!req.file) {
                throw new ApiError(422, 'No file uploaded');
            }
            const fileUpload = await UploadService.processImageLocal(req.file, req.body.type);

            new ApiResponse(res).success(fileUpload, "Upload thành công");
        } catch (error) {
            next(error);
        }
    }
}

export default new UploadController();
