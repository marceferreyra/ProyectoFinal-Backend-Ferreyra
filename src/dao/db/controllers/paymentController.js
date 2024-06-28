const PaymentService = require('../services/paymentService');
const Cart = require('../models/cartModel');

const paymentService = new PaymentService();

exports.processPayment = async (req, res) => {
    const cartId = req.params.cid;
    const purchaserId = req.session.user ? req.session.user._id : null;
    const stripeToken = req.body.stripeToken;

    try {
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: `No se encontró ningún carrito con el ID ${cartId}` });
        }

        const totalPrice = cart.products.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        const productsPurchased = cart.products.map(item => ({
            productId: item.product._id,
            title: item.product.title,
            quantity: item.quantity,
            price: item.product.price
        }));

        const paymentIntentInfo = await paymentService.createPaymentIntent({
            amount: totalPrice * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method_data: {
                type: 'card',
                card: {
                    token: stripeToken 
                }
            },
            metadata: {
                purchaserId,
                cartId,
                productsPurchased: JSON.stringify(productsPurchased)
            },
        });

        // Confirm the payment intent
        await paymentService.confirmPaymentIntent(paymentIntentInfo.id);

        res.json({ client_secret: paymentIntentInfo.client_secret });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).json({ error: 'Error al procesar el pago', message: error.message });
    }
};
