export const validate = (schema, options = {}) => {
    return (req, res, next) => {
        const { error } = schema.validateAsync(
            options.location === 'params' ? req.params :
                options.location === 'query' ? req.query :
                    req.body,
            {
                abortEarly: false,
                allowUnknown: false,
                ...options
            }
        );

        if (error) {
            const errors = error.details.reduce((acc, detail) => {
                const key = detail.path.join('.');
                acc[key] = detail.message.replace(/"/g, '');
                return acc;
            }, {});

            return res.status(422).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors
            });
        }

        next();
    };
};
