const CartService = require('../services/cartService');
const Cart = require('../models/cartModel');

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');

        if (carts.length > 0) {
            const formattedResponse = JSON.stringify(carts, null, '\t');
            res.type('json').send(formattedResponse);
        } else {
            const errorResponse = {
                status: 'error',
                error: 'No se encontraron carritos.',
            };
            res.status(404).json(errorResponse);
        }
    } catch (error) {
        console.error(error);

        const errorResponse = {
            status: 'error',
            error: 'Error al obtener los carritos desde MongoDB.',
        };

        res.status(500).json(errorResponse);
    }
};

exports.createCart = async (req, res) => {
    try {
        const newCart = await CartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear un carrito en MongoDB.' });
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
            const errorResponse = {
                status: 'error',
                error: `No se encontró ningún carrito con el ID ${cartId}`,
            };
            res.status(404).json(errorResponse);
        }
    } catch (error) {
        console.error(error);
        const errorResponse = {
            status: 'error',
            error: 'Error al obtener el carrito desde MongoDB.',
        };
        res.status(500).json(errorResponse);
    }
};

exports.updateCartById = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const updatedCart = await Cart.findByIdAndUpdate(cartId, req.body, { new: true });
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar un carrito en MongoDB.' });
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
        res.status(500).json({ error: 'Error interno del servidor al eliminar un carrito desde MongoDB.' });
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
        res.status(500).json({ error: 'Error interno del servidor al agregar un producto al carrito en MongoDB.' });
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
        res.status(500).json({ error: 'Error interno del servidor al actualizar la cantidad de un producto en el carrito en MongoDB.' });
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
        res.status(500).json({ error: 'Error interno del servidor al eliminar un producto del carrito desde MongoDB.' });
    }
};