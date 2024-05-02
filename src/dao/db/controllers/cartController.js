const CustomError = require('../services/errors/customErrors');
const EErrors = require('../services/errors/enumErrors');
const errorInfo = require('../services/errors/info');

const CartService = require('../services/cartService');
const Cart = require('../models/cartModel');

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');

        if (carts.length > 0) {
            const formattedResponse = JSON.stringify(carts, null, '\t');
            res.type('json').send(formattedResponse);
        } else {
            CustomError.createError({
                name: 'Cart Not Found Error',
                message: errorInfo[EErrors.CART_NOT_FOUND],
                code: EErrors.CART_NOT_FOUND
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: errorInfo[EErrors.SERVER_ERROR] });
    }
};

exports.createCart = async (req, res) => {
    try {
        const newCart = await CartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: errorInfo[EErrors.CART_CREATION_ERROR] });
    }
};

exports.getCartById = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await Cart.findById(cartId).populate('products.product');

        if (cart) {
            const plainCart = cart.toObject({ getters: true });
            res.render('carts', { carts: [plainCart], cartId: cartId });
        } else {
            CustomError.createError({
                name: 'Cart Not Found Error',
                message: errorInfo[EErrors.CART_NOT_FOUND],
                code: EErrors.CART_NOT_FOUND
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: errorInfo[EErrors.SERVER_ERROR] });
    }
};

exports.updateCartById = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const updatedCart = await Cart.findByIdAndUpdate(cartId, req.body, { new: true });
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: errorInfo[EErrors.CART_UPDATE_ERROR] });
    }
};

exports.deleteCartById = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const result = await CartService.deleteCart(cartId);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: errorInfo[EErrors.CART_DELETION_ERROR] });
    }
};

exports.addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await CartService.addProductToCart(cartId, productId);
        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: errorInfo[EErrors.PRODUCT_ADDITION_ERROR] });
    }
};

exports.updateProductQuantityInCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        const result = await CartService.updateProductQuantityInCart(cartId, productId, quantity);
        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: errorInfo[EErrors.PRODUCT_QUANTITY_UPDATE_ERROR] });
    }
};

exports.deleteProductFromCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await CartService.deleteProductFromCart(cartId, productId);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: errorInfo[EErrors.PRODUCT_DELETION_ERROR] });
    }
};

exports.clearCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const result = await CartService.clearCart(cartId);

        if (result.error) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(200).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error:', error);
        console.log(EErrors)
        res.status(500).json({ error: errorInfo[EErrors.CART_CLEAR_ERROR] });
    }
};

exports.purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const purchaserId = req.session.user; 

    try {
        const { ticket, productsNotPurchased } = await CartService.purchaseCart(cartId, purchaserId);

        if (productsNotPurchased.length > 0) {
            res.status(200).json({ ticket, productsNotPurchased });
        } else {
            res.status(200).json({ ticket });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: errorInfo[EErrors.PURCHASE_ERROR] });
    }
};

