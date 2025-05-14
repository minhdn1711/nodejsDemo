const errorHandler = (err, req, res, next) => {
    const timestamp = new Date().toISOString();

    // Log lỗi với thông tin chi tiết
    console.error(`[${timestamp}] Error:`, {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip || req.connection.remoteAddress
    });

    // Xác định status code
    const statusCode =
        err.statusCode ||
        err.status ||
        (err.name === 'ValidationError' ? 400 : 500);
    const isProduction = process.env.NODE_ENV === 'production';

    // Cấu trúc response
    const response = {
        success: false,
        message: err.message || 'Internal Server Error',
        ...(
            !isProduction && err.stack
                ? { stack: err.stack.split('\n').slice(0, 5) }
                : {}
        ),
        ...(err.details && { details: err.details })
    };

    // Xử lý validation error
    if (err.name === 'ValidationError') {
        response.message = 'Validation Failed';
        response.errors = Object.keys(err.errors).map(key => ({
            field: key,
            message: err.errors[key].message
        }));
    }

    // Xử lý Mongoose duplicate key error
    if (err.code === 11000) {
        response.message = 'Duplicate Key Error';
        response.duplicateFields = Object.keys(err.keyValue);
    }

    // Log lỗi quan trọng
    if (statusCode >= 500) {
        console.error('Critical Server Error:', {
            timestamp,
            message: err.message,
            stack: err.stack
        });
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
