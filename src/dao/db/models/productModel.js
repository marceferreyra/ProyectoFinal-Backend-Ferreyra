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
    category: { type: String, required: true, enum: ['calzado', 'accesorios', 'camperas'] }
});

productSchema.plugin(mongoosePaginate); 

const Product = mongoose.model('Product', productSchema);

module.exports = Product;