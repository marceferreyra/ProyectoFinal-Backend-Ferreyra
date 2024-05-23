const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnails: { type: [String], },
    code: { type: String, require: true, unique: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true },
    category: { type: String, required: true, enum: ['calzado', 'accesorios', 'camperas'] },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: '65faffb513b5bb8b23dbe8e4'
    }
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;