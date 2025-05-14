import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Tên đăng nhập là bắt buộc'],
        unique: [true, 'Tên đăng nhập đã tồn tại'],
        trim: true,
        minlength: [3, 'Tên đăng nhập phải từ 3 ký tự'],
        maxlength: [50, 'Tên đăng nhập không quá 50 ký tự']
    },
    fullName: {
        type: String,
        required: [true, 'Họ tên là bắt buộc'],
        minlength: [3, 'Tên đăng nhập phải từ 3 ký tự'],
        maxlength: [50, 'Tên đăng nhập không quá 50 ký tự']
    },
    avatar: {
        type: String,
        required: false,
        default: ''
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: [true, 'Email đã tồn tại'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải từ 6 ký tự'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Tạo index cho tìm kiếm nhanh
AccountSchema.index({ username: 'text' });

// Middleware mã hóa mật khẩu trước khi lưu
AccountSchema.pre('save', async function (next) {
    // Chỉ mã hóa khi mật khẩu được thay đổi
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Phương thức kiểm tra mật khẩu
AccountSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Phương thức tạo JWT token
AccountSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

export default mongoose.model('Account', AccountSchema);
