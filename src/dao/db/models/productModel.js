const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnails: { type: [String], },
    code: { type: String, require: true, unique: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true },
    category: { type: String, required: true, enum: ['calzado', 'accesorios', 'camperas'] }

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
