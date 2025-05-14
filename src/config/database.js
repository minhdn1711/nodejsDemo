import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from '../utils/winston.js';

// Kiểm tra biến môi trường trước khi kết nối
const validateEnv = () => {
    if (!process.env.MONGODB_URI) {
        logger.error('⛔ Thiếu biến MONGODB_URI trong .env');
        throw new Error('Database configuration error');
    }
};

export const connect = async () => {
    try {
        validateEnv();

        // Chỉ kết nối nếu chưa kết nối
        if (mongoose.connection.readyState === 1) {
            logger.info('♻️ Sử dụng kết nối MongoDB đã tồn tại');
            return mongoose.connection;
        }

        console.log('🔄 Đang kết nối MongoDB...', new Date().toISOString());
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            retryWrites: true,
            retryReads: true

        });
        console.log(`📊 Đã kết nối tới: ${conn.connection.host}/${conn.connection.name}`);
    } catch (err) {
        console.error('⛔ Lỗi kết nối MongoDB:', err.message);
        process.exit(1);
    }

};

