
// ======================
// 0. KHỞI TẠO APP
// ======================
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logRequest } from './utils/winston.js';
import errorHandler from './middlewares/errorHandler.js';
import productRoutes from './modules/product/routes/product.routes.js';
import categoryRoutes from './modules/category/routes/category.routes.js';
import uploadRoutes from './modules/upload/routes/upload.routes.js';
import accountRoutes from './modules/account/routes/account.routes.js';
import authRoutes from './modules/account/routes/authentication.routes.js';
import { connect } from './config/database.js';
import path from 'path';
import cookieParser from 'cookie-parser';


const app = express();

// ======================
// 1. KẾT NỐI DATABASE (Async)
// ======================
async function initDatabase() {
    try {
        await connect(); // Đảm bảo DB kết nối trước khi start server

        mongoose.connection.on('disconnected', () => {
            console.log('❌ Mất kết nối MongoDB');
            // Tự động kết nối lại sau 5s
            setTimeout(connect, 5000);
        });
    } catch (err) {
        console.error('🚨 Khởi động thất bại do lỗi DB:', err);
        process.exit(1);
    }
}


// ======================
// 2. MIDDLEWARE CẤU HÌNH
// ======================
app.use(helmet()); // Bảo mật headers
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Credentials'
    ]
}));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' })); // Giới hạn kích thước request

// Middleware kiểm tra DB state
app.use((req, res, next) => {
    res.locals.dbState = mongoose.STATES[mongoose.connection.readyState];
    next();
});
app.use(logRequest);


// Rate limiting (100 requests/phút)
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 1 phút'
});
app.use('/api', limiter);


// ======================
// 3. ĐỊNH TUYẾN (ROUTES)
// ======================
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/auth', authRoutes);

//folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Route health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        dbState: mongoose.connection.readyState,
        timestamp: new Date().toISOString()
    });
});
app.get('/api/db-status', (req, res) => {
    res.json({
        status: 'OK',
        dbState: res.locals.dbState,
        dbName: mongoose.connection?.name,
        lastConnected: mongoose.connection?.startTime
    });
});

// ======================
// 4. XỬ LÝ LỖI
// ======================
app.use(errorHandler);

// Xử lý lỗi unhandled rejection (ví dụ: MongoDB timeout)
process.on('unhandledRejection', (err) => {
    console.error('💥 UNHANDLED REJECTION!', err.name, err.message);
    server.close(() => process.exit(1));
});


// ======================
// 5. KHỞI CHẠY SERVER
// ======================
async function startServer() {
    await initDatabase();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`
        🟢 Server ready
        Port: ${PORT}
        DB: ${mongoose.connection.name}
        Mode: ${process.env.NODE_ENV}
      `);
    });
}

startServer();

//Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM nhận được. Đóng server...');
    server.close(() => {
        console.log('💤 Server đã tắt');
        mongoose.connection.close(false, () => {
            console.log('📦 Đóng kết nối MongoDB');
            process.exit(0);
        });
    });
});

