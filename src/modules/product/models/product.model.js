import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên sản phẩm là bắt buộc'],
        trim: true,
        maxlength: [100, 'Tên sản phẩm không quá 100 ký tự']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Giá sản phẩm không thể âm'],
        set: v => parseFloat(v.toFixed(2)) // Làm tròn 2 số thập phân
    },
    description: {
        type: String,
        required: false,
        maxlength: [500, 'Mô tả không quá 500 ký tự']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    thumbnail: {
        type: String,
        required: false,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Tạo index cho tìm kiếm nhanh
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', ProductSchema);
