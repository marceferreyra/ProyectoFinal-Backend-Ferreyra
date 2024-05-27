const Cart = require('../dao/db/models/cartModel'); 
const cartService = require(`../dao/db/services/cartService`)

exports.renderCartView = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.product');
        
        
        if (cart) {
            const plainCart = cart.toObject({ getters: true });
            res.render('carts', { carts: [plainCart], cartId: cartId });
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        req.logger.error(error);
        res.status(500).send('Error interno del servidor');
    }
};
