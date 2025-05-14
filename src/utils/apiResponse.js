class ApiResponse {
    constructor(res) {
        this.res = res;
    }

    success(data, message = 'Thành công') {
        this.res.status(200).json({
            success: true,
            message,
            data
        });
    }

    created(data, message = 'Tạo thành công') {
        this.res.status(201).json({
            success: true,
            message,
            data
        });
    }

    updated(data, message = 'Sửa thành công') {
        this.res.status(201).json({
            success: true,
            message,
            data
        });
    }

    error(statusCode = 400, message = 'Error') {
        this.res.status(statusCode).json({
            success: false,
            message
        });
    }
}

export default ApiResponse;
