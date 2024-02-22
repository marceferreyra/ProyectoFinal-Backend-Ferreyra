const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ]
});

cartSchema.pre('findOne', function(){
    this.populate('products.product')
    
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;





