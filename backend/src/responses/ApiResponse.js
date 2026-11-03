class ApiResponse {
    static success(res, statusCode, data){
        return res.status(statusCode).json({
            success: true,
            data
        });
    }

    static error(res, statusCode, message, field){
        const response = {
            success: false,
            message
        };
        if (field) response.field = field;
        return res.status(statusCode).json(response);
    }
}

export default ApiResponse;
