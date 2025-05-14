// import { createLogger, format, transports } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

// const logFormat = format.printf(({ level, message, timestamp, stack }) => {
//     return `${timestamp} [${level}]: ${stack || message}`;
// });

// const vietnamTime = () => new Date().toLocaleString('vi-VN', {
//     timeZone: 'Asia/Ho_Chi_Minh'
// });

// const logger = createLogger({
//     level: 'info',
//     format: format.combine(
//         // timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         format.timestamp({ format: vietnamTime }),
//         format.errors({ stack: true }),
//         format.json()
//     ),
//     transports: [
//         // Console transport
//         new transports.Console({
//             format: format.combine(colorize(), logFormat)
//         }),
//         // Daily rotate file transport
//         new DailyRotateFile({
//             filename: 'logs/application-%DATE%.log',
//             datePattern: 'YYYY-MM-DD',
//             zippedArchive: true,
//             maxSize: '20m',
//             maxFiles: '14d',
//             format: combine(logFormat)
//         })
//     ],
//     exceptionHandlers: [
//         new transports.File({ filename: 'logs/exceptions.log' })
//     ]
// });

// // module.exports = logger;
// module.exports = {
//     logger,
//     logRequest: (req, res, next) => {
//         logger.info(`${req.method} ${req.originalUrl}`);
//         next();
//     }
// };


import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// 1. Định nghĩa format log
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// 2. Cấu hình timezone Việt Nam (tối ưu 2025)
const timezoneConfig = {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};

// 3. Tạo logger chính
export const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: () => new Date().toLocaleString('vi-VN', timezoneConfig) }),
        errors({ stack: true }),
        format.json()
    ),
    transports: [
        // Log ra console (có màu)
        new transports.Console({
            format: combine(colorize(), logFormat)
        }),
        // Log xoay vòng theo ngày
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: combine(logFormat) // Sửa từ 'combine' -> 'format.combine'
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' })
    ]
});

// 4. Middleware cho Express
export const logRequest = (req, res, next) => {
    logger.info(`[${req.ip}] ${req.method} ${req.originalUrl}`);
    next();
};
