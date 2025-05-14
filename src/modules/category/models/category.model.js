import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên loại sản phẩm là bắt buộc!'],
        unique: true,
        trim: true,
        maxlength: [100, 'Tên sản phẩm không quá 100 ký tự']
    },
    description: {
        type: String,
        maxlength: [1000, 'Mô tả không quá 200 ký tự']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add text index for search functionality
categorySchema.index({ name: 'text' });

export default mongoose.model('Category', categorySchema);
